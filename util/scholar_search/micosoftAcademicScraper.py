import requests,json, sys, csv, re, os
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

def makeFile(loc):
    loc = './data/'+loc+'.csv'
    if (not os.path.isfile(loc)):
        with open(loc, 'w') as f:
            writer = csv.writer(f)
            writer.writerow(['Author', 'Institution', 'Venue', 'Year', 'AjustedCount'])

def write(qualified_Pubs):
    information = dict()
    for item in qualified_Pubs:
        information[(item['Author'], item['Institution'], item['Year'], item['Venue'])] = information.get((item['Author'], item['Institution'], item['Year'], item['Venue']),0)+item['Adjusted Count']
    subject_info = dict()
    for key in information.keys():
        subject = venues.findSubject(key[3])
        subject = re.sub(r' ','_', subject)
        try:
            subject_info[subject].append([key[0],key[1],key[2],key[3],information[(key[0],key[1],key[2],key[3])]])
        except:
            subject_info[subject] = list()
    for subject in subject_info.keys():
        makeFile(subject)
        with open('./data/'+subject+'.csv', 'a') as f:
            writer = csv.writer(f)
            for item in subject_info[subject]:
                writer.writerow([item[0], item[1], item[3], item[2], item[4]])

publications = genPublications("Eric P. Xing","Composite(AA.AuId=351197510)", 'Carnegie Mellon University')
write(publications)



