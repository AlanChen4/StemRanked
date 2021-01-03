from util.scraper import *

if __name__ == '__main__':
    clear_db()
    add_university('duke')
    add_university('unc')
    add_university('nc_state')

    add_authors('duke', 'computer_science')
    # add_publications('duke', 'computer_science')
