import microsoftAcademicScraper, csv

def main(subject):
    institutions = []
    with open('./data/institution_domains.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            institutions.append(row[0])
    
    for i in range(0,len(institutions),2):
        if (i != len(institutions)-1):
            microsoftAcademicScraper.main([institutions[i],institutions[i+1]], subject)
        else:
            print([institutions[i]],subject)

if __name__ == "__main__":
    main('Computer Science')