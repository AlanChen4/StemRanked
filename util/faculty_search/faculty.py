import csv
import json
import os
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
    first_copy = first.copy()
    second_copy = second.copy()

    for name in first_copy.keys():
        split_name = name.split()
        no_middle_name = split_name[0] + ' ' + split_name[-1]
        first[no_middle_name] = first.pop(name)

    for name in second_copy.keys():
        split_name = name.split()
        no_middle_name = split_name[0] + ' ' + split_name[-1]
        second[no_middle_name] = second.pop(name)

    return first, second


def write_to_csv(profiles, field, name='output'):
    # write the information from dictionary onto .csv 
    try:
        with open(f'output/{field}/{name}.csv', 'a+', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for author, info in profiles.items():
                w.writerow([author, info])
            print('[Finished] Output to .CSV complete')
    except FileNotFoundError:
        # create the folder off field name if it doesn't exist
        output_path = r'./output/' + str(field)
        os.makedirs(output_path)

        write_to_csv(profiles=profiles, field=field, name=name)


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
    :param field: scholar and academic
    :param academic_limit: academic
    :param output_name: output to csv'''

    # scholar
    print('[Start] Scholar Scraper')
    scholar = get_scholar(email_domain=email_domain, field=field, proxy_path=proxy_path,
            starting_author=starting_author, limit=limit, proxy_thread=proxy_thread,
            strict=strict)

    # academic
    print('[Start] Academic Scraper')
    academic = get_academic(uni_name=uni_name, field=field, limit=academic_limit)

    # cleaning functions
    print('[Start] Cleaning')
    scholar, academic = clean_middle_name(scholar, academic)
    combined = clean_duplicates(scholar, academic)

    # output to file
    print('[Start] Output to .CSV')
    write_to_csv(combined, field, output_name)


def get_faculty_from_list(institutions_path, field_fullname, starting_uni=None):
    '''runs get_faculty on .csv list of universities with their domains

    :param str institutions_path: path to institutions .csv file
    :param str field_fullname: full name for field, i.e. 'Computer Science'
    :param str starting_uni: university to start searching from instead of beginning

    institutions_path .csv file should have format -(uni_name), (uni_domain)
    '''
    with open(institutions_path, 'r') as f:
        uni_list = list(csv.reader(f))
        if starting_uni is not None:
            # remove universities before the specified starting_uni
            uni_list = uni_list[uni_list.index(starting_uni) + 1:]

    for uni in uni_list:
        # append appropriate field to end of email domain
        field_email = uni[1] + ' ' + field_fullname

        # call get_faculty for each uni in uni_list
        print(f'[Start] Finding faculty list for {uni[0]}')
        get_faculty(email_domain=field_email,
                uni_name=uni[0],
                field=field_fullname,
                output_name=uni[0] + '_' + field_fullname)

