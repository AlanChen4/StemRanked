import csv, venues, math, operator
from collections import defaultdict 

dic = dict()
#with open('../../public/data/Computer_Science.csv') as f:
with open('util/scholar_search/data/Computer_Science.csv') as f:
    reader = csv.reader(f)
    for row in reader:
        if (row[0] == 'Author'):
            continue
        dic[row[1]] = dic.get(row[1],{})
        dic[row[1]][row[2]] = dic[row[1]].get(row[2],0) + float(row[4])
inst = {}
num_areas = 0
for field in venues.venue_dictionary['Computer Science']:
    num_areas+=len(venues.venue_dictionary['Computer Science'][field].keys())
for institution in dic.keys():
    product = 1
    for area in dic[institution].keys():
        product *= (1+dic[institution][area])
    #inst[institution] = 
    final_val = math.pow(product,(1/num_areas))
    inst[institution] = final_val

sorted_d = dict(sorted(inst.items(), key=operator.itemgetter(1),reverse=True))

for item in sorted_d.keys():
    print(f'{item}:\t\t{sorted_d[item]}')
print(num_areas) 