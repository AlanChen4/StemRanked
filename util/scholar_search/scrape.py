import os, csv, microsoftAcademicScraper, time, multiprocessing

output_dir = 'util/faculty_search/output'

def scrapeAuthor(auth, authID, university):
    start = time.time()
    publications = microsoftAcademicScraper.genPublications(auth,f"Composite(AA.AuId={authID})", university)
    microsoftAcademicScraper.write(publications)
    end = time.time()
    print(f"Time Taken for Composite(AA.AuId={authID}),\t {auth}:\t\t{(end-start)}")


def scrapeUniversity(filename, university, subject):
    with open(output_dir+'/'+filename) as f:
        reader = csv.reader(f)
        maAuthors = {}
        gsAuthors = {}
        for row in reader:
            if (row[1].find('https')==-1):
                maAuthors[row[0]] = int(row[1])
            elif(row[1].find('_')!=-1 and row[1].find('_')<row[1].find('https')):
                maAuthors[row[0]] = int(row[1][:row[1].find('_')]) 
            else:
                gsAuthors[row[0]] = row[1]

        for auth in list(maAuthors.keys()):            
            scrapeAuthor(auth,maAuthors[auth],university)

            

def main():
    for filename in os.listdir(output_dir):
        if filename.endswith('.csv'):
            university = filename[:filename.find('_')].strip()
            subject = filename[filename.find('_')+1:filename.find('.csv')].strip()
            scrapeUniversity(filename,university,subject)


if __name__ == "__main__":
    main()
