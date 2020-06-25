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

def check_end(parse):
    tds = parse.find_all('td')
    try:
        for item in tds:
            if (item.text == "There are no articles in this profile."):
                return True
    except:
        pass
    return False

def getUrlsPerPage(query):
    auth_info = ses.get(url = query)
    if (auth_info.status_code < 300 and auth_info.status_code >=200):
        parse = BeautifulSoup(auth_info.text, "html.parser")
        atags = parse.find_all('a')
        if (check_end(parse)):
            return([],True)
        pubs = pubList(atags)
        return (pubs,False)
    else:
        print("Author Request Failed")
        exit()

def getPubUrls(query):
    article_start = 0
    stop_trigger = False #triggers when page displays "There are no articles in this profile"
    pubs = []
    while (not stop_trigger):
        add_on = f"&cstart={article_start}&pagesize=100"
        print(query+add_on)
        (pub, stop_trigger) = getUrlsPerPage(query+add_on)
        pubs+=pub
        article_start+=100
    return pubs

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
    raise ValueError("Failure: Title not found")

def cleanPages(pages):
    if (pages.find('-') == -1):
        print("Failure to identify valid page numbers")
        raise ValueError("Failure to identify valid page numbers")

    start_end = pages.split('-',1)
    return (int(start_end[0]),int(start_end[1]))

def pub_clean(pub_info): #convert authors from string to list and pages to tuple of startpage and endpage
    try:
        pub_info['Authors'] = pub_info['Authors'].split(',')
    except:
        print("Failure to Clean Authors")
        raise ValueError("Failure to Clean Authors")

    try:
        pub_info["Pages"] = cleanPages(pub_info["Pages"])
    except:
        print("Failure to Clean Pages")
        raise ValueError("Failure to Clean Pages")
    
    try:
        pub_info["Year"] = pub_info["Publication date"].split('/')[0]
        pub_info.pop("Publication date")
    except:
        print("Failure to Clean Year")
        raise ValueError("Failure to Clean Year")
    return pub_info

def scrapePub(pub):
    paper = ses.get(url=pub)
    if (paper.status_code < 300 and paper.status_code >= 200):
        parse = BeautifulSoup(paper.text, "html.parser")
        divisions = parse.find_all('div')
        pub_info = getTable(divisions)
        try:
            pub_info["Title"] = getTitle(divisions)
            pub_info = pub_clean(pub_info)
        except:
            return False
        return(pub_info)

    else:
        print("Paper Request Failed")
        exit()

#_________________________________________________________________________________
def getAllInfo(auth_profile):
    pubs = getPubUrls(auth_profile)
    pub_info = []
    for pub in pubs:
        toAppend = scrapePub(pub)
        if (toAppend == False):
            continue #effectively ignoring this publication
        pub_info.append(toAppend)
    return pub_info
#_________________________________________________________________________________
def main():

    print(getAllInfo('https://scholar.google.com/citations?hl=en&user=FSIQi4IAAAAJ'))

    #TODO develop a method to expand the results of publications on a scolar profile

if __name__ == "__main__":
    main()