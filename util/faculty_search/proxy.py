import itertools
import requests
import threading
import time

from fake_useragent import UserAgent


class ProxyThread(threading.Thread):

    def __init__(self, ip, good_proxies, limit):
        threading.Thread.__init__(self)
        self.ip = ip
        self.good_proxies = good_proxies
        self.limit = limit

    def run(self):
        thread_limiter = threading.BoundedSemaphore(self.limit)
        thread_limiter.acquire()
        try:
            self.check_proxy(self.ip, self.good_proxies)
        finally:
            thread_limiter.release()

    def check_proxy(self, ip, good_proxies):
        '''returns True/False depending if provided proxy works

        :param str ip: IP address of the proxy
        :param list good_proxies: List containing all proxies that work
        '''
        proxy = {'https': 'https://' + ip}
        try:
            res = requests.get('https://api.ipify.org/',
                    proxies=proxy,
                    timeout=5).text
            if res == ip.split(':')[0]:
                print(f'[Success] {ip}')
                good_proxies.append(proxy)
        except Exception as e:
            print(f'[Fail] {ip} {type(e)}')
            return


def get_proxy_local(path, thread_limit):
    '''returns all working proxies from a local path

    :param str path: Relative path to the local proxies text file
    :param int thread_limit: Maximum number of threads to use
    '''
    # add proxies from text file to a list
    proxy_list = []
    with open(path) as f:
        lines = [line.rstrip('\n') for line in f]
    for line in lines:
        proxy_list.append(line)

    # spawn worker threads
    print('[Start] Begin checking proxies')
    start_time = time.time()
    workers = []
    good_proxies = []
    for i in range(0, len(proxy_list)):
        worker = ProxyThread(proxy_list[i], good_proxies, thread_limit)
        workers.append(worker)

    for worker in workers:
        worker.start()

    for worker in workers:
        worker.join()

    final_time = str(time.time() - start_time)
    print(f'[Finished {final_time.split(".")[0]}s] {len(good_proxies)} proxies returned')
    return good_proxies


def gen_headers(referer):
    '''TODO: return human-like headers to avoid basic detection'''
    ua = UserAgent()
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'referer': referer,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': ua.random
            }

    return headers


if __name__ == '__main__':
    get_proxy_local('proxies.txt')

