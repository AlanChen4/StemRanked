import csv
import json
import requests
import time

from bs4 import BeautifulSoup
from itertools import cycle
from requests.exceptions import Timeout, ProxyError, ConnectionError

from academic import get_academic
from scholar import get_scholar


def clean_authors(scholar, academic):
    # combine information for authors on both scholar and academic
    combined = academic.copy()
    for author in scholar:
        if author in combined:
            # append the scholar link to the end of the academic id
            combined[author] = str(combined[author]) + '_' + str(scholar[author])
        else:
            combined[author] = scholar[author]

    return combined


def write_to_csv(profiles, name='output'):
    with open(f'output/{name}.csv', 'a+', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        for author, info in profiles.items():
            w.writerow([author, info])


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
    combined = clean_authors(scholar, academic)
    write_to_csv(combined)
