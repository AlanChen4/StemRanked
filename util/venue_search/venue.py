import json
import requests


session = requests.Session()

def get_conferences(field_id):
    '''returns list containing conferences and their respective info

    :param str field_id: ID for the field
    '''
    conf_endpoint = f'https://academic.microsoft.com/api/entity/topEntities/7/{field_id}?tet=4&filters=&take=1000'
    conf_resp = session.get(conf_endpoint)
    if 200 <= conf_resp.status_code < 300:
        confs = json.loads(conf_resp.text)['te']
        for conf in confs:
            print(conf['dn'])
    else:
        return get_conferences(field_id)


def get_journals(field_id):
    '''same as get_conferences but for journals'''
    jour_endpoint = f'https://academic.microsoft.com/api/entity/topEntities/7/{field_id}?tet=3&filters=&take=1000'
    jour_resp = session.get(conf_endpoint)
    if 200 <= jour_resp.status_code < 300:
        jours = json.loads(jour_resp.text)['te']
        for jour in jours:
            print(jour['dn'])
    else:
        return get_journals(field_id)


