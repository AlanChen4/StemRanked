import os
import sqlite3

from .academic import add_related_authors
from .authors import get_authors
from .proxy import get_proxy_local
from .publications import get_publications


def scrape_field(field):
    """
    Goes through each university in the university list and adds its information to the DB
    :param field: Name of the field that is being scraped
    """
    uni_list = get_universities()
    for uni in uni_list:
        print(f'[Started] Scraping {uni} for {field}')
        table_name = uni.replace(' ', '_')

        # add all information before scraping publications
        add_university(table_name)
        add_authors(table_name, uni, field)
        add_pc_and_id(table_name=table_name, uni_name=uni, field=field)

        # clean and remove mistake entries
        remove_unrelated_authors(table_name=table_name)
        remove_duplicate_authors(table_name=table_name)

        # add publications
        add_publications(table_name, uni, field)


def clear_db():
    """Deletes all tables from database"""
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        tables = c.execute('SELECT name FROM sqlite_master WHERE type="table"')
        for table in list(tables):
            c.execute('DROP TABLE ' + table[0])


def add_university(table_name):
    """
    Create table for university and add to main table

    :param table_name: name of the university with spaces replaced as underscore
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        c.execute("PRAGMA foreign_keys = ON;")

        # create table for university
        c.execute(f'''CREATE TABLE {table_name}(
                    id varchar primary key,
                    uni_name varchar,
                    first varchar,
                    last varchar,
                    field varchar,
                    academic varchar,
                    pub_count integer)''')


def add_authors(table_name, uni_name, field):
    """
    Adds list of authors based off university name and field

    :param table_name: name of the SQL table
    :param uni_name: name of the university
    :param field: name of the field that authors are being added from (CS)
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    all_authors = get_authors(uni_name, field)
    print(f'[Update] Adding authors from {uni_name} to database')
    for author in all_authors:
        with conn:
            c.execute(f'''INSERT INTO {table_name} (id, uni_name, first, last, field)
                        VALUES (
                            :id,
                            "{uni_name}",
                            :first,
                            :last,
                            "{field}")
                        ''',
                      {'id': author['id'], 'first': author['first'], 'last': author['last']})
    print(f'[Finished] Finished adding authors from {uni_name}')


def add_pc_and_id(table_name, uni_name, field):
    """
    Adds the publication count (pc) and the author id (id) to each of the authors
    :param table_name: name of table in SQL database
    :param uni_name: name of the university
    :param field: name of field being searched in
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    # get all rows from table
    c.execute(f'SELECT * FROM {table_name}')
    all_authors = c.fetchall()

    print('[Started] Getting pc and id info for authors')
    author_info = add_related_authors(all_authors, uni_name, field)
    for info in author_info:
        with conn:
            c.execute(f'''UPDATE {table_name} 
                        SET academic="{info['academic']}", 
                            pub_count="{info['pc']}"
                        WHERE id="{info['id']}"
                        ''')


def add_publications(table_name, uni_name, field):
    """
    Creates table (if not already exists) and adds unique publications

    :param table_name: name of the original SQL table containing the authors belonging to university
    :param uni_name: name of the university, which is also used as key to find university authors
    :param field: name of the field that the publications are being searched in
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    # create table for publications if it doesn't exist
    if len(list(c.execute(f'''SELECT name FROM sqlite_master 
                    WHERE type='table' AND name="{table_name}_pubs"'''))) == 0:
        with conn:
            c.execute(f'''CREATE TABLE {table_name}_pubs (
                        author_id varchar,
                        title varchar,
                        location varchar,
                        year INTEGER,
                        author_count INTEGER)''')

    # get all authors from specified university
    uni_authors = c.execute(f"SElECT * FROM {table_name} WHERE field='{field}'")

    all_publications = []
    get_publications(uni_authors, all_publications)
    all_pubs_length = len(all_publications)
    for index, pub in enumerate(all_publications):
        print(f'[Update] Adding {index}/{all_pubs_length}')
        with conn:
            c.execute(f'''INSERT INTO {table_name}_pubs VALUES(
                        :id,
                        :title,
                        :location,
                        :year,
                        :author_count)''', {
                'id': pub['author_id'], 'title': pub['title'], 'location': pub['location'],
                'year': pub['year'], 'author_count': pub['author_count']
            })
    print('[Finished] Added publications to database')


def remove_unrelated_authors(table_name):
    """
    Removes the authors whose academic && pub_count are either None or Null.
    This function is called after add_pc_and_id is called
    :param table_name: Name of table that the authors will be removed from
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        c.execute(f'''DELETE FROM {table_name} 
                        WHERE academic="None" 
                        OR academic IS NULL''')


def remove_duplicate_authors(table_name):
    """
    Removes any duplicate authors. Duplicate authors are identified as entries with the
    same ID on MA
    :param table_name: Name of the table that will have duplicate authors removed
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        c.execute(f'''DELETE FROM {table_name}
                    WHERE ROWID NOT IN (SELECT MIN(ROWID)
                    FROM {table_name}
                    GROUP BY ACADEMIC)''')


def get_universities():
    """
    Returns list of the top universities to be scraped
    :return: list of universities with their names
    """
    uni_path = os.path.dirname(__file__) + '/data/uni_list.csv'
    uni_list = []
    with open(uni_path, 'r') as f:
        for row in f.readlines():
            uni_list.append(''.join(row.split(',')[:-1]))
    return uni_list
