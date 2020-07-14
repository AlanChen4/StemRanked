import microsoftAcademicScraper, csv, time

def main(subject):
    institutions = []
    with open('./data/institution_domains.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            institutions.append(row[0])

    last = 'Florida International University'
    check = True
    inst = []
    for i in range(0, len(institutions)):
        if (check):
            if (institutions[i] == 'University of North Dakota'):
                check = False
        else:
            inst.append(institutions[i])
    institutions = inst

    
    for i in range(0,len(institutions),2):
        a = time.time()
        if (i != len(institutions)-1):
            microsoftAcademicScraper.main([institutions[i],institutions[i+1]], subject)
        else:
            microsoftAcademicScraper.main([institutions[i]],subject)
        b = time.time()
        print(f'TIME TAKEN FOR EXECUTION: {(b-a)}')

if __name__ == "__main__":
    main('Computer Science')