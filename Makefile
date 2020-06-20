get_dblp: 
	@echo "Getting DBLP"
	rm -f dblp.xml.gz
	wget http://dblp.org/xml/dblp.xml.gz

unzip_dblp:
	@echo "Unzipping DBLP"
	gunzip dblp.xml.gz
