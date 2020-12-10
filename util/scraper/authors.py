import copy
import uuid

from .academic import *


def get_authors(uni_name, field):
    """Returns list of authors from google
    scholar and microsoft academic"""

    # author_list.append({'id': str(uuid.uuid4()), 'first': 'alan', 'last': 'chen'})

    aa = get_academic_authors(uni_name, field)
    aa = clean_authors(aa, {'Lawrence Carin': 343434})
    return aa


def get_scholar_authors():
    pass


def clean_authors(academic, scholar):
    """
    Return the list of authors in proper format so it can be inserted into database

    Both academic and scholar should be inputted as list with [full_name]

    :param academic : list of authors from microsoft academic
    :param scholar: list of authors form google scholar
    :return: list of authors in format {id, first_name, last_name}
    """

    cleaned_list = []

    # remove middle names to reduce error from middle name being left out on certain platforms
    no_middle_academic = []
    no_middle_scholar = []

    academic_copy = copy.deepcopy(academic)
    for name in academic_copy.keys():
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        no_middle_academic.append(first_name + ' ' + last_name)

    scholar_copy = copy.deepcopy(scholar)
    for name in scholar_copy.keys():
        # remove middle name
        split_name = name.split()
        first_name = split_name[0]
        last_name = split_name[-1]

        no_middle_scholar.append(first_name + ' ' + last_name)

    # remove duplicates from google scholar and microsoft academic
    for academic_author in no_middle_academic:
        for scholar_author in no_middle_scholar:
            if academic_author == scholar_author:
                no_middle_scholar.remove(academic_author)
                no_middle_academic.remove(scholar_author)
    combined = no_middle_scholar + no_middle_academic

    # convert into proper format and return
    for author in combined:
        split_name = author.split()
        first_name, last_name = split_name[0], split_name[-1]
        cleaned_list.append({'id': str(uuid.uuid4()), 'first': first_name, 'last': last_name})

    return cleaned_list
