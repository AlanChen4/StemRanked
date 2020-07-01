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


def get_faculty(email_domain, proxy_path, starting_author=None,
                limit=1000000, proxy_num=10, strict=False):
    '''
    appends to a .csv in data/profiles.csv with scholar profile links
    related to an email domain

    :param str email_domain: Email domain belonging to the university being searched
    :param str proxy_path: Path to the text file containing the list of proxies
    :param str starting_author: Start searching from this author ID, instead of base search
    :param int limit: Maximum number of results to be searched for
    :param int proxy_num: Number of proxies to use
    :param boolean strict: While False, proxies will be removed when IP banned'''

    # debugging variables
    profile_count = 0
    start_time = time.time()

    # reqeusts session variables
    referer = 'https://scholar.google.com/citations?view_op=search_authors'
    base_url = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    base_url += email_domain

    # set up proxies
    proxy_list = get_proxy_local(proxy_path, n=proxy_num)
    proxy_cycle = cycle(proxy_list)
    proxy_ip = next(proxy_cycle)

    # initial search for base results
    try:
        proxy = {'https': proxy_ip}
        base_resp = session.get(
                url=base_url,
                headers=gen_headers(referer),
                proxies=proxy)
        if starting_author == None:
            profile_count += get_profile(base_resp.text)

        # set next_resp as base_rep if there is >1 pages of results
        next_resp = base_resp

    # try again if base search fails 
    except (Timeout, ProxyError, ConnectionError) as e:
        print(e)
        print('[Fail] Base search failed, trying again')
        get_faculty(email_domain, proxy_path,
                starting_author=starting_author,
                limit=limit, strict=strict,
                proxy_num=proxy_num)
        return

    while True:
        try:
            proxy_ip = next(proxy_cycle)
            proxy = {'https': proxy_ip}

            soup = BeautifulSoup(next_resp.text, 'html.parser')
            nav_btns = soup.find_all('button', attrs={'aria-label': True})
            next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))
            try:
                # collect information to go to next page
                next_link = next_btn[0]['onclick'][17:-1]
                profile_id = next_link.split('\\3d')[-1]
                if (starting_author == None):
                    author_id = next_link.split('\\x3d')[-2][:-10]
                else:
                    author_id = starting_author
                    starting_author = None

                # check if limit is reached
                if profile_count >= limit:
                    print(f'[Limit Reached] #{profile_count}: {author_id}')
                    break
                else:
                    # continue to next page
                    try:
                        next_page = f'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors={email_domain}&after_author={author_id}&astart={profile_id}'
                        next_resp = session.get(
                                url=next_page,
                                timeout=5,
                                headers=gen_headers(referer),
                                proxies=proxy)

                        profile_count += get_profile(next_resp.text)
                        time_record = str(time.time() - start_time)
                        print(f'[{time_record}] collected #{profile_count}')
                    except Timeout:
                        print(f'[Timeout] proxy timed out, switching proxies')
                    except ConnectionError:
                        print(f'[ConnectionError] switching proxies')
                    except ProxyError:
                        # remove proxy if strict is True
                        if strict:
                            proxy_list.remove(proxy_ip)
                            proxy_cycle = cycle(proxy_list)
                            print(f'[ProxyError-Removed] {len(proxy_list)} proxies remaining')
                        else:
                            print(f'[ProxyError] [Strict: False] {proxy_ip}')

            # check if last page has been reached
            except KeyError:
                try:
                    disable_toggle = next_btn[0]['disabled']
                    print(f'[Finished] {profile_count} results collected')
                    break
                except Exception as e:
                    print(e)
                    break
            # IndexError mean IP Ban
            except IndexError as e:
                print(e)
                proxy_list.remove(proxy_ip)
                proxy_cycle = cycle(proxy_list)
                print(f'[IP Ban] Removed proxy, {len(proxy_list)} remaining')
        except IndexError as e:
            print(e)
            proxy_list.remove(proxy_ip)
            proxy_cycle = cycle(proxy_list)
            print(f'[IP Ban] Removed proxy, {len(proxy_list)} remaining')
        except StopIteration:
            print('[Stopped] No proxies remaining')
            print(f'[Info] Ending author_id: {author_id}')
            break


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
    get_faculty(
            'unc.edu',
            'proxies.txt',
            starting_author=None,
            limit=None,
            strict=False,
            proxy_num=20)


if __name__ == '__main__':
    main()

