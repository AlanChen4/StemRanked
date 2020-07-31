import time
import random
import requests

from bs4 import BeautifulSoup
from csv import writer
from requests.exceptions import Timeout, ProxyError, ConnectionError, ChunkedEncodingError
from proxy import get_proxy_local, gen_headers


session = requests.Session()

def get_scholar(email_domain, field, proxy_path, starting_author=None,
                limit=1000000, proxy_thread=10, strict=False):
    '''
    appends to a .csv in data/profiles.csv with scholar profile links
    related to an email domain

    :param str email_domain: Email domain belonging to the university being searched
    :param str field: Name of the field that is being searched (ie computer science)
    :param str proxy_path: Path to the text file containing the list of proxies
    :param str starting_author: Start searching from this author ID, instead of base search
    :param int limit: Maximum number of results to be searched for
    :param int proxy_thread: Number of threads to use when checking proxies
    :param boolean strict: While False, proxies will be removed when IP banned'''

    # final list being returned
    profiles = {}

    # debugging variables
    start_time = time.time()

    # reqeusts session variables
    referer = 'https://scholar.google.com/citations?view_op=search_authors'
    base_url = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="

    # add appropriate search filter to query
    base_url += email_domain
    base_url = base_url + '+' + field.replace(' ' , '+')

    # set up proxies
    proxy_list = get_proxy_local(proxy_path, thread_limit=proxy_thread)
    proxy = random.choice(proxy_list)

    # initial search for base results
    try:
        base_resp = session.get(
                url=base_url,
                headers=gen_headers(referer),
                proxies=proxy)
        if starting_author == None:
            base_check = add_profiles(profiles, base_resp.text)
        try:
            soup = BeautifulSoup(base_resp.text, 'html.parser')
            nav_btns = soup.find_all('button', attrs={'aria-label': True})
            next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))
            next_link = next_btn[0]['onclick'][17:-1]
        except IndexError:
            # check if it was just no results returned
            if "didn't match any user profiles" in soup.text:
                print('[Finished] No scholar results founds')
                return profiles

            # checks if first page is only page
            if len(base_check) > 0:
                return profiles
            else:
                print('[Fail] Base search resulted in IP Ban')
                return get_scholar(email_domain, field, proxy_path,
                        starting_author=starting_author,
                        limit=limit, strict=strict)

        # set next_resp as base_rep if there is >1 pages of results
        next_resp = base_resp

    # try again if base search fails 
    except Exception as e:
        print(f'[Fail] Base search failed {e}')
        return get_scholar(email_domain, field, proxy_path,
                starting_author=starting_author,
                limit=limit, strict=strict)

    while True:
        try:
            proxy = random.choice(proxy_list)

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
                if len(profiles) >= limit:
                    print(f'[Limit Reached] #{len(profiles)}: {author_id}')
                    print(profiles)
                    break
                else:
                    # continue to next page
                    try:
                        # use old_resp in case IP Ban occurs
                        old_resp = next_resp

                        # generate next_page url
                        next_page = 'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors='
                        next_page += email_domain + '+' + field.replace(' ', '+')
                        next_page += f'&after_author={author_id}&astart={profile_id}'

                        next_resp = session.get(
                                url=next_page,
                                timeout=10,
                                headers=gen_headers(referer),
                                proxies=proxy)
                        add_profiles(profiles, next_resp.text)
                        time_record = str(time.time() - start_time)
                        print(f'[{time_record}] collected #{len(profiles)}')
                    except Timeout:
                        print(f'[Timeout] proxy timed out, switching proxies')
                    except ConnectionError:
                        print(f'[ConnectionError] switching proxies')
                    except ProxyError:
                        # remove proxy if strict is True
                        if strict:
                            proxy_list.remove(proxy)
                            proxy_cycle = cycle(proxy_list)
                            print(f'[ProxyError-Removed] {len(proxy_list)} proxies remaining')
                        else:
                            print(f'[ProxyError] [Strict: False] {proxy}')
                    except ChunkedEncodingError:
                        proxy_list.remove(proxy)
                        print(f'[CEE] Removed bad proxy')
                        next_resp = old_resp

            # check if last page has been reached
            except KeyError:
                try:
                    disable_toggle = next_btn[0]['disabled']
                    print(f'[Finished] {len(profiles)} results collected')
                    break
                except Exception as e:
                    print(e)
                    break
            # IndexError mean IP Ban
            except IndexError:
                proxy_list.remove(proxy)
                print(f'[IP Ban] Removed {proxy["https"]}, {len(proxy_list)} remaining')
                next_resp = old_resp
        except IndexError:
            if len(proxy_list) == 0:
                print('[Stopped] No proxies remaining')
                print(f'[Info] Ending author_id: {author_id}')
                break
            proxy_list.remove(proxy)
            print(f'[IP Ban] Removed proxy, {len(proxy_list)} remaining')
            next_resp = old_resp
            break
    return profiles


def add_profiles(profiles, page_html):
    '''returns the names of the google scholar profiles from
    a scholar web search

    :param dict profiles: dictionary containing the name and info of each author
    :param str page_html: html of the google scholar profile search result
    '''
    current_profiles = BeautifulSoup(page_html, 'html.parser')
    current_profiles = current_profiles.find_all('h3', class_='gs_ai_name')
    for p in current_profiles:
        url = 'https://scholar.google.com' + str(p.a['href'])
        profiles[p.text] = url
    return profiles

