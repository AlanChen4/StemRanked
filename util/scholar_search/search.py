import html
import requests
from bs4 import BeautifulSoup

session = requests.Session()

def get_profile(name, uni_email):
    '''returns link to google scholar profile based on search query'''
    query = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="

    # adds + symbol between fname, lname, and email
    info = '+'.join(name.split(' ')) + f'+{uni_email}'
    query += info

    # TODO: implement proxy rotation and random user-agent
    search_resp = session.get(
        url=query
    )

    if 200 <= search_resp.status_code < 300:
        soup = BeautifulSoup(search_resp.text, 'html.parser')
        links = soup.find_all('a')
        profile_links = list(filter(lambda x: 'citations?hl=en&user' in str(x['href']), links))
        try:
            return 'https://scholar.google.com' + profile_links[0]['href']
        except IndexError:
            return 'no profile links found'
    else:
        print('search attempt failed')


def get_faculty(email_domain):
    '''return list of scholar-listed faculty members'''
    base_page = "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors="
    base_page += email_domain

    base_search = session.get(
        url=base_page
    )

    faculty = []

    # continue going to next page, until last page is reached
    while True:
        soup = BeautifulSoup(base_search.text, 'html.parser')
        nav_btns = soup.find_all('button', attrs={'aria-label':True})
        next_btn = list(filter(lambda x: x['aria-label'] == 'Next', nav_btns))

        # convert onclick text to unicode 
        next_link = str(next_btn[0]['onclick'][17:-1])
        a = next_link
        print(html.unescape(a))
        print('/citations?view_op\x3dsearch_authors\x26hl\x3den\x26oe\x3dASCII\x26mauthors\x3dqin+he\x26after_author\x3ddywJAKf-__8J\x26astart\x3d10')
        break

def main():
    print(get_profile('ketan mayer-patel', 'unc.edu'))

if __name__ == '__main__':
    main()

