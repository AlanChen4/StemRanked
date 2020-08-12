import csv
import json
import itertools
import os
import requests


session = requests.Session()

def get_venues(field_name):
    '''return conferences and journals corresponding to a field name

    :param str field_name: name of the field ("Computer Science")
    '''
    field_id = get_field_id(field_name)

    conferences = get_conferences(field_id)
    journals = get_journals(field_id)

    write_to_csv(list(itertools.chain(conferences, journals)), field_name)


def get_conferences(field_id):
    '''returns list containing conferences and their respective info

    :param str field_id: ID for the field
    '''
    conf_endpoint = f'https://academic.microsoft.com/api/entity/topEntities/7/{field_id}?tet=4&filters=&take=1000'
    conf_resp = session.get(conf_endpoint)
    if 200 <= conf_resp.status_code < 300:
        confs = json.loads(conf_resp.text)['te']
        print(f'[Done] Fetched {len(confs)} conferences')
        return confs
    else:
        return get_conferences(field_id)


def get_journals(field_id):
    '''same as get_conferences but for journals'''
    jour_endpoint = f'https://academic.microsoft.com/api/entity/topEntities/7/{field_id}?tet=3&filters=&take=1000'
    jour_resp = session.get(jour_endpoint)
    if 200 <= jour_resp.status_code < 300:
        jours = json.loads(jour_resp.text)['te']
        print(f'[Done] Fetched {len(jours)} journals')
        return jours
    else:
        return get_journals(field_id)


def get_field_id(field):
    search_endpoint = 'https://academic.microsoft.com/api/search'
    payload = {
            "query": field,
            "queryExpression":"",
            "filters":[],
            "orderBy":0,
            "skip":0,
            "sortAscending": True,
            "take":10,
            "includeCitationContexts": True,
            "profileId":""
            }
    field_resp = session.post(search_endpoint, json=payload)
    return json.loads(field_resp.text)['f'][3]['fi'][0]['id']


def write_to_csv(venues, field, name='output'):
    # write the information from dictionary onto .csv 
    try:
        with open(f'output/{field}/{name}_venues.csv', 'a+', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for venue in venues:
                w.writerow([venue])
            print('[Finished] Output to .CSV complete')
    except FileNotFoundError:
        # create the folder off field name if it doesn't exist
        output_path = r'./output/' + str(field)
        os.makedirs(output_path)

        write_to_csv(venues=venues, field=field, name=name)

