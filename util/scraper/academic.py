import json
import requests


session = requests.Session()
search_endpoint = 'https://academic.microsoft.com/api/search'


def get_academic_authors(uni_name, field, limit=500):
    endpoint, uni_id, field_id = get_authors_endpoint(uni_name, field)
    endpoint += str(limit)
    print(f'[Endpoint] {endpoint}')

    authors_list = {}
    top_authors = session.get(endpoint)
    if 200 <= top_authors.status_code < 300:
        top_authors_json = json.loads(top_authors.text)
        for author in top_authors_json['te']:
            if uni_id == author['ci']['id']:
                info = {
                    'id': None,
                    'pub_count': None,
                }
                authors_list[author['an']] = info
        print(f'[Finished] {len(authors_list)} total authors found')
        return authors_list
    else:
        print(f'[Failed] top_authors {top_authors.status_code}')


def get_authors_endpoint(uni_name, field):
    uni_id = get_uni_id(uni_name)
    field_id = get_field_id(field)

    authors_endpoint = f'https://academic.microsoft.com/api/entity/topEntities/6/{uni_id}' \
                       f'?tet=1&filters=Composite(F.FId={field_id})&take='

    return authors_endpoint, uni_id, field_id


def get_uni_id(uni_name):
    payload = {
        "query": uni_name,
        "queryExpression": "",
        "filters": [],
        "orderBy": 0,
        "skip": 0,
        "sortAscending": True,
        "take": 10,
        "includeCitationContexts": True,
        "profileId": ""
    }
    uni_resp = session.post(search_endpoint, json=payload)
    return json.loads(uni_resp.text)['f'][0]['fi'][0]['id']


def get_field_id(field):
    payload = {
        "query": field,
        "queryExpression": "",
        "filters": [],
        "orderBy": 0,
        "skip": 0,
        "sortAscending": True,
        "take": 10,
        "includeCitationContexts": True,
        "profileId": ""
    }
    field_resp = session.post(search_endpoint, json=payload)
    return json.loads(field_resp.text)['f'][3]['fi'][0]['id']
