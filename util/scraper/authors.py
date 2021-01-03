import copy
import uuid

from .academic import get_academic_authors


def get_authors(uni_name, field):
    """
    Returns list of authors from google
    scholar and microsoft academic
    """
    academic_authors = get_academic_authors(uni_name, field)
    cleaned_authors = clean_authors(academic_authors)

    return cleaned_authors


def clean_authors(academic):
    """
    Return the list of authors in proper format so it can be inserted into database

    :param academic : list of authors from microsoft academic
    :return: list of authors in format {id, first_name, last_name}
    """

    cleaned_list = []

    # remove middle names to reduce error from middle name being left out on certain platforms
    no_middle_academic = {}

    academic_copy = copy.deepcopy(academic)
    for name in academic_copy.keys():
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        no_middle_academic[first_name + ' ' + last_name] = academic_copy[name]

    # convert into proper format and return
    for author in academic_copy.keys():
        split_name = author.split()
        first_name, last_name = split_name[0], split_name[-1]
        author_info = {
            'id': str(uuid.uuid4()),
            'first': first_name,
            'last': last_name,
        }
        cleaned_list.append(author_info)

    return cleaned_list
