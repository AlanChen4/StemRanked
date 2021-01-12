import json
import os
import random
import requests
import threading

from .proxy import get_proxy_local

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


def add_related_authors(authors, uni_name, field):
    """
    Find the author publication count and id based on name and uni_name.
    Remove any authors that don't have the field being searched for in their top related fields
    :param authors: list of authors whose info need to be added
    :param uni_name: name of the university that the authors belong to
    :param field: name of the field that the authors belong to
    :return: list with the updated info
    """
    # fetch proxies
    proxies_path = os.path.dirname(__file__) + '/proxies/proxies.txt'
    proxies = get_proxy_local(proxies_path, 10)

    author_info = []
    workers = []
    total_jobs = len(authors)

    for i in range(0, total_jobs):
        worker = AuthorThread(authors[i], uni_name, proxies, author_info, total_jobs, field)
        workers.append(worker)

    for worker in workers:
        worker.start()

    for worker in workers:
        worker.join()

    return author_info


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


class AuthorThread(threading.Thread):

    def __init__(self, author, uni_name, proxies, author_info, total_jobs, field):
        super(AuthorThread, self).__init__()
        self.author = author
        self.uni_name = uni_name
        self.proxies = proxies
        self.author_info = author_info
        self.total_jobs = total_jobs
        self.field = field

    def run(self):
        thread_limiter = threading.BoundedSemaphore(5)
        thread_limiter.acquire()
        try:
            self.get_author_info()
        finally:
            thread_limiter.release()

    def get_author_info(self):
        # fetch proxies
        proxies_path = os.path.dirname(__file__) + '/proxies/proxies.txt'
        if len(self.proxies) < 2:
            self.proxies = get_proxy_local(proxies_path, 10)
        proxy = random.choice(self.proxies)

        payload = {
            "query": f"{self.author[2]} {self.author[3]} while at {self.uni_name}",
            "queryExpression": "", "filters": [], "orderBy": 0, "skip": 0,
            "sortAscending": True, "take": 500, "includeCitationContexts": True, "profileId": ""
        }
        # keep trying even if there is proxy error
        while True:
            try:
                author_info_res = session.post('https://academic.microsoft.com/api/search', json=payload, proxies=proxy,
                                               timeout=10)
                res = json.loads(author_info_res.text)

                # Don't add person if the field being searched for isn't in their top 2 categories
                top_areas = []
                for index, area in enumerate(res['f'][3]['fi']):
                    if index >= 2:
                        break
                    top_areas.append(area['dn'].lower())
                if self.field not in top_areas:
                    break

                # Continue if the author passes the relevance check above
                info = res['de']
                pc, author_id = info[0]['pc'], info[0]['id']
                self.author_info.append({'id': self.author[0], 'pc': pc, 'academic': author_id})
                print(f'[Updating] ({len(self.author_info)}/{self.total_jobs}) Added {self.author[2]} {self.author[3]}')
                break
            # catch any of the like 100 errors that will happen but don't matter
            except KeyError as e:
                if 'de' in str(e):
                    if 'pr' in json.loads(author_info_res.text):
                        self.author_info.append({'id': self.author[0], 'pc': None, 'academic': None})
                        print(f'[Updating] ({len(self.author_info)}/{self.total_jobs}) '
                              f'Added {self.author[2]} {self.author[3]}')
                        break
            except Exception as e:
                proxy = random.choice(self.proxies)
