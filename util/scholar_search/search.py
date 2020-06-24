import time
import requests
from bs4 import BeautifulSoup
from csv import writer
from requests.exceptions import Timeout


session = requests.Session()

def get_profile(name, uni_email):
    '''returns link to google scholar profile based on search query'''
    query = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="

    # adds + symbol between fname, lname, and email
    info = '+'.join(name.split(' ')) + f'+{uni_email}'
    query += info

    # TODO: implement proxy rotation and random user-agent
    try:
        search_resp = session.get(
            url=query,
            timeout=3
        )
    except Timeout:
        print('request timed out')
    else:
        pass

    if 200 <= search_resp.status_code < 300:
        soup = BeautifulSoup(search_resp.text, 'html.parser')
        links = soup.find_all('a')
        profile_links = list(filter(lambda x: 'citations?hl=en&user' in str(x['href']), links))
        try:
            return 'https://scholar.google.com' + profile_links[0]['href']
        except IndexError:
            return 'no profile links found'
    else:
        print('search attempt failed')


def get_faculty(email_domain, starting_id=None, limit=None ):
    '''return list of scholar-listed faculty members'''
    if limit == None:
        # no limit
        search_limit = 10000000
    else:
        search_limit = limit
    first_page = True
    current_profile_count = 0

    next_page = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    next_page += email_domain

    next_resp = session.get(
        url=next_page,
    )

    start_time = time.time()

    if starting_id == None:
        current_profile_count += get_profile(next_resp.text)

    # continue going to next page, until last page is reached, or when limit is hit
    while True:
        # locate the btn to goto next page
        soup = BeautifulSoup(next_resp.text, 'html.parser')
        nav_btns = soup.find_all('button', attrs={'aria-label':True})
        next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))

        # find the link on the button to go the next page 
        next_link = next_btn[0]['onclick'][17:-1]
        profile_id = (next_link.split('\\x3d')[-1])

        # check if there is a specified starting author
        if (starting_id == None) or (not first_page):
            after_author_id = (next_link.split('\\x3d')[-2])[:-10]
        else:
            after_author_id = starting_id
            first_page = False

        # check if limit is reached
        if current_profile_count >= search_limit:
            print(f'final [#{current_profile_count}]: {after_author_id}')
            break

        next_page = f'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors={email_domain}&after_author={after_author_id}&astart={profile_id}'

        # load the html of the next page
        try:
            next_resp = session.get(
                url=next_page,
                timeout=3
            )
        except Timeout:
            print('request timed out')
            continue
        else:
            pass

        soup = BeautifulSoup(next_resp.text, 'html.parser')
        nav_btns = soup.find_all('button', attrs={'aria-label':True})
        next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))

        current_profile_count += get_profile(next_resp.text)

        # if there is no KeyError, disabled is True, and last page has been reached
        try:
            disable_check = next_btn[0]['disabled']
            print(f'last page reached: {next_page}')
            print(f"[FINISHED] {current_profile_count} profile's collected")
            break
        except KeyError:
            time_record = str(time.time() - start_time)[:4]
            print(f'[{time_record}] searched through profile #{current_profile_count}')
            continue
        except IndexError:
            print('button could not be found!')
            print(next_resp.text)
            continue


def get_profile(page_html):
    '''writes the profiles onto a .json file'''
    '''returns the total number of profiles added'''
    profiles = []
    current_profiles = BeautifulSoup(page_html, 'html.parser')
    current_profiles = current_profiles.find_all('h3', class_='gs_ai_name')
    for profile in current_profiles:
        with open('data.csv', 'a+', newline='') as f:
            csv_writer = writer(f)
            info = [profile.text, profile.findChildren()[0]['href']]
            csv_writer.writerow(info)
    return len(current_profiles)


def main():
    get_faculty('duke.edu', starting_id="z_riAPj___8J", limit=500)


if __name__ == '__main__':
    main()
