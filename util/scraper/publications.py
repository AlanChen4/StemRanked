import json
import requests

session = requests.Session()


def get_publications(uni_name, first, last, field, author_id=None, proxy=None):
    """Returns all publications associated with author
    :param uni_name: Name of the university that the author belongs to
    :param first: First name of the author
    :param last: Last name of the author
    :param field: Field that the author's works are being searched in
    :param author_id: Author id on MA. This is passed in only if already in database
    :param proxy: Proxy to use if provided
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

    # final list of publications to be returned
    publications = []

    if proxy is not None:
        session.proxies.update(proxy)

    # search for author_id if not already in database
    if author_id is None:
        # search for the author, in order to find author_id
        find_author_payload = {
            "query": f"{first} {last} while at {uni_name} university {field}",
            "queryExpression": "", "filters": [], "orderBy": 0, "skip": 0,
            "sortAscending": True, "take": 10, "includeCitationContexts": True, "profileId": ""
        }
        find_author_resp = session.post('https://academic.microsoft.com/api/search',
                                        json=find_author_payload)
        author_id = json.loads(find_author_resp.text)['f'][1]['fi'][0]['id']

    # search for author based on author_id
    author_info_payload = {
        "query": f"{first} {last}",
        "queryExpression": f"Composite(AA.AuId={author_id})",
        "filters": [], "orderBy": 0, "skip": 0, "sortAscending": True, "take": 500, " includeCitationContexts": True,
        "authorId": f"{author_id}", "profileId": ""
    }
    author_info_resp = session.post('https://academic.microsoft.com/api/search',
                                    json=author_info_payload)
    author_info = json.loads(author_info_resp.text)

    # collect information
    pub_count = author_info['f'][1]['fi'][0]['pc']
    for paper in author_info['pr']:
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
