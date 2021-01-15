import json
import random
import requests

from requests.exceptions import ProxyError

session = requests.Session()
search_endpoint = 'https://academic.microsoft.com/api/search'


def get_publications(first, last, proxies, author_id=None):
    """Returns all publications associated with author
    :param first: First name of the author
    :param last: Last name of the author
    :param proxies: List of proxies to be cycled through
    :param author_id: Author id in database
    """
    # final list of publications to be returned
    publications = []

    proxy = random.choice(proxies)

    # keep trying until publication info is gathered
    papers = []

    skip = 0
    while True:
        try:
            author_info_payload = {
                "query": f"{first} {last}",
                "queryExpression": f"Composite(AA.AuId={author_id})",
                "filters": [],
                "orderBy": 4,  # rank by saliency
                "skip": skip,
                "sortAscending": True,
                "take": 10,
                "includeCitationContexts": True,
                "authorId": f"{author_id}",
                "profileId": ""
            }
            author_info_resp = session.post(search_endpoint, json=author_info_payload, proxies=proxy)
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
        # bad proxy was picked
        except ProxyError:
            proxy = random.choice(proxies)
            print('[Proxy Connection Error] Trying again')
        # KeyError is raised when author has < 500 publications, and the last publication is reached
        except KeyError:
            if 200 <= author_info_resp.status_code < 300:
                break
        # reached last publication && total publications > 500
        except json.decoder.JSONDecodeError:
            if 400 <= author_info_resp.status_code < 500:
                print('[Proxy Banned] Rotating Proxies')
                proxy = random.choice(proxies)

    # collect information
    print(f'[Update] Found {len(papers)} publications for {first} {last}')
    for paper in papers:
        paper_title = paper['paper']['dn']
        location, year = paper['paper']['v']['displayName'], paper['paper']['v']['publishedYear']
        author_count = len(paper['paper']['a'])

        publications.append({
            'title': paper_title,
            'location': location,
            'year': year,
            'author_count': author_count
        })
    return publications
