import readCSV from './dataReader';
import { findAllByRole, findAllByTestId } from '@testing-library/react';

// Object.keys(dictionary).length <-- find the length of the dictionary
// delete dictionary[key] <-- remove elements from a dictionary
//!(rank_dic.hasOwnProperty(currentCollegeInfo[i][1]))

// Dictionary in which the keys are areas and the values are conferences

let areaDict = {
    "vision": ['cvpr', 'iccv', 'eccv'],
    "plan": ['popl', 'pldi', 'oopsla', 'icfp'],
    "soft": ['icse', 'fse', 'ase', 'issta'],
    "ops": ['sosp', 'osdi', 'eurosys', 'fast', 'usenixatc'],
    'metrics': ['imc', 'sigmetrics'],
    'mobile': ['mobisys', 'mobicom', 'sensys'],
    'hpc': ['sc', 'hpdc', 'ics'],
    'bed': ['emsoft', 'rtss', 'rtas'],
    'da': ['iccad', 'dac'],
    'mod': ['vldb', 'sigmod', 'icde', 'pods'],
    'sec': ['ccs', 'oakland', 'usenixsec', 'ndss', 'ieee s&p', 'pets'],
    'comm': ['sigcomm', 'nsdi'],
    'arch': ['asplos', 'isca', 'micro', 'hpca', 'neurlps'],
    'log': ['cav', 'lics'],
    'act': ['focs', 'stoc', 'soda'],
    'mlmining': ['nips', 'icml', 'kdd'],
    'compgraph': ['siggraph', 'siggraph-asia'],
    'ir': ['sigir', 'www'],
    'chi': ['chiconf', 'ubicomp', 'uist', 'imwut, pervasive'],
    'nlp': ['emnlp', 'acl', 'naacl'],
    'robotics': ['icra', 'iros', 'rss'],
    'crypt': ['crypto', 'eurocrypt'],
    'bio': ['ismb', 'recomb'],
    'visual': ['vis', 'vr'],
    'ecom': ['ec', 'wine', 'cse'],
    'ai': ['aaai', 'ijcai']

}

// Returns the final rankings from dictionary that contains the average count and institutions
function ranks(counts, colleges) {
    let averageCount = [];

    for (let i = 0; i < Object.keys(counts).length; i++) {
        averageCount.push(counts[colleges[i]]);
    }

    averageCount.sort(function (a, b) { return a - b });
    averageCount.reverse();

    let final_rank = {};
    for (let j = 0; j < Object.keys(counts).length; j++) {
        for (let x = 0; x < averageCount.length; x++) {
            if (counts[colleges[x]] === averageCount[j]) {
                final_rank[colleges[x]] = averageCount[j];
            }
        }
    }
    return final_rank;
}

// Returns a dictionary with average count and institutions from a dictionary that has the institution, areas, and adjusted count
function avgCount(rank_dic) {

    let counts = {};
    for (let inst of Object.keys(rank_dic)) {
        let prod = 1;
        let numAreas = 5;
        for (let area of Object.keys(rank_dic[inst])) {
            numAreas++;
            prod *= (rank_dic[inst][area] + 1)
        }

        counts[inst] = Math.pow(prod, (1 / numAreas))
    }
    return (counts)
}

// Returns the areas based on what the conference is
function confAreas(conferences) {
    for (let x = 0; x < Object.keys(areaDict).length; x++) {
        if ((areaDict[Object.keys(areaDict)[x]].includes(conferences))) {
            return (Object.keys(areaDict))[x];
        }

    }
    return ("Cannot find area")
}
// Ranks the authors of each institution from the adjusted count
function AuthorRank(author_rank_dic, institutionAuthors) {
    let finalAuthorRank = {};
    for (let x = 0; x < institutionAuthors.length; x++) {
        finalAuthorRank[institutionAuthors[x]] = {};
    }
    for (let inst of Object.keys(author_rank_dic)) {
        let authorCount = [];
        let authorNames = Object.keys(author_rank_dic[inst]);
        for (let author of Object.keys(author_rank_dic[inst])) {
            authorCount.push(author_rank_dic[inst][author])
        }
        for (let i = 0; i < authorCount.length - 1; i++) {
            let maxIdx = i;
            for (let j = i + 1; j < authorCount.length; j++) {
                if (authorCount[j] > authorCount[maxIdx]) {
                    maxIdx = j;
                }
            }
            let temp = authorCount[maxIdx];
            authorCount[maxIdx] = authorCount[i];
            authorCount[i] = temp;

            let temp2 = authorNames[maxIdx];
            authorNames[maxIdx] = authorNames[i];
            authorNames[i] = temp2;
        }
        finalAuthorRank[inst] = authorNames;
    }
    return finalAuthorRank;
}

// Adds the institution name to the array 'colleges'
function getInstitutions(institutions, colleges) {
    colleges.push(institutions);
}

// Created a dictionary from the publications that contains the institution names, areas, and the adjusted count
function rankingsInfo(currentCollegeInfo, colleges) {
    let rank_dic = {};
    for (let i = 0; i < currentCollegeInfo.length; i++) {
        if (!(rank_dic.hasOwnProperty(currentCollegeInfo[i][0]))) {
            rank_dic[(currentCollegeInfo[i][0])] = {}
            getInstitutions((currentCollegeInfo[i])[0], colleges);
        }
        if (!(Object.keys(rank_dic[(currentCollegeInfo[i][0])]).includes(confAreas(currentCollegeInfo[i][2])))) {
            rank_dic[(currentCollegeInfo[i][0])][confAreas(currentCollegeInfo[i][2])] = currentCollegeInfo[i][3];
        }
        else {
            rank_dic[(currentCollegeInfo[i][0])][confAreas(currentCollegeInfo[i][2])] += currentCollegeInfo[i][3];
        }
    }
    return rank_dic;

}
// Creates an array of all the institutions
function getCollegeAuthors(college, institutionAuthors) {
    institutionAuthors.push(college);
}

// Creates a dictionary with the institution names, authors, and adjusted counts for each author
function AuthorList(final_colleges, institutionAuthors) {
    let author_rank_dic = {};
    for (let i = 0; i < final_colleges.length; i++) {
        if (!(author_rank_dic.hasOwnProperty(final_colleges[i][0]))) {
            author_rank_dic[(final_colleges[i][0])] = {};
            getCollegeAuthors((final_colleges[i])[0], institutionAuthors);
        }
        if (!(Object.keys(author_rank_dic[(final_colleges[i][0])]).includes(final_colleges[i][1]))) {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]] = final_colleges[i][3];
        }
        else {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]] += final_colleges[i][3];
        }
    }
    return author_rank_dic;

}
// Checks to see if the area that the user inputsis matches the publication area
function areaCheck(currentCollegeInfo, area) {
    if (area.length === 0) {
        return currentCollegeInfo;
    }
    let final_colleges = [];
    for (let j = 0; j < area.length; j++) {
        for (let i = 0; i < currentCollegeInfo.length; i++) {
            if (confAreas(currentCollegeInfo[i][2]) === area[j]) {
                final_colleges.push(currentCollegeInfo[i]);
            }
        }
    }
    return final_colleges;
}

//Uses the user's entry of start year and end year to filter out publications in a given timeline.
function yearCheck(collegeInfo, startYear, endYear) {
    let currentInfo = [];
    for (let i = 0; i < collegeInfo.length; i++) {
        if ((collegeInfo[i][4] >= startYear) && collegeInfo[i][4] <= endYear) {
            currentInfo.push(collegeInfo[i]);
        }
    }
    return currentInfo;
}

// Logs everythin on console in the local browser
async function rankings(subject, subAreas, startYr, endYr) {
    let institutionAuthors = [];
    let colleges = [];
    let collegeInfo = await readCSV(subject);
    console.log('Result of readCSV call', collegeInfo);

    let currentCollegeInfo = yearCheck(collegeInfo, startYr, endYr);
    console.log('Result of yearCheck call', currentCollegeInfo);

    // 'vision', "plan", "soft", "ops", "metrics", "mobile", "hpc", "bed", "da", "mod", "sec", "comm", "arch", "log", "act", "mlmining", "compgraph", "ir", "chi", "nlp", "robotics", "crypt", "bio", "visual", "ecom", "ai"
    let final_colleges = areaCheck(currentCollegeInfo, subAreas);
    console.log('The filtered data', final_colleges);

    let rankAuthors = AuthorList(final_colleges, institutionAuthors);
    console.log('The adjusted count per author', rankAuthors);
    let finalAuthors = AuthorRank(rankAuthors, institutionAuthors);
    console.log('Authors', finalAuthors);

    let rank_dic = rankingsInfo(final_colleges, colleges);
    console.log('Result of rankingsInfo call', rank_dic);

    let counts = avgCount(rank_dic);
    console.log('Result of avgCount call', counts);

    let final = ranks(counts, colleges);
    console.log('Result of ranks call', final);

    return [final, finalAuthors];
}

export default rankings;
