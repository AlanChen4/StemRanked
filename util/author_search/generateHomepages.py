from bs4 import BeautifulSoup
import requests, os, csv, time, random, threading
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
            if (url.find("related")>-1):
                continue
            if (url.find('cache')>-1):
                if (ret != None):
                    continue
                try:
                    url = url[url.find("http"):url.find("+/")]
                except:
                    try:
                        url = url[url.find("http"):url.find("+/")]
                    except:
                        continue
                try:
                    req = session.get(url).status_code
                    if (req<200 or req>=300):
                        continue
                except:
                    continue
            if (url.find("~")>-1 and retType!="tilda"): #doesnt have to check for last name
                ret = url
                retType = "tilda"
            if (url.find("profile")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType==None):
                ret = url
                retType = "profile"
            if (url.find("faculty")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType!="tilda" and retType!="profile"):
                ret = url
                retType = "faculty"
            if (url.find("people")>-1 and url.lower().find(list(researcher.split(' '))[len(list(researcher.split(' ')))-1].strip().lower())>-1 and retType==None):
                ret = url
                retType = "people"
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

def get(homepages, author, institution):
    homepages[(author,institution)] = main(author,institution)
    print(f"({author},{institution}):\t\t{homepages[(author,institution)]}")

def write(directory, filename, homepages):
    homepageFile = f"{directory}/{filename[:filename.find('.csv')]}_Homepages.csv"
    with open(homepageFile,'a') as f:
        writer = csv.writer(f)
        for auth in homepages.keys():
            writer.writerow(auth[0],auth[1],homepages[auth])



def buildFacultyList():
    directory = "public/data"
    for filename in os.listdir(directory):
        faclist = []
        if (filename.endswith("info.csv")):
            homepageFile = f"{directory}/{filename[:filename.find('.csv')]}_Homepages.csv"
            if (not os.path.isfile(homepageFile)):
                with open(homepageFile, 'w') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Author', 'Institution','Homepage'])
            getFacs(f"{directory}/{filename}",faclist)
            print(faclist)
            homepages = {}
            '''for author in faclist:
                homepages[(author[0],author[1])] = main(author[0],author[1])
                print(f"({author[0]},{author[1]}):\t\t{homepages[(author[0],author[1])]}")
            print(homepages)'''
            numThreads=50
            for i in range(0,len(faclist),numThreads):
                threads = []
                for x in range(numThreads):
                    try:
                        threads.append(threading.Thread(target=get,args=(homepages,faclist[(i+x)][0],faclist[(i+x)][1])))
                    except:
                        break
                for thread in threads:
                    thread.start()
                for thread in threads:
                    thread.join()
            write(directory,filename,homepages)

if __name__ == "__main__":
    #main("Emma Brunskill", "Stanford University")
    buildFacultyList()