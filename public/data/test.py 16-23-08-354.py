import csv
with open ("/Users/slahade/Desktop/testfolder/csrankings/generated-author-info.csv") as f:
    reader = csv.reader(f)
    sum = 0
    l = ['aaai','ijcai','cvpr','eccv','iccv','icml','kdd','nips','acl','emnlp','naacl','sigir','www']
    for row in reader:
        if (row[1] == "Carnegie Mellon University" and row[0]== "Eric P. Xing" and (row[2] in l)):
            sum+=float(row[4])
    print(sum)