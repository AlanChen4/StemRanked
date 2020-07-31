import gzip, csv
import time

with gzip.open('util/author_search/data/raw_data/raw_Computer_Science.csv.gz', 'rt') as f:
    reader = csv.reader(f)
    a = time.time()
    counter = 0
    d = {}
    for row in reader:
        if (row[2] == 'Neural Information Processing Systems'):
            d[row[1]] = d.get(row[1],0)+1
            counter+=1
            print(row)

    sort_orders = sorted(d.items(), key=lambda x: x[1], reverse=True)

    for i in sort_orders:
	    print(i[0], i[1])
    print(counter)
    b = time.time()
    print(b-a)