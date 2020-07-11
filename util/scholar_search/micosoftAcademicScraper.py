import requests,json, sys, csv, re, os, time
path_to_faculty_search = '/Users/slahade/documents/github/stemranked/util/faculty_search'
sys.path.append(path_to_faculty_search)
import academic, venues, threading, multiprocessing

session = requests.Session()
pageThreshold = 6



def genPublicationsPerPage(auth, authID, institution, skip, pubs):
    publications = []
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
    try:
        for paper in parsed['pr']:
            try:
                #print(paper['paper']['v'])
                adjustedCount = 1/int(paper['paper']['tac'])
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
                pass
    except Exception as e:
            print(f'ERROR: {e}\t\t{parsed}')

    pubs+=publications

def genPublications(auth, authID, institution): #numProcessses
    start = time.time()
    skip = 0
    publications = []
    workers = []
    for skip in range(0,500,10):
            workers.append(threading.Thread(target=genPublicationsPerPage, args = (auth, authID, institution, skip, publications)))
    for worker in workers:
        worker.start()
    for worker in workers:
        worker.join()
    end = time.time()
    write(publications)
    print(f'{auth}\t\t{authID}\t\t{(end-start)}')
    #return publications
    
def getAuthorNames(csvFile, domain):
    authors = []
    with open(csvFile, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            if (row[1] == domain):
                authors.append(row[0])
    return authors

def getAuthorIds(auth, top_authors):
    top_authors_json = json.loads(top_authors.text)
    for author in top_authors_json['te']:
        if (author['an'].strip() == auth.strip()):
            return (auth, author['pqe'])

def getInst(domain):
    dic = dict()
    with open ('./data/institution_domains.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            dic[row[1].split('.')[0]] = row[0]
    return dic[domain]

def getInstitutionPubs(institution, subject):
    endpoint = academic.get_authors_endpoint(institution, subject)[0]
    endpoint+=str(1000)
    top_authors = session.get(endpoint)
    publications = []
    auths = []
    requests = []
    if 200 <= top_authors.status_code < 300:
        for auth in getAuthorNames('microsoftAcademicAuthors.csv', institution):
            auths.append(getAuthorIds(auth, top_authors)) #(auth, authID)
        for (auth, authID) in auths:
            requests.append(multiprocessing.Process(target=genPublications, args=(auth,authID,getInst(institution))))
        for item in requests:
            item.start()
        for item in requests:
            item.join()
            '''
            a = time.time()
            pub = genPublications(auth,authID,getInst(institution))
            b = time.time()
            write(pub)
            publications += pub
            t = b-a
            print(f'{auth}\t\t{authID}\t\t{(t)}')'''
    return publications

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

def writeTestCSV(domain = 'cmu'):
    with open('microsoftAcademicAuthors.csv','w') as f:
        writer = csv.writer(f)
        for item in academic.get_top_authors('cmu','Computer Science',1000):
            writer.writerow([item,'cmu'])


def main(institution):
    a = time.time()
    #publications = genPublications("Eric P. Xing","Composite(AA.AuId=351197510)", 'Carnegie Mellon University')
    #write(publications)
    getInstitutionPubs('cmu','computer science')
    b = time.time()
    print(f'TIME TAKEN FOR EXECUTION: {(b-a)}')
if __name__ == "__main__":
    main('cmu')



