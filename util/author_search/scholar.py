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
    # setup scraping tools (proxies, beautiful soup)
    proxies = get_proxy_local(proxies_path, proxy_threads)
    proxy = random.choice(proxy_list)
    soup = BeautifulSoup(base_resp.text, 'html.parser')

    # get base_page information
    base_resp = session.get(
            url=profile_url,
            headers=gen_headers(profile_url),
            proxies=proxy)

    try:
        show_more_btn = soup.find_all('span', attrs={'class': 'gs_lbl'}
