import json
import time
import requests

from bs4 import BeautifulSoup
from csv import writer
from itertools import cycle
from requests.exceptions import Timeout, ProxyError, ConnectionError

from academic import get_academic
from scholar import get_scholar


if __name__ == '__main__':
    scholar = get_scholar(
            'cs.unc.edu',
            'proxies/proxies.txt',
            starting_author=None,
            limit=10000,
            strict=False,
            proxy_thread=50)
    academic = get_academic(
            'unc',
            'computer science',
            500)
    combined = list(set(scholar + academic))
    for prof in combined:
        print(prof)


