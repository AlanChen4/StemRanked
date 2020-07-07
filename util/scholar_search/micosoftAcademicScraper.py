import requests,json, sys, csv
path_to_scholar_search = '/Users/slahade/documents/github/stemranked/util/faculty_search'
sys.path.append(path_to_scholar_search)
import academic, venues

session = requests.Session()
pageThreshold = 6

def genPublications(auth, authID, institution):
    skip = 0
    publications = []
    for skip in range(0,500,10):
        data = {
                "query":auth,
                "queryExpression":authID,
                "filters":[],"orderBy":0,
                "skip":skip,
                "sortAscending":True,
                "take":10,
                "includeCitationContexts":False,
                "authorId":351197510,
                "profileId":""
                }
        val = session.post('https://academic.microsoft.com/api/search', json = data)
        parsed = json.loads(val.text)
        for paper in parsed['pr']:
            adjustedCount = 1/int(paper['paper']['tac'])
            try:
                year = str(paper['paper']['v']['publishedDate'].split('-')[0])
                venue = paper['paper']['v']['displayName']
                length = int(paper['paper']['v']['lastPage']) - int(paper['paper']['v']['firstPage'])
                if (length < pageThreshold):
                    continue
                ven = venues.check(venue)
                if (ven == False):
                    continue
                pub = {
                    'Author':auth,
                    'Institution':institution,
                    'Year': year,
                    'Venue': ven,
                    'Adjusted Count': adjustedCount
                }
                publications.append(pub)
            except:
                continue
    return publications
    
def getAuthorNames(csvFile):
    authors = []
    with open(csvFile, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            authors.append(row[0])
    return authors

def getAuthorIds(auth, top_authors):
    top_authors_json = json.loads(top_authors.text)
    for author in top_authors_json['te']:
        if (author['an'].strip() == auth.strip()):
            return (auth, author['pqe'])

def getInstitutionAuths(institution, subject):
    endpoint = academic.get_authors_endpoint(institution, subject)[0]
    endpoint+=str(1000)
    top_authors = session.get(endpoint)
    if 200 <= top_authors.status_code < 300:
        for auth in getAuthorNames('microsoftAcademicAuthors.csv'):
            (auth, authID) = getAuthorIds(auth, top_authors)
            genPublications(auth,authID,institution)


print(genPublications("Eric P. Xing","Composite(AA.AuId=351197510)", 'Carnegie Mellon University'))

