import * as Papa from 'papaparse';

async function readCSV(subject) {
    const files = {
        'test': './data/publication_information.csv',
        'Emery Computer Science': './data/generated-author-info.csv', // ./data/generated-author-info.csv
        'Computer Science': './data/Computer_Science.csv',
        'Life Sciences': '',
        'Chemistry': '',
        'Engineering': '',
        'Mathematics': './data/Mathematics.csv',
        'Physics': ''
        // TODO: add corresponding subject area csv path
    };
    const papaPromise = (filePath) => new Promise((resolve) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results);
            }
        });
    })
    let parsed = [];

    //console.log('Subject:', subject);

    const file = files[subject];
    const results = await papaPromise(file);

    if (file === './data/Computer_Science.csv') { // ./data/generated-author-info.csv
        for (let info of results.data) {
            parsed.push([info.Institution, info.Author, info.Venue.toLowerCase(), info.AdjustedCount, info.Year]);
        }
        return parsed;
    }
    for (let info of results.data) {
        parsed.push([info.Institution, info.Author, info.Venue, info.AdjustedCount, info.Year]);
    }
    return parsed;
}

export default readCSV;