'''
Generates a CSV file for an author that contains information about every paper they've published
'''
import requests, csv, os, time
from bs4 import BeautifulSoup

ses = requests.Session()

#_________________________________________________________________________________COLLECT PUBLICATION LIST
def pubList(atags):
    '''given the atag of a publication, this returns a url that can be used to access a new page with all publication info'''
    urls = []
    base_url = "https://scholar.google.com" 
    for atag in atags:
        if (atag['href'] == "javascript:void(0)"): # google scholar blocks the ability to just click a link and have it open separately
            try:
                new_url = atag["data-href"]
                if (not new_url.find("/citations?view_op=view_citation&hl=") == -1):
                    urls.append(base_url + new_url)
            except:
                pass
    return urls

def check_end(parse): # checks to see if this page is the page after the final urls
    tds = parse.find_all('td')
    try:
        for item in tds:
            if (item.text == "There are no articles in this profile."): # always shown on the finalpage + 1 for every author
                return True
    except:
        pass
    return False

def getUrlsPerPage(query): # scrapes all urls from a given page of the author profile
    auth_info = ses.get(url=query)
    if (auth_info.status_code < 300 and auth_info.status_code >=200):
        parse = BeautifulSoup(auth_info.text, "html.parser")
        atags = parse.find_all('a')
        if (check_end(parse)): # exits if this is the page after the final page (triggers the flag in getPubUrls)
            return ([], True)
        pubs = pubList(atags) # list of all publication urls
        return (pubs, False)
    else:
        print("Author Request Failed")
        exit()

def getPubUrls(query): 
    '''google scholar only allows a max of 100 results per page, this function helps alter the url
    and send multiple requests to get the valid urls from all pages of the author profile'''
    article_start = 0 
    stop_trigger = False # triggers when page displays "There are no articles in this profile" which is the page after the final page
    pubs = []
    while (not stop_trigger):
        add_on = f"&cstart={article_start}&pagesize=100" 
        print(query + add_on)
        (pub, stop_trigger) = getUrlsPerPage(query + add_on)
        pubs += pub
        article_start += 100 # to move to the next 100 publications
        time.sleep(2) # hopefully enough not to get banned
    return pubs

#_________________________________________________________________________________SCRAPE PUBLICATION INFORMATION
def parseTable(div):
    pub_information = dict()
    for parent in div:
        child = parent.find_all("div")
        # we want to avoid Description, Total Citations, and Scholar Articles because they are not valuable for this project
        if (child[0].text == 'Description' or child[0].text == 'Total citations' or child[0].text == 'Scholar articles'): # child[0] is key and child[1] is value
            continue
        pub_information[child[0].text] = child[1].text
    return pub_information

def getTable(divisions):
    for div in divisions:
        try:
            if (div['id'] == "gsc_vcd_table"):
                return parseTable(div)
        except:
            pass
            
    print("Failure: There is no information")
    exit()

def getTitle(divisions):
    for div in divisions:
        try: 
            if (div['id'] == "gsc_vcd_title"):
                return div.a.text
        except:
            pass
    print("Failure: Title not found")
    raise ValueError("Failure: Title not found")

def cleanPages(pages):
    if (pages.find('-') == -1):
        print("Failure to identify valid page numbers")
        raise ValueError("Failure to identify valid page numbers")

    start_end = pages.split('-', 1)
    return (int(start_end[0]), int(start_end[1]))

def getAuthor(query): # NOT CURRENTLY NEEDED OR IN USE
    val = ses.get(url='https://scholar.google.com/citations?user=S4GP-G4AAAAJ&hl=en&oi=ao')
    soup = BeautifulSoup(val.text, 'html.parser')
    return soup.find_all('div', {'id':'gsc_prf_in'})[0].text

def pub_clean(pub_info, query): #convert authors from string to list and pages to tuple of startpage and endpage
    try:
        # TODO it would probably be a good idea to actually get rid of the authors, make a new section called numAuthors with 
        # the number of authors, and fill the original spot with this particular author's name
        pub_info['Authors'] = pub_info['Authors'].split(',')
        print(pub_info['Authors'])
        pub_info['NumAuthors'] = len(pub_info['Authors'])
        pub_info['Authors'] = getAuthor(query) #yet to complete
    except:
        print("Failure to Clean Authors")
        raise ValueError("Failure to Clean Authors")

    try:
        pub_info["Pages"] = cleanPages(pub_info["Pages"])
    except:
        print(f"Failure to Clean Pages\t\t{pub_info['Pages']}")
        raise ValueError("Failure to Clean Pages")
    
    try:
        pub_info["Year"] = pub_info["Publication date"].split('/')[0]
        pub_info.pop("Publication date")
    except:
        print("Failure to Clean Year")
        raise ValueError("Failure to Clean Year")
    return pub_info

def scrapePub(pub,auth_profile):
    paper = ses.get(url=pub)
    if (paper.status_code < 300 and paper.status_code >= 200):
        parse = BeautifulSoup(paper.text, "html.parser")
        divisions = parse.find_all('div')
        pub_info = getTable(divisions)
        try:
            pub_info["Title"] = getTitle(divisions)
            pub_info = pub_clean(pub_info, auth_profile)
        except:
            return False
        return pub_info

    else:
        print(f"Paper Request Failed: {pub}\t\t{paper.status_code}")
        exit()

#_________________________________________________________________________________MAIN FUNCTIONS TO RUN
def getAllInfo(auth_profile): 
    pubs = getPubUrls(auth_profile) # recieves a list of all the publications for this particular author
    pub_info = [] # creates a list to store information scraped from each publication (contains dictionaries)
    for pub in pubs:
        toAppend = scrapePub(pub, auth_profile) # obtains information for that specific publication
        if (toAppend == False):
            continue # effectively ignoring this publication
        pub_info.append(toAppend)
        time.sleep(2) # hopefully enough not to get banned
    return pub_info

def makeFile(csv_file):
    if (not os.path.isfile('./data/' + csv_file)):
        with open(csv_file,'w') as f:
            writer = csv.writer(f)
            writer.writerow(['Author', 'Title', 'Page Start', 'Page End', 'Conference', 'Publisher', 'Journal', 'Issue', 'Book', 'Volume', 'Edition', 'Year', 'NumAuthors'])

def writeInfo(csv_file, pub_info, authName): #takes the information and writes it to a csv called publication_information.csv
    makeFile(csv_file)
    with open(csv_file, 'a') as f:
        writer = csv.writer(f)
        for item in pub_info:
            author = authName; title = item['Title']; pageStart = item['Pages'][0]; pageEnd = item['Pages'][1]; year = item['Year']; numAuthors = item['NumAuthors']
            location = {'Conference': None, 'Publisher': None, 'Journal': None,'Issue': None, 'Book' : None, 'Volume': None, 'Edition': None} # because we don't know if they will exist
            for loc in location.keys():
                try:
                    location[loc] = item[loc]
                except:
                    pass
            writer.writerow([author, title, pageStart, pageEnd,location['Conference'],location['Publisher'],location['Journal'],location['Issue'],location['Book'],location['Volume'],location['Edition'], year, numAuthors])
            print(f"({author}, {title}, {pageStart}, {pageEnd},{location['Conference']},{location['Publisher']},{location['Journal']},{location['Issue']},{location['Book']},{location['Volume']},{location['Edition']}, {year}, {numAuthors})")

def main(csv_file,authName,query):
    pub_info = getAllInfo(query)
    writeInfo(csv_file, pub_info, authName)


if __name__ == "__main__":
    main("publication_information.csv","Eric Xing",'https://scholar.google.com/citations?user=5pKTRxEAAAAJ&hl=en&oi=ao')
