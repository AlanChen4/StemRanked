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
        print('[Finished] Output to .CSV complete')


def get_faculty(email_domain='example.edu', proxy_path='proxies/proxies.txt',
                starting_author=None,limit=1000000, proxy_thread=10, strict=False,
                uni_name='example university', field='example field', academic_limit=500,
                output_name='output'):
    '''
    combines the scholar and academic scraper into one unified function

    :param email_domain: scholar
    :param proxy_path: scholar
    :param starting_author: scholar
    :param limit: scholar
    :param proxy_thread: scholar
    :param strict: scholar
    :param uni_name: academic
    :param field: academic
    :param academic_limit: academic
    :param output_name: output to csv'''

    # scholar
    print('[Start] Scholar Scraper')
    scholar = get_scholar(email_domain=email_domain, proxy_path=proxy_path,
            starting_author=starting_author, limit=limit, proxy_thread=proxy_thread,
            strict=strict)

    # academic
    print('[Start] Academic Scraper')
    academic = get_academic(uni_name=uni_name, field=field, academic_limit=academic_limit)

    # cleaning functions
    print('[Start] Cleaning')
    scholar, academic = clean_middle_name(scholar, academic)
    combined = clean_duplicates(scholar, academic)

    # output to file
    print('[Start] Output to .CSV')
    write_to_csv(combined, output_name)

