import copy
import os
import uuid

from .academic import get_academic_authors
from .scholar import get_scholar_authors


def get_authors(uni_name, field):
    """
    Returns list of authors from google
    scholar and microsoft academic
    """

    print('[Starting] Getting authors from MA')
    academic_authors = get_academic_authors(uni_name, field)

    proxies_path = os.path.dirname(__file__) + '/proxies/proxies.txt'

    print('[Starting] Getting authors from GS')
    scholar_authors = get_scholar_authors("duke.edu", field, proxies_path)
    cleaned_authors = clean_authors(academic_authors, scholar_authors)
    return cleaned_authors


def clean_authors(academic, scholar):
    """
    Return the list of authors in proper format so it can be inserted into database

    :param academic : list of authors from microsoft academic
    :param scholar: list of authors form google scholar
    :return: list of authors in format {id, first_name, last_name}
    """

    cleaned_list = []

    # remove middle names to reduce error from middle name being left out on certain platforms
    no_middle_academic = {}
    no_middle_scholar = {}

    academic_copy = copy.deepcopy(academic)
    for name in academic_copy.keys():
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        no_middle_academic[first_name + ' ' + last_name] = academic_copy[name]

    scholar_copy = copy.deepcopy(scholar)
    for name in scholar_copy:
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        no_middle_scholar[first_name + ' ' + last_name] = None

    # remove duplicates from google scholar and microsoft academic
    combined = {**no_middle_scholar, **no_middle_academic}

    # convert into proper format and return
    for author in combined.keys():
        split_name = author.split()
        first_name, last_name = split_name[0], split_name[-1]
        author_info = {
            'id': str(uuid.uuid4()),
            'first': first_name,
            'last': last_name,
        }
        if combined[author] is not None:
            author_info['id'] = combined[author]['id']
            author_info['pc'] = combined[author]['pub_count']
        else:
            author_info['id'] = None
            author_info['pc'] = None
        cleaned_list.append(author_info)

    return cleaned_list
