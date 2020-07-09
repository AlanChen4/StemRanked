import json
import requests

from fake_useragent import UserAgent


session = requests.Session()

def get_academic(uni_name, field, limit):
    endpoint, af_id, f_id = get_authors_endpoint(uni_name, field)
    endpoint += str(limit)
    print(f'[Endpoint] {endpoint}')

    authors_list = {}
    top_authors = session.get(endpoint)
    if 200 <= top_authors.status_code < 300:
        top_authors_json = json.loads(top_authors.text)
        for author in top_authors_json['te']:
            if af_id == author['ci']['id']:
                authors_list[author['an']] = author['id']
        print(f'[Finished] {len(authors_list)} total authors found')
        return authors_list
    else:
        print(f'[Failed] top_authors {top_authors.status_code}')


def get_authors_endpoint(uni_name, category):
    api_search = 'https://academic.microsoft.com/api/search'
    data = {
            'query':f'{uni_name} {category}',
            'queryExpression':'',
            'Filters':[],
            'orderBy':'4',
            'Skip':'0',
            'sortAscending':True,
            'Take':'10',
            'includeCitationContexts':True,
            'profileId':''
            }
    res = session.post(api_search, json=data)
    if 200 <= res.status_code < 300:
        res_json = json.loads(res.text)
        # af_id is affiliation (university) ID
        af_id = res_json['f'][0]['fi'][0]['id']
        # f_id is field ID
        f_id = res_json['f'][3]['fi'][0]['id']
        return f'https://academic.microsoft.com/api/entity/topEntities/6/{af_id}?tet=1&filters=Composite(F.FId={f_id})&take=', af_id, f_id
    else:
        print(f'[Failed] endpoint {res.status_code}')

