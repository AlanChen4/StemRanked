import requests
import time
import csv
import time
from bs4 import BeautifulSoup
import csv

session = requests.Session()


# Combines the words in the college name for the complete URL
def uniURLPart(search):
    search = search.replace(" ", "+")
    return search


# Combines all the parts of the URL to make a full URL for each college
def completeGoggleURL(google1, google2, google3, uniURL):
    url = google1 + str(uniURL) + google2 + str(uniURL) + google3
    return url


# Responsible for finding the urls of institutions when given all the a tags
def eduURLs(a_tags):
    urls = ""
    for a_tag in a_tags:
        newURL = a_tag["href"]
        if (newURL.find("www") > -1 and newURL.find(".edu") > -1):
            location1 = newURL.find("www")
            location2 = newURL.find(".edu")
            if (newURL.find(".edu") - newURL.find("www") <= 20):
                url = newURL[newURL.find("www") + 4: newURL.find(".edu") + 4]
                break
        elif (newURL.find("https://") > -1 and newURL.find(".edu") > -1):
            location1 = newURL.find("https://")
            location2 = newURL.find(".edu")
            if (newURL.find(".edu") - newURL.find("https://") <= 20):
                url = newURL[newURL.find(
                    "https://") + 8: newURL.find(".edu") + 4]
                break

    return url


# Responsible for parsing through the html from the URLs to find all the a tags
def universityWebsite(fullURL):
    uniWebsite = session.get(url=fullURL)
    if (uniWebsite.status_code >= 200 and uniWebsite.status_code <= 300):
        parse = BeautifulSoup(uniWebsite.text, 'html.parser')
        a_tags = parse.find_all('a')
        domain = eduURLs(a_tags)
    return (domain)


def main(search):
    google1 = "https://www.google.com/search?source=hp&ei=P7b0Xuz_H_TK1QH28aDYBQ&q="
    google2 = "&oq="
    google3 = "&gs_lcp=CgZwc3ktYWIQAzIHCAAQsQMQQzICCAAyBAgAEEMyBAgAEEMyAggAMgUIABCxAzICCAAyBQgAELEDMgIIADICCAA6BAgAEEc6BAgAEApQ5dwJWJHtCWDK7wloAHABeACAAbMBiAH8ApIBAzMuMZgBAKABAaoBB2d3cy13aXo&sclient=psy-ab&ved=0ahUKEwjy4MGQmJ3qAhUBoHIEHRYnAVkQ4dUDCAw&uact=5"
    uniURL = uniURLPart(search)
    fullURL = completeGoggleURL(google1, google2, google3, uniURL)
    return (universityWebsite(fullURL))


# Store the institution and the domain on a seperate csv file called 'institution_domains.csv'
def storeDomain(institution, domain):
    with open('institution_domains.csv', 'a') as f:
        writer = csv.writer(f)
        writer.writerow([institution, domain])
        print(f"{institution}\t\t{domain}")


# Ability to access the R1_R2_Institutions - Sheet1.csv for all the research institutions. This is the main method
def getInstitutions():
    with open("R1_R2_Institutions - Sheet1.csv", 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            storeDomain(row[0], main(row[0]))
            # to help ensure that the scraper doesn't get blocked
            time.sleep(4)


if __name__ == "__main__":
    getInstitutions()
