import uuid


def get_authors(uni_name, field):
    """Returns list of authors from google
    scholar and microsoft academic"""
    author_list = []
    author_list.append({'id': str(uuid.uuid4()), 'first': 'alan', 'last': 'chen'})
    author_list.append({'id': str(uuid.uuid4()), 'first': 'alan', 'last': 'chen'})
    author_list.append({'id': str(uuid.uuid4()), 'first': 'alan', 'last': 'chen'})
    return author_list
