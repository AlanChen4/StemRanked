#converts dblp to dictionary to be analyzed
import xmltodict, gzip
import xml.etree.ElementTree as ET

with open("dblp.xml") as f1:
    tree = ET.parse(f1)
    root = tree.getroot()
    print (root.tag)



   

