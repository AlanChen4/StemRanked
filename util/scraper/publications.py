import json
import os
import random
import requests
import threading

from .proxy import get_proxy_local
from requests.exceptions import ProxyError

session = requests.Session()
search_endpoint = 'https://academic.microsoft.com/api/search'


class PublicationThread(threading.Thread):

    def __init__(self, first, last, proxies, all_publications, author_id=None):
        threading.Thread.__init__(self)
        self.first = first
        self.last = last
        self.proxies = proxies
        self.author_id = author_id
        self.all_publications = all_publications

    def run(self):
        thread_limiter = threading.BoundedSemaphore(5)
        thread_limiter.acquire()
        try:
            self.get_publications()
        finally:
            thread_limiter.release()

    def get_publications(self):
        """
        Adds publications belonging to the author into the main list
        """
        # final list of publications to be added to the main list of publications
        publications = []

        proxy = random.choice(self.proxies)

        # keep trying until publication info is gathered
        papers = []

        skip = 0
        while True:
            try:
                author_info_payload = {
                    "query": f"{self.first} {self.last}",
                    "queryExpression": f"Composite(AA.AuId={self.author_id})",
                    "filters": [],
                    "orderBy": 4,  # rank by saliency
                    "skip": skip,
                    "sortAscending": True,
                    "take": 10,
                    "includeCitationContexts": True,
                    "authorId": f"{self.author_id}",
                    "profileId": ""
                }
                author_info_resp = session.post(search_endpoint, json=author_info_payload, proxies=proxy, timeout=10)
                author_info = json.loads(author_info_resp.text)
                for paper in author_info['pr']:
                    papers.append(paper)
                skip += 10
                # Reached the 500 limit, any publication requested after this will result in 403
                if skip > 500:
                    break
            # bad response
            except requests.exceptions.ChunkedEncodingError:
                continue
            except requests.exceptions.Timeout:
                print(f'[Timeout] {self.first} {self.last}')
                proxy = random.choice(self.proxies)
            except requests.exceptions.ProxyError:
                print(f'[ProxyError] {self.first} {self.last}')
                proxy = random.choice(self.proxies)
            except requests.exceptions.ConnectionError:
                print(f'[ConnectionError] {self.first} {self.last}')
                proxy = random.choice(self.proxies)
            # KeyError is raised when author has < 500 publications, and the last publication is reached
            except KeyError:
                if 200 <= author_info_resp.status_code < 300:
                    break
            # reached last publication && total publications > 500 OR banned
            except json.decoder.JSONDecodeError as e:
                print(f'[JSONDecodeError] {self.first} {self.last}')
                if 400 <= author_info_resp.status_code < 500:
                    proxy = random.choice(self.proxies)

        for paper in papers:
            paper_title = paper['paper']['dn']
            location, year = paper['paper']['v']['displayName'], paper['paper']['v']['publishedYear']
            author_count = len(paper['paper']['a'])

            publications.append({
                'author_id': self.author_id,
                'first': self.first,
                'last': self.last,
                'title': paper_title,
                'location': location,
                'year': year,
                'author_count': author_count
            })

        # Add new publications to main publication list
        for pub in publications:
            self.all_publications.append(pub)

        print(f'[{threading.activeCount()} Authors Left] {self.first} {self.last} [{len(papers)} publications]')


def get_publications(uni_authors, all_publications):
    """
    Adds all publications associated with author to all_publications
    :param uni_authors: List containing all of the authors currently in the database
    :param all_publications: List which will contain all the publications gathered from scraper
    """
    # add publications associated with each author
    proxies_path = os.path.dirname(__file__) + '/proxies/proxies.txt'
    proxies = get_proxy_local(proxies_path, 10)
    workers = []
    for author in uni_authors:
        first, last, author_id = author[2], author[3], author[5]
        worker = PublicationThread(first, last, proxies, all_publications, author_id)
        workers.append(worker)

    for worker in workers:
        worker.start()

    for worker in workers:
        worker.join()
