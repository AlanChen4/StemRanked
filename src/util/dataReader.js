import * as Papa from 'papaparse';

function readCSV(subject) {
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
    let parsed = {};

    console.log('Subject:', subject);
    const file = files[subject];
    let count = 0;

    // TODO: optimize the parser
    // IDEAS TO TRY:
    // - Get rid of console.log() statements and figure out a way to time the function
    // - Enable fastMode in papaparser
    // - see if parseInt() and parseFloat() is faster than dynamicTyping
    // - see what Emery did
    if (subject === 'namh') {
        Papa.parse(file, {
            download: true,
            header: true,
            dynamicTyping: true,
            step: (row) => {
                const info = row.data;
                parsed[count] = [info.name, info.dept, info.area, info.adjustedcount, info.year];
                count++;
            },
            complete: () => {
                console.log('And we are done!');
                console.log(parsed);
            }
        });
        
        return parsed;
        
    }

    Papa.parse(file, {
        download: true,
        header: true,
        dynamicTyping: true,
        step: (row) => {
            const info = row.data;
            parsed[count] = [info.Author, info.Institution, info.Conference, 1 / info.NumAuthors, info.Year];
            count++;
        },
        complete: () => {
            console.log('And we are done!');
            console.log(parsed);
        }
    });
    
    return parsed;
}

export default readCSV;