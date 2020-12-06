import uuid
import sqlite3

from .authors import get_authors
from .publications import get_publications


def clear_db():
    """Deletes all tables from database"""
    conn = sqlite3.connect('universities.db')
    c = conn.cursor()

    with conn:
        tables = c.execute('SELECT name FROM sqlite_master WHERE type="table"')
        for table in list(tables):
            c.execute('DROP TABLE ' + table[0])


def add_all(file_path):
    """Adds all universities from a given text file, along with
    their authors and publication information

    :param file_path: file path of the text file
    """
    pass


def add_university(uni_name):
    """Create table for university and add to main table

    :param uni_name: name of the university
    """
    conn = sqlite3.connect('universities.db')
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
                    pub_count integer,
                    publications_id varchar)''')


def add_authors(uni_name, field):
    """Adds list of authors based off university name and field

    :param uni_name: name of the university
    :param field: name of the field that authors are being added from (CS)
    """
    conn = sqlite3.connect('universities.db')
    c = conn.cursor()

    all_authors = get_authors(uni_name, field)
    for author in all_authors:
        with conn:
            c.execute(f'''INSERT INTO {uni_name} (id, uni_name, first, last, field)
                        VALUES (
                            :id,
                            "{uni_name}",
                            :first,
                            :last,
                            "{field}")''',
                      {'id': author['id'], 'first': author['first'], 'last': author['last']})


def add_publications(author_id):
    """Creates table (if not already exists) and adds unique publications

    :param author_id: unique author id associated with author
    """
    pass
