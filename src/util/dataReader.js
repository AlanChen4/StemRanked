import * as Papa from 'papaparse';

async function readCSV(subject) {
    const files = {
        'test': './data/publication_information.csv',
        'namh': './data/generated-author-info.csv',
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
    let parsed = {};

    console.log('Subject:', subject);

    const file = files[subject];
    let count = 0;
    const results = await papaPromise(file);

    // TODO: see if parseInt() and parseFloat() is faster than dynamicTyping
    if (subject === 'namh') {
        for (let info of results.data) {
            parsed[count] = [info.name, info.dept, info.area, info.adjustedcount, info.year];
            count++;
        }
        
        return parsed;
    }

    for (let info of results.data) {
        parsed[count] = [info.Author, info.Institution, info.Conference, 1 / info.NumAuthors, info.Year];
        count++;
    }
    
    return parsed;
}

export default readCSV;