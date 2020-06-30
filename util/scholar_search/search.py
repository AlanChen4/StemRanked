'''
Generates a CSV file that contains every author's name and profile link from a Google Scholar query for an author
'''
import time
import requests

from bs4 import BeautifulSoup
from csv import writer
from itertools import cycle
from requests.exceptions import Timeout, ProxyError, ConnectionError
from scraper_helper import get_proxy_local, gen_headers


session = requests.Session()

def get_profile(name, uni_email):
    '''returns link to google scholar profile based on search query'''
    # base query to work with
    query = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="

    # adds the "+" symbol between fname, lname, and email
    info = '+'.join(name.split(' ')) + f'+{uni_email}'
    query += info

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


def get_faculty(email_domain, starting_id=None, limit=None, strict=False):
    '''writes list of scholar-listed faculty members to .csv file

    :param str email_domain: The email domain of the faculty being searched
    :param str starting_id: The author_id to start searching from
    :param int limit: Maximum number of profiles returned from search
    :param boolean strict: Setting True removes proxies on proxy error
    '''
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

    # prepare proxies
    proxy_path = 'proxies.txt'
    proxy_list = get_proxy_local(proxy_path, n=100)
    proxy_cycle = cycle(proxy_list)
    proxy_ip = next(proxy_cycle)
    proxy = {'https': proxy_ip}

    # initial search query
    next_page = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    next_page += email_domain
    referer = 'https://scholar.google.com/citations?view_op=search_authors'
    next_resp = session.get(
            url=next_page,
            headers=gen_headers(referer),
            proxies=proxy)

    # skip collecting information from base page if there is a beginning author id specified
    if starting_id == None:
        current_profile_count += get_profile(next_resp.text)

    # continue going to next page, until last page is reached, or when limit is hit
    while True:
        proxy = {'https': proxy_ip}
        try:
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
        # Index Error occurs when banned
        except IndexError:
            pass

        # load the html of the next page
        try:
            # set referer in the header as the previous link requested
            referer = next_page

            next_page = f'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors={email_domain}&after_author={after_author_id}&astart={profile_id}'
            next_resp = session.get(
                    url=next_page,
                    timeout=5,
                    headers=gen_headers(referer),
                    proxies=proxy)
        except Timeout:
            print('request timed out')
            continue
        # remove bad proxy and continue
        except ProxyError:
            if strict:
                proxy_list.remove(proxy_ip)
                proxy_cycle = cycle(proxy_list)
                proxy_ip = next(proxy_cycle)
                print(f'[ProxyError] Removed {proxy_ip}')
                print(f'[Update] {len(proxy_list)} proxies remaining')
                continue
            else:
                print(f'[ProxyError] (Strict: False) {proxy_list}')
                continue
        except ConnectionError:
            print('[ConnectionError] Moving to next proxy')
            continue
        else:
            pass

        try:
            # locate the "next" button on the scholar page
            soup = BeautifulSoup(next_resp.text, 'html.parser')
            nav_btns = soup.find_all('button', attrs={'aria-label':True})
            next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))

            # save current profiles onto .csv file and update counter
            current_profile_count += get_profile(next_resp.text)
        # IndexError occurs when IP Banned
        except IndexError:
            pass

        proxy_ip = next(proxy_cycle)

        # if there is no KeyError, disabled is True, and last page has been reached
        try:
            disable_check = next_btn[0]['disabled']
            print(f'last page reached: {next_page}')
            print(f"[FINISHED] {current_profile_count} profile's collected")
            break
        except KeyError:
            time_record = str(time.time() - start_time)
            print(f'[{time_record}] searched through profile #{current_profile_count}')
            continue
        except IndexError:
            proxy_list.remove(proxy_ip)
            proxy_cycle = cycle(proxy_list)
            proxy_ip = next(proxy_cycle)
            print(f'IP Banned! Removed {proxy_ip}')
            print(f'[Update] {len(proxy_list)} proxies remaining')
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
        with open('./data/profiles.csv', 'a+', newline='', encoding='utf-8') as f:
            csv_writer = writer(f)
            info = [profile.text, profile.findChildren()[0]['href']]
            csv_writer.writerow(info)
    return len(current_profiles)


def main():
    get_faculty('unc.edu', starting_id=None, limit=None, strict=False)


if __name__ == '__main__':
    main()

