import * as Papa from 'papaparse';

async function readCSV(subject) {
    const files = {
        'Computer Science': './data/Computer_Science.csv',
        'Life Sciences': '',
        'Chemistry': '',
        'Engineering': '',
        'Mathematics': './data/Mathematics.csv',
        'Physics': '',
        'Statistics': '',
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

    for (let info of results.data) {
        parsed.push([info.Institution, info.Author, info.Venue.toLowerCase(), info.AdjustedCount, info.Year]);
    }
    return parsed;
}

export default readCSV;