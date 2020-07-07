import requests,json, sys, csv
path_to_scholar_search = '/Users/slahade/documents/github/stemranked/util/faculty_search'
sys.path.append(path_to_scholar_search)
import academic

session = requests.Session()

'''skip = 0

#for skip in range(0,490,10):
data = {"query":"Eric P. Xing","queryExpression":"Composite(AA.AuId=351197510)","filters":[],"orderBy":0,"skip":skip,"sortAscending":True,"take":10,"includeCitationContexts":False,"authorId":351197510,"profileId":""}
val = session.post('https://academic.microsoft.com/api/search', json = data)
parsed = json.loads(val.text)
hello = json.dumps(parsed, indent=4, sort_keys=True)'''
'''for paper in parsed['pr']:
	print(paper['paper'])

	'paper''v' hosts conference and year and pages
	len(parsed['pr'][0]['paper']['a']) == number of authors
	parsed['pr'][0]['paper']['a'][3]['dn'] == third author's name'''

def genPublications(auth, authID):
    skip = 0
    for skip in range(0,490,10):
        data = {
                "query":auth,
                "queryExpression":authID,
                "filters":[],"orderBy":0,"skip":skip,
                "sortAscending":True,"take":10,
                "includeCitationContexts":False,
                "authorId":351197510,
                "profileId":""}
        val = session.post('https://academic.microsoft.com/api/search', json = data)
        parsed = json.loads(val.text)
        for paper in parsed['pr']:
            adjustedCount = 1/int(paper['paper']['tac'])
            venue = paper['paper']['v']['displayName']
            print(venue)
        
    
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
        for auth in getAuthorNames:
            (auth, authID) = getAuthorIds(auth, top_authors)

genPublications("Eric P. Xing","Composite(AA.AuId=351197510)")

