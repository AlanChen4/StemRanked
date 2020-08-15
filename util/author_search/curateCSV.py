import gzip, csv, venues
import time

confs = []
with gzip.open('util/author_search/data/raw_data/raw_Mathematics.csv.gz', 'rt') as f:
    reader = csv.reader(f)
    for row in reader:
        val = venues.check(row[2], 'Mathematics')
        if (val != False):
            print((row[0],row[1],val,row[3],row[4]))
            confs.append((row[0],row[1],val,row[3],row[4]))
    
with open('public/data/Mathematics.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['Author', 'Institution', 'Venue', 'Year', 'AdjustedCount'])
    for item in confs:
        writer.writerow([item[0],item[1],item[2],item[3],item[4]])