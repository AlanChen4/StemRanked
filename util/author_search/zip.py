import os

def zip_data():
    os.chdir("util/author_search/data/raw_data")
    for filename in os.listdir():
        os.system(f"gzip {filename}")


if __name__ == "__main__":
    zip_data()


