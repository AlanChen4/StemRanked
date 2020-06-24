import requests
from bs4 import BeautifulSoup

ses = requests.Session()

#_________________________________________________________________________________
def pubList(atags):
    urls = []
    base_url = "https://scholar.google.com"
    for atag in atags:
        if (atag['href'] == "javascript:void(0)"):
            try:
                new_url = atag["data-href"]
                if (not new_url.find("/citations?view_op=view_citation&hl=") == -1):
                    urls.append(base_url + new_url)
            except:
                pass
    return urls

def getPubUrls(query):
    auth_info = ses.get(url = query)
    if (auth_info.status_code < 300 and auth_info.status_code >=200):
        parse = BeautifulSoup(auth_info.text, "html.parser")
        atags = parse.find_all('a')
        pubs = pubList(atags)
        return pubs
    else:
        print("Author Request Failed")
        exit()

#_________________________________________________________________________________
def parseTable(div):
    pub_information = dict()
    for parent in div:
        child = parent.find_all("div")
        if (child[0].text == 'Description' or child[0].text == 'Total citations' or child[0].text == 'Scholar articles'): # child[0] is key and child[1] is value
            continue
        pub_information[child[0].text] = child[1].text
    return pub_information


def getTable(divisions):
    for div in divisions:
        try:
            if (div['id'] == "gsc_vcd_table"):
                return(parseTable(div))
        except:
            pass
            
    print("Failure: There is no information")
    exit()

def getTitle(divisions):
    for div in divisions:
        try: 
            if (div['id'] == "gsc_vcd_title"):
                return (div.a.text)
        except:
            pass
    print("Failure: Title not found")
    exit()

def cleanPages(pages):
    if (pages.find('-') == -1):
        print("Failure to identify valid page numbers")
    start_end = pages.split('-',1)
    return (int(start_end[0]),int(start_end[1]))

def pub_clean(pub_info): #convert authors from string to list and pages to tuple of startpage and endpage
    try:
        pub_info['Authors'] = pub_info['Authors'].split(',')
    except:
        print("Failure to Clean Authors")

    try:
        pub_info["Pages"] = cleanPages(pub_info["Pages"])
    except:
        print("Failure to Clean Pages")
    
    try:
        pub_info["Year"] = pub_info["Publication date"].split('/')[0]
        pub_info.pop("Publication date")
    except:
        print("Failure to Clean Year")
    return pub_info

def scrapePub(pub):
    paper = ses.get(url=pub)
    if (paper.status_code < 300 and paper.status_code >= 200):
        parse = BeautifulSoup(paper.text, "html.parser")
        divisions = parse.find_all('div')
        pub_info = getTable(divisions)
        pub_info["Title"] = getTitle(divisions)
        pub_info = pub_clean(pub_info)
        return(pub_info)

    else:
        print("Paper Request Failed")
        exit()

#_________________________________________________________________________________
def getAllInfo(auth_profile):
    pubs = getPubUrls(auth_profile)
    pub_info = []
    for pub in pubs:
        pub_info.append(scrapePub(pub))
    return pub_info
#_________________________________________________________________________________
def main():

    print(getAllInfo("https://scholar.google.com/citations?hl=en&user=S4GP-G4AAAAJ"))

    #TODO develop a method to expand the results of publications on a scolar profile

if __name__ == "__main__":
    main()