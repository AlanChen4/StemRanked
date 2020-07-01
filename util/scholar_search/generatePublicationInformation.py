import requests, csv, re, venues
from bs4 import BeautifulSoup

session = requests.Session()


def checkPages(pages):
    pageCount = 0
    p_list = pages.split('-')
    if (len(p_list) !=2):
        return False
    try:
        start = p_list[0]; end = p_list[1]
        re.sub("\D", "", start); re.sub("\D", "", end)
        start = int(start); end = int(end)
        return (end-start >= pageCount)
    except:
        return False

def furtherRequest(pub, requestType, beginningString = ''):
    requestFlag = (requestType == 'Check Publication')
    baseUrl = 'https://scholar.google.com'
    additionalUrl = pub.td.a['data-href']
    paper = session.get(url=baseUrl+additionalUrl)
    numAuthors = -1
    venue = None
    area = None

    if (paper.status_code<300 and paper.status_code>=200):
        soup = BeautifulSoup(paper.text, 'html.parser')
        table = list(soup.find_all('div',{'id':'gsc_vcd_table'}))[0]
        if (requestFlag):
            beginningString = beginningString[:round(len(beginningString)/4)]
            for item in table:                
                divs = item.find_all('div')
                if (divs[0].text != 'Scholar articles' and divs[0].text != 'Description'):
                    if (divs[1].text.find(beginningString) != -1):
                        venue = divs[1].text
        area = venues.check(venue)
        if (area is None):
            return False
                
        for item in table:
            if (list(item.find_all('div',{'class':'gsc_vcd_field'}))[0].text == 'Authors'):
                numAuthors = len(list(list(item.find_all('div',{'class':'gsc_vcd_value'}))[0].text.split(',')))
        return (area, numAuthors)
    else:
        print(f"Paper Request Failed: {baseUrl+additionalUrl}\t\t{paper.status_code}")
        exit()
        


def scrapeInfo(pub, auth_name,institution):
    numAuthors = -1
    pub_info = dict()
    pub_info['Year'] = list(pub.find_all('td',{'class':'gsc_a_y'}))[0].span.text  
    if (pub_info['Year'] == ''):
        print('Failure: No Year')
        return False 
    pub_info['Author'] = auth_name 
    pub_info['Institution'] = institution
    ven = None
    venue = list(pub.td.find_all('div', {'class':'gs_gray'}))[1].text #contains page numbers, but we cannot remove because the conference may have commas
    venue = venue[:venue.rfind(',')] #gets rid of the extra year at the end
    if (venue.find('…') != -1 or venue.find('...') != -1):
        if venues.check(venue,completion=.25):
            (ven, numAuthors) = furtherRequest(pub, 'Check Publication', beginningString=venue)
        return False
    else:
        if (venue.rfind(',') == -1):
            return False
        pages = venue[venue.rfind(',')+1:]
        if (not checkPages(pages)):
            print('Failure: Invalid Pages')
            return False
        venue = venue[:venue.rfind(',')]
        ven = venues.check(venue)
    if (ven == False):
        return False
    auths = pub.td.div.text    
    if (numAuthors != -1):
        pass
    elif (auths.find('...') == -1):
        numAuthors = len(list(auths.split(',')))
    else:
        numAuthors = furtherRequest(pub, 'Authors')[1]
    pub_info['Adjusted Count'] = 1/numAuthors
    pub_info['Venue'] = ven

    return pub_info


def check_end(parse): # checks to see if this page is the page after the final urls
    tds = parse.find_all('td')
    try:
        for item in tds:
            if (item.text == "There are no articles in this profile."): # always shown on the finalpage + 1 for every author
                return True
    except:
        pass
    return False

def getPubs(query, institution):
    informationCollection = [] #holds all valid publication information
    auth_info = session.get(url=query)
    if (auth_info.status_code < 300 and auth_info.status_code >=200):
        soup = BeautifulSoup(auth_info.text, "html.parser")
        if (check_end(soup)): # exits if this is the page after the final page (triggers the flag in getPages)
            return ([], True)
        publications = list(soup.find_all('tr',{'class': 'gsc_a_tr'}))
        for pub in publications:
            pub_info = scrapeInfo(pub, auth_name = soup.find_all('div', {'id':'gsc_prf_in'})[0].text, institution=institution)
            if (pub_info == False):
                continue
            informationCollection.append(pub_info)
        return (informationCollection, False)
    else:
        print(f"Author Request Failed\t\t{auth_info.status_code}")
        exit()


def getPages(query, institution): 
    '''google scholar only allows a max of 100 results per page, this function helps alter the url
    and send multiple requests to get the valid urls from all pages of the author profile'''
    article_start = 0 
    stop_trigger = False # triggers when page displays "There are no articles in this profile" which is the page after the final page
    pubs = []
    while (not stop_trigger):
        add_on = f"&cstart={article_start}&pagesize=100" 
        print(query + add_on)
        (pub, stop_trigger) = getPubs(query + add_on, institution)
        pubs += pub
        article_start += 100 # to move to the next 100 publications
        #time.sleep(2) # hopefully enough not to get banned
    return pubs


def main(query, institution,csv_file):
    pages = getPages(query, institution)
    print(getPages(query, institution))
    print(len(pages))

if __name__ == "__main__":
    main('https://scholar.google.com/citations?hl=en&user=5pKTRxEAAAAJ','Cargenie Mellon University', 'publication_information.csv')