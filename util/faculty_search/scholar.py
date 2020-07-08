import time
import requests

from bs4 import BeautifulSoup
from csv import writer
from itertools import cycle
from requests.exceptions import Timeout, ProxyError, ConnectionError
from proxy import get_proxy_local, gen_headers


session = requests.Session()

def get_scholar(email_domain, proxy_path, starting_author=None,
                limit=1000000, proxy_thread=10, strict=False):
    '''
    appends to a .csv in data/profiles.csv with scholar profile links
    related to an email domain

    :param str email_domain: Email domain belonging to the university being searched
    :param str proxy_path: Path to the text file containing the list of proxies
    :param str starting_author: Start searching from this author ID, instead of base search
    :param int limit: Maximum number of results to be searched for
    :param int proxy_thread: Number of threads to use when checking proxies
    :param boolean strict: While False, proxies will be removed when IP banned'''

    # final list being returned
    profiles = []

    # debugging variables
    start_time = time.time()

    # reqeusts session variables
    referer = 'https://scholar.google.com/citations?view_op=search_authors'
    base_url = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    base_url += email_domain

    # set up proxies
    proxy_list = get_proxy_local(proxy_path, thread_limit=proxy_thread)
    proxy_cycle = cycle(proxy_list)
    proxy = next(proxy_cycle)

    # initial search for base results
    try:
        base_resp = session.get(
                url=base_url,
                headers=gen_headers(referer),
                proxies=proxy)
        if starting_author == None:
            profiles += get_profile(base_resp.text)

        # set next_resp as base_rep if there is >1 pages of results
        next_resp = base_resp

    # try again if base search fails 
    except Exception as e:
        print(f'[Fail] Base search failed {e}')
        get_scholar(email_domain, proxy_path,
                starting_author=starting_author,
                limit=limit, strict=strict)
        return

    while True:
        try:
            proxy = next(proxy_cycle)

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

                        next_page = f'https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors={email_domain}&after_author={author_id}&astart={profile_id}'
                        next_resp = session.get(
                                url=next_page,
                                timeout=10,
                                headers=gen_headers(referer),
                                proxies=proxy)
                        profiles += get_profile(next_resp.text)
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
            except IndexError as e:
                proxy_list.remove(proxy)
                proxy_cycle = cycle(proxy_list)
                print(f'[IP Ban] Removed {proxy["https"]}, {len(proxy_list)} remaining')
                next_resp = old_resp
        except IndexError as e:
            proxy_list.remove(proxy)
            proxy_cycle = cycle(proxy_list)
            print(f'[IP Ban] Removed proxy, {len(proxy_list)} remaining')
            next_resp = old_resp
        except StopIteration:
            print('[Stopped] No proxies remaining')
            print(f'[Info] Ending author_id: {author_id}')
            break
    return profiles


def get_profile(page_html):
    '''returns the names of the google scholar profiles from
    a scholar web search

    :param str page_html: html of the google scholar profile search result
    '''
    profiles = []
    current_profiles = BeautifulSoup(page_html, 'html.parser')
    current_profiles = current_profiles.find_all('h3', class_='gs_ai_name')
    for p in current_profiles:
        name = p.text
        url = 'https://scholar.google.com' + str(p.a['href'])
        result = p.text + ', ' + url
        profiles.append(result)
    return profiles

