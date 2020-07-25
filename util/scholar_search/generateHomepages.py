from bs4 import BeautifulSoup
import requests, os, csv, time, random
from fake_useragent import UserAgent
ua = UserAgent()
print("hello")


session = requests.Session()

def checkTilda(links, researcher):
    ret = None
    retType = None # the order is tilda, people, faculty
    for link in links:
        try:
            url = link['href'][link['href'].find('=')+1:link['href'].find('&')]
            if (url.find('edu')==-1):
                continue
            if (url.find("~")>-1 and retType!="tilda"): #doesnt have to check for last name
                ret = url
                retType = "tilda"
            if (url.find("profile")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType==None):
                ret = url
                retType = "profile"
            if (url.find("people")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType!="tilda" and retType!="profile"):
                ret = url
                retType = "people"
            if (url.find("faculty")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType==None):
                ret = url
                retType = "faculty"
        except:
            pass
    if (ret == None):
        return ret

    head = ret[:ret.find('//')+2]
    ret = ret[ret.find('//')+2:]
    urlsParts = ret.split('/')
    endVal = None
    for i in range(len(urlsParts)):
        if (urlsParts[i].lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 or urlsParts[i].find('~')>-1): #should be first one
            endVal = i
            break;
    newRet = head
    for i in range(endVal+1):
        newRet+=f"{urlsParts[i]}/"

    return newRet

def main(researcher, institution):
    researcher = researcher.strip()
    institution = institution.strip()
    baseURL = "https://www.google.com/search?q="
    for word in list(researcher.split(' ')):
        baseURL+= f"+{word}"
    for word in list(institution.split(' ')):
        baseURL+= f"+{word}"
    #proxies = {'https': 'https://64.235.204.107:8080',}
    header = {'User-Agent':str(ua.random)}
    response = session.get(baseURL,headers=header)
    if (response.status_code>=200 and response.status_code<300):
        val = BeautifulSoup(response.text, 'html.parser') 
        links  = val.find_all('a')
        url = checkTilda(links, researcher)
        return url
    else:
        time.sleep(random.randint(0,9))
        print(response.status_code)
        return main(researcher, institution)


def getFacs(path, faclist):
	with open(path, 'r', encoding='utf-8') as f:
		reader = csv.reader(f)
		for row in reader:
				if (not (row[0],row[1]) in faclist):
					faclist.append((row[0],row[1]))
					print((row[0],row[1]))


def buildFacultyList():
    directory = "public/data"
    for filename in os.listdir(directory):
        faclist = []
        if (filename.endswith("info.csv")):
            getFacs(f"{directory}/{filename}",faclist)
            print(faclist)
            homepages = {}
            for author in faclist:
                homepages[(author[0],author[1])] = main(author[0],author[1])
                print(f"({author[0]},{author[1]}):\t\t{homepages[(author[0],author[1])]}")
            print(homepages)


if __name__ == "__main__":
    #main("Emma Brunskill", "Stanford University")
    buildFacultyList()