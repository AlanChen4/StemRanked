import os
import sqlite3

from .academic import add_related_authors
from .authors import get_authors
from .proxy import get_proxy_local
from .publications import get_publications


def clear_db():
    """Deletes all tables from database"""
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        tables = c.execute('SELECT name FROM sqlite_master WHERE type="table"')
        for table in list(tables):
            c.execute('DROP TABLE ' + table[0])


def add_university(uni_name):
    """
    Create table for university and add to main table

    :param uni_name: name of the university
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    with conn:
        c.execute("PRAGMA foreign_keys = ON;")

        # create table for university
        c.execute(f'''CREATE TABLE {uni_name}(
                    id varchar primary key,
                    uni_name varchar,
                    first varchar,
                    last varchar,
                    field varchar,
                    academic varchar,
                    pub_count integer)''')


def add_authors(uni_name, field):
    """
    Adds list of authors based off university name and field

    :param uni_name: name of the university
    :param field: name of the field that authors are being added from (CS)
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    field = field.replace('_', ' ')

    all_authors = get_authors(uni_name, field)
    print(f'[Update] Adding authors from {uni_name} to database')
    for author in all_authors:
        with conn:
            c.execute(f'''INSERT INTO {uni_name} (id, uni_name, first, last, field)
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


def add_publications(uni_name, field):
    """
    Creates table (if not already exists) and adds unique publications

    :param uni_name: name of the university, which is also used as key to find university authors
    :param field: name of the field that the publications are being searched in
    """
    conn = sqlite3.connect('rankings.db')
    c = conn.cursor()

    # create table for publications if it doesn't exist
    if len(list(c.execute(f'''SELECT name FROM sqlite_master 
                    WHERE type='table' AND name="{uni_name}_pubs"'''))) == 0:
        with conn:
            c.execute(f'''CREATE TABLE {uni_name}_pubs (
                        author_id varchar,
                        title varchar,
                        location varchar,
                        year INTEGER,
                        author_count INTEGER)''')

    # get all authors from specified university
    uni_authors = c.execute(f"SElECT * FROM {uni_name} WHERE field='{field.replace('_', ' ')}'")

    # add publications associated with each author
    proxies_path = os.path.dirname(__file__) + '/proxies/proxies.txt'
    proxies = get_proxy_local(proxies_path, 10)
    for a in list(uni_authors):
        if len(proxies) < 1:
            print('[Danger] Ran out of proxies, re-fetching proxies from list')
            proxies = get_proxy_local(proxies_path, 10)
        a_id, a_uni, a_first, a_last, a_field, author_id = a[0], a[1], a[2], a[3], a[4], a[5]
        a_publications = get_publications(a_uni, a_first, a_last, a_field, proxies, author_id)
        for pub in a_publications:
            with conn:
                c.execute(f'''INSERT INTO {uni_name}_pubs VALUES(
                            :id,
                            :title,
                            :location,
                            :year,
                            :author_count)''', {
                    'id': a_id, 'title': pub['title'], 'location': pub['location'],
                    'year': pub['year'], 'author_count': pub['author_count']
                })


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
