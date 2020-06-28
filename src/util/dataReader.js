import * as Papa from 'papaparse';

function readCSV(subject) {
    const files = {
        'test': './data/publication_information.csv'
    };
    const parsed = {};

    console.log('Subject:', subject);
    const file = files[subject];

    Papa.parse(file, {
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