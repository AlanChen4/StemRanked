import * as Papa from 'papaparse';

function readCSV(subject) {
    console.log(subject);
    const file = 'Arizona State University,asu.edu\nAuburn University,auburn.edu\nBinghamton University,binghamton.edu\nBoston College,bc.edu\nBoston University,bu.edu'
    const parsed = Papa.parse(file);
    console.log(parsed.data);
    return parsed.data;
}

export default readCSV;