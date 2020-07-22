import os, csv, microsoftAcademicScraper, time, multiprocessing

output_dir = 'util/faculty_search/output'

def scrapeAuthor(auth, authID, university):
    start = time.time()
    publications = microsoftAcademicScraper.genPublications(auth,f"Composite(AA.AuId={authID})", university)
    microsoftAcademicScraper.write(publications)
    end = time.time()
    print(f"Time Taken for Composite(AA.AuId={authID}),\t{university},\t {auth}:\t\t{(end-start)}")


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

def multiUniversity(items):
    processes = []
    for item in items:
        processes.append(multiprocessing.Process(target=scrapeUniversity, args=(item[0],item[1],item[2])))
    for p in processes:
        p.start()
    for p in processes:
        p.join()


def main():
    items = []
    for filename in os.listdir(output_dir):
        if filename.endswith('.csv'):
            university = filename[:filename.find('_')].strip()
            subject = filename[filename.find('_')+1:filename.find('.csv')].strip()
            items.append((filename,university,subject))
            #scrapeUniversity(filename,university,subject)
    for i in range(0,len(items),2):
        a = time.time()
        if (i != len(items)-1):
            multiUniversity([items[i],items[i+1]])
        else:
            multiUniversity([items[i]])
        b = time.time()
        print(f'TIME TAKEN FOR EXECUTION: {(b-a)}')


if __name__ == "__main__":
    main()
