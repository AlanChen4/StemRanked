import json
import time
import random
import requests

from bs4 import BeautifulSoup
from requests.exceptions import Timeout, ProxyError, ConnectionError, ChunkedEncodingError
from proxy_checker import get_proxy_local, gen_headers


session = requests.Session()

def get_publications(profile_url, proxies_path='proxies.txt', proxy_threads=10):
    '''return list of publications from scholar profile

    :param str profile_url: URL to scholar's profile
    '''
    # setup proxies
    # proxies = get_proxy_local(proxies_path, proxy_threads)
    # proxy = random.choice(proxy_list)

    # setup scraping variables
    cstart = 0
    user_id = profile_url.split('=')[-1]
    pub_filter = {
            'hl': 'en',
            'user': user_id,
            'cstart': 0,
            'pagesize': 100
            }
    pub_payload = {'json': 1}
    pub_endpoint = profile_url + 'cstart=0&pagesize=100'

    # get base_page information
    base_resp = session.post(
            url=pub_endpoint,
            headers=gen_headers(profile_url),
            params=pub_filter,
            data=pub_payload
            # proxies=proxy)
            )

    # check base_resp
    # (TODO: check if there is more than one page)
    base_pubs = BeautifulSoup(json.loads(base_resp.text)['B'], 'html.parser')
    num_found_pubs = len(base_pubs)
    for pub in base_pubs:
        print(pub.text, '\n')

    # scrape publications until < 100 publications are returned (last page reached) 
    while num_found_pubs == 100:
        cstart, pub_filter = update_search_filter(cstart, pub_filter)
        pubs_resp = session.post(
            url=pub_endpoint,
            headers=gen_headers(profile_url),
            params=pub_filter,
            data=pub_payload
            # proxies=proxy)
            )
        found_pubs = BeautifulSoup(json.loads(pubs_resp.text)['B'], 'html.parser')
        num_found_pubs = len(found_pubs)
        for pub in found_pubs:
            print(pub.text, '\n')


def update_search_filter(cstart, pub_filter):
    '''updates the scraping variables for the next POST request

    :param int cstart: the starting publication index to search from
    :param dict pub_filter: string param to send to pub_endpoint
    '''
    cstart += 100
    pub_filter['cstart'] = cstart

    return cstart, pub_filter

if __name__ == '__main__':
    # Eric Xing
    # get_publications('https://scholar.google.com/citations?hl=en&user=5pKTRxEAAAAJ')

    # Random Prof
    get_publications('https://scholar.google.com/citations?hl=en&user=Ic8NqXwAAAAJ')

    # 5 publications person
    # get_publications('https://scholar.google.com/citations?hl=en&user=3PX4CoAAAAAJ')
