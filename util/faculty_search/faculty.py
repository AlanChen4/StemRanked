import csv
import json
import requests
import time

from bs4 import BeautifulSoup
from itertools import cycle
from requests.exceptions import Timeout, ProxyError, ConnectionError

from academic import get_academic
from scholar import get_scholar


def clean_duplicates(scholar, academic):
    '''
    removes authors that are found within both the academic list
    and the scholar list.'''
    combined = academic.copy()
    for author in scholar:
        if author in combined:
            # append the scholar link to the end of the academic id
            combined[author] = str(combined[author]) + '_' + str(scholar[author])
        else:
            combined[author] = scholar[author]

    return combined


def clean_middle_name(first, second):
    '''
    removes middle names from authors. This reduces error caused by
    middle names being listed different for the same people on different
    platforms.'''
    for name in first.keys():
        split_name = name.split()
        no_middle_name = split_name[0] + ' ' + split_name[-1]
        first[name] = first.pop(no_middle_name)

    for name in second.keys():
        split_name = name.split()
        no_middle_name = split_name[0] + ' ' + split_name[-1]
        second[name] = second.pop(no_middle_name)

    return first, second


def write_to_csv(profiles, name='output'):
    with open(f'output/{name}.csv', 'a+', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        for author, info in profiles.items():
            w.writerow([author, info])

