import requests

from fake_useragent import UserAgent


def get_proxy_local(path, n=50):
    '''read and try to return n number of
    working proxies from proxies.txt
    '''
    proxy_list = []
    with open(path) as f:
        lines = [line.rstrip('\n') for line in f]
    for line in lines:
        line = 'https://'  + line
        proxy_list.append(line)

    return proxy_list


def get_proxy_online(n=45):
    '''fetch and check a list of (up to) 45 proxies
    at a time from proxy-list.download
    '''
    session = requests.Session()

    # free proxy list from proxy-list.download
    host = 'https://www.proxy-list.download/api/v1/get?type=http&anon=elite&country=US'
    proxy_resp = session.get(host)
    if 200 <= proxy_resp.status_code < 300:
        proxy_list = proxy_resp.text.splitlines()
    else:
        print(f'[{proxy_resp.status_code}] could not fetch proxy list')
        return

    print(f'fetched {len(proxy_list)} proxies')

    # create list of working proxies only
    proxy_working = []
    for p in proxy_list:
        if len(proxy_working) == n:
            break
        if check_proxy(p):
            proxy_working.append(p)
    print(f'{len(proxy_working)} total working proxies returned')

    return proxy_working


def check_proxy(proxy_ip):
    '''returns True/False depending on if proxy works'''
    try:
        requests.get('https://api.ipify.org/',
                proxies={'http': proxy_ip},
                timeout=10).text
        return True
    except:
        return False


def gen_headers():
    '''TODO: return human-like headers to avoid basic detection'''
    headers = {
            }

    return headers


