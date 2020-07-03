import * as Papa from 'papaparse';

async function readCSV(subject) {
    const files = {
        'test': './data/publication_information.csv',
        'Emery Computer Science': './data/generated-author-info.csv',
        'Computer Science': '',
        'Life Sciences': '',
        'Chemistry': '',
        'Engineering': '',
        'Mathematics': '',
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

    if (file === './data/generated-author-info.csv') {
        for (let info of results.data) {
            parsed.push([info.Institution, info.Author, info.Venue, info.AdjustedCount, info.Year]);
        }
        return parsed;
    }
    for (let info of results.data) {
        parsed.push([info.Institution, info.Author, info.Conference, 1 / info.NumAuthors, info.Year]);
    }
    return parsed;
}

export default readCSV;