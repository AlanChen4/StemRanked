from util.scraper import *

if __name__ == '__main__':
    clear_db()
    add_university('duke')
    add_university('unc')
    add_university('nc_state')

    add_authors('duke', 'computer_science')
    add_pc_and_id(table_name='duke', uni_name='duke', field='computer science')
    remove_unrelated_authors(table_name='duke')
