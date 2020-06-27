'''
Generates a CSV file that contains every author's name and profile link from a Google Scholar query for an author
'''
import time
import requests

from bs4 import BeautifulSoup
from csv import writer
from fake_useragent import UserAgent
from itertools import cycle
from requests.exceptions import Timeout


session = requests.Session()

def get_profile(name, uni_email):
    '''returns link to google scholar profile based on search query'''
    # base query to work with
    query = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="

    # adds the "+" symbol between fname, lname, and email
    info = '+'.join(name.split(' ')) + f'+{uni_email}'
    query += info

    # TODO: implement proxy rotation and random user-agent
    try:
        search_resp = session.get(url=query, timeout=3)
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
    '''writes list of scholar-listed faculty members to .csv file'''
    # check if there is a search limit
    if limit == None:
        search_limit = 10000000
    else:
        search_limit = limit

    # remains True while have not loaded the first profile page
    first_page = True

    # total number of profiles written to .csv file
    current_profile_count = 0

    # start time, used for debugging
    start_time = time.time()

    # initial search query
    next_page = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    next_page += email_domain
    next_resp = session.get(url=next_page)

    # skip collecting information from base page if there is a beginning author id specified
    if starting_id == None:
        current_profile_count += get_profile(next_resp.text)

    # continue going to next page, until last page is reached, or when limit is hit
    while True:
        # locate the btn that navigates to next page
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

        # load the html of the next page
        try:
            next_page = f'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors={email_domain}&after_author={after_author_id}&astart={profile_id}'
            next_resp = session.get(url=next_page, timeout=3)
        except Timeout:
            print('request timed out')
            continue
        else:
            pass

        # locate the "next" button on the scholar page
        soup = BeautifulSoup(next_resp.text, 'html.parser')
        nav_btns = soup.find_all('button', attrs={'aria-label':True})
        next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))

        # save current profiles onto .csv file and update counter
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
    '''
    writes the profiles onto a .csv file
    and returns the total number of profiles added
    '''
    profiles = []
    current_profiles = BeautifulSoup(page_html, 'html.parser')
    current_profiles = current_profiles.find_all('h3', class_='gs_ai_name')
    for profile in current_profiles:
        with open('./data/data.csv', 'a+', newline='') as f:
            csv_writer = writer(f)
            info = [profile.text, profile.findChildren()[0]['href']]
            csv_writer.writerow(info)
    return len(current_profiles)


def main():
    get_faculty('xin+chen', starting_id=None, limit=500)


if __name__ == '__main__':
    main()

