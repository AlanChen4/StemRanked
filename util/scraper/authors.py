import copy
import uuid

from .academic import *


def get_authors(uni_name, field):
    """Returns list of authors from google
    scholar and microsoft academic"""

    # author_list.append({'id': str(uuid.uuid4()), 'first': 'alan', 'last': 'chen'})

    aa = get_academic_authors(uni_name, field)
    aa = clean_authors(aa)
    return aa


def get_scholar_authors():
    pass


def clean_authors(authors):
    """
    Return the list of authors in proper format so it can be inserted into database

    :param authors: list of authors in format "first_name m. last_name"
    :return: list of authors in format {id, first_name, last_name}
    """

    cleaned_list = []

    # remove middle names to reduce error from middle name being left out on certain platforms
    # also create uuid, and store first/last name in proper format
    authors_copy = copy.deepcopy(authors)
    for name in authors_copy.keys():
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        # add uuid and store in proper format
        entry = {'id': str(uuid.uuid4()), 'first': first_name, 'last': last_name}

        cleaned_list.append(entry)

    return cleaned_list


