from zipfile import ZipFile
import os

zipObj = ZipFile('util/author_search/data/author_info.zip', 'w')

os.chdir("util/author_search/data/")

zipObj.write("generated-publication-info.csv")
zipObj.close()

os.remove("generated-publication-info.csv")

