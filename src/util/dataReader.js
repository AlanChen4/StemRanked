import * as Papa from 'papaparse';

function readCSV(subject) {
    const urls = {
        'test': 'https://srv-file22.gofile.io/download/HtWYEn/publication_information.csv'
    }
    const parsed = {};

    console.log('Subject:', subject);
    const url = urls[subject];

    // TODO: add error catching in case the file request fails
    Papa.parse(url, {
        download: true,
        header: true,
        complete: (results) => {
            for (let x of results.data) {
                if (x.Author !== "") { // if the author is not empty --> is a bug on the backend right now
                    //console.log(x); // would print each row of the csv
                    parsed[Object.keys(parsed).length] = [x.Author, x.Institution, x.Conference, 1 / parseInt(x.NumAuthors, 10), parseInt(x.Year, 10)];
                }
            }
        }
    });

    return parsed;
}

export default readCSV;