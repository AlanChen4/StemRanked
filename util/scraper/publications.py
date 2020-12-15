import json
import requests

session = requests.Session()


def get_publications(uni_name, first, last, field, proxy=None):
    """Returns all publications associated with author
    :param uni_name: Name of the university that the author belongs to
    :param first: First name of the author
    :param last: Last name of the author
    :param field: Field that the author's works are being searched in
    :param proxy: Proxy that is being used
    """

    '''
    search MA with author name and university (maybe field?)
    scrape number of total publications, however, the author is only weighed from top 500
    go through top 500 publications and scrape:
        - title of the publication
        - where the publication was published
        - year that the publication was published
        - number of total authors
    changes made to DB:
        - insert publication count to proper row in university table
        - insert the publication information with author_id as the author's uuid
    '''

    # update session with proxy if given as argument
    if proxy is not None:
        session.proxies.update(proxy)

    # search for the author, in order to find author_id
    find_author_payload = {
        "query": f"{first} {last} while at {uni_name} university {field}",
        "queryExpression": "",
        "filters": [],
        "orderBy": 0,
        "skip": 0,
        "sortAscending": True,
        "take": 10,
        "includeCitationContexts": True,
        "profileId": ""
    }

    find_author_resp = session.post('https://academic.microsoft.com/api/search',
                                    json=find_author_payload)
    author_id = json.loads(find_author_resp.text)['f'][1]['fi'][0]['id']

    return author_id
    return [{
        'title': 'please work please',
        'location': 'my last two brain cells',
        'year': 2020
        }, {
        'title': 'what am i doing',
        'location': 'now just one brain cell',
        'year': 2020
    }]
