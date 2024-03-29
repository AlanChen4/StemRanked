import readCSV from './dataReader';
import { areaDictionary } from './constants';
import { env } from '../constants';

// Object.keys(dictionary).length <-- find the length of the dictionary
// delete dictionary[key] <-- remove elements from a dictionary
//!(rank_dic.hasOwnProperty(currentCollegeInfo[i][1]))

// Dictionary in which the keys are areas and the values are conferences

let areaDict = {};
let finalAuthorCounts = {};

// Returns the final rankings from dictionary that contains the average count and institutions
function ranks(counts, colleges) {
    let averageCount = [];
    let collegeList = [];

    for (let i = 0; i < Object.keys(counts).length; i++) {
        averageCount.push(counts[colleges[i]]);
        collegeList.push(colleges[i]);
    }

    let n = averageCount.length;

    for (let i = 0; i < n - 1; i++) {
        let max_idx = i;
        for (let j = i + 1; j < n; j++)
            if (averageCount[j] > averageCount[max_idx])
                max_idx = j;
        let temp = averageCount[max_idx];
        averageCount[max_idx] = averageCount[i];
        averageCount[i] = temp;

        let temp2 = collegeList[max_idx];
        collegeList[max_idx] = collegeList[i];
        collegeList[i] = temp2;
    }
    let final_rank = {};
    for (let i = 0; i < averageCount.length; i++) {
        final_rank[collegeList[i]] = averageCount[i];
    }

    return final_rank;

}

// Returns a dictionary with average count and institutions from a dictionary that has the institution, areas, and adjusted count
function avgCount(rank_dic, subAreas) {
    let numAreas = 0;
    let subAreaslength = subAreas.length;
    if (subAreaslength === 0) {
        subAreaslength = Object.keys(areaDict).length;
    }
    else {
        for (let i = 0; i < subAreas.length; i++) {
            numAreas += (areaDict[subAreas[i]].length);
        }
    }
    if (env) console.log('Number of Areas:', numAreas);
    let counts = {};
    for (let inst of Object.keys(rank_dic)) {
        let prod = 1;
        for (let area of Object.keys(rank_dic[inst])) {
            prod *= (rank_dic[inst][area] + 1);
        }
        counts[inst] = Math.pow(prod, (1 / numAreas));
    }
    return counts;
}

// Returns the areas based on what the conference is
function confAreas(conferences, areaDict) {
    for (let keys of Object.keys(areaDict)) {
        if ((areaDict[keys].includes(conferences))) {
            return (keys);
        }

    }
    return ("Cannot find area")
}
// Ranks the authors of each institution from the average count given by the adjusted counts and subject areas
function speciality(author_rank_dic) {
    let strongestAreas = {};
    for (let inst of Object.keys(author_rank_dic)) {
        strongestAreas[inst] = {};
        for (let author of Object.keys(author_rank_dic[inst])) {
            strongestAreas[inst][author] = {};
            let greatestArea = '';
            let areaAdj = 0;
            for (let areas of (Object.keys(author_rank_dic[inst][author]))) {
                if (author_rank_dic[inst][author][areas] > areaAdj) {
                    areaAdj = author_rank_dic[inst][author][areas];
                    greatestArea = areas;
                }
            }
            strongestAreas[inst][author] = greatestArea;
            greatestArea = '';
            areaAdj = 0;
        }
    }
    return strongestAreas;
}

function AuthorRank(author_rank_dic, institutionAuthors) {
    let finalAuthorRank = {};
    let finalAuthorCount = {}
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
        if (authorCount.length > 50) {
            authorCount = authorCount.splice(0, 50);
            authorNames = authorNames.splice(0, 50);
        }
        finalAuthorCount[inst] = authorCount;
        finalAuthorRank[inst] = authorNames;

    }
    finalAuthorCounts = finalAuthorCount;
    return finalAuthorRank;
}

//Computers the author average count from the dictionary author_rank_dic
function authorAvgCount(author_rank_dic, subAreas, areaDict) {
    if (env) console.log("This is author_rank_dic", author_rank_dic);
    let numAreas = subAreas.length;
    if (subAreas.length === 0) {
        numAreas = Object.keys(areaDict).length;
    }
    if (env) console.log('Number of areas for author rankings:', numAreas);
    let authorCounts = {};
    for (let inst of Object.keys(author_rank_dic)) {
        authorCounts[inst] = {};
        for (let author of Object.keys(author_rank_dic[inst])) {
            let add = 0;
            for (let area of Object.keys(author_rank_dic[inst][author])) {
                add += author_rank_dic[inst][author][area];
            }
            authorCounts[inst][author] = add;
        }
    }
    if (env) console.log(authorCounts);
    return authorCounts;

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
        if (!(Object.keys(rank_dic[(currentCollegeInfo[i][0])]).includes(currentCollegeInfo[i][2]))) {
            rank_dic[(currentCollegeInfo[i][0])][currentCollegeInfo[i][2]] = currentCollegeInfo[i][3];
        }
        else {
            rank_dic[(currentCollegeInfo[i][0])][currentCollegeInfo[i][2]] += currentCollegeInfo[i][3];
        }
    }
    return rank_dic;

}
// Creates an array of all the institutions
function getCollegeAuthors(college, institutionAuthors) {
    institutionAuthors.push(college);
}

// Creates a dictionary with the institution names, authors, and adjusted counts for each author
function AuthorList(final_colleges, institutionAuthors, areaDict) {
    let author_rank_dic = {};
    for (let i = 0; i < final_colleges.length; i++) {
        if (!(author_rank_dic.hasOwnProperty(final_colleges[i][0]))) {
            author_rank_dic[(final_colleges[i][0])] = {};
            getCollegeAuthors((final_colleges[i])[0], institutionAuthors);
        }
        if (!(author_rank_dic[(final_colleges[i][0])].hasOwnProperty(final_colleges[i][1]))) {
            author_rank_dic[final_colleges[i][0]][final_colleges[i][1]] = {};
        }
        if (!(Object.keys(author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]]).includes(confAreas(final_colleges[i][2], areaDict)))) {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]][confAreas(final_colleges[i][2], areaDict)] = final_colleges[i][3];
        }
        else {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]][confAreas(final_colleges[i][2], areaDict)] += final_colleges[i][3];
        }
    }
    return author_rank_dic;

}
// Checks to see if the area that the user inputsis matches the publication area
function areaCheck(currentCollegeInfo, area, subject) {
    let final_colleges = [];
    if (area.length === (Object.keys(areaDictionary[subject])).length) {
        return currentCollegeInfo;
    }

    else if (area.length < ((Object.keys(areaDictionary[subject])).length) / 2) {
        for (let i = 0; i < currentCollegeInfo.length; i++) {
            if (area.includes(confAreas(currentCollegeInfo[i][2], areaDict))) {
                final_colleges.push(currentCollegeInfo[i]);
            }
        }
        return final_colleges;
    }
    else {
        let difference = (Object.keys(areaDictionary[subject])).filter(x => !area.includes(x));
        if (env) console.log(difference);
        if (env) console.log(final_colleges.length);

        for (let i = 0; i < currentCollegeInfo.length; i++) {
            if (!(difference.includes(confAreas(currentCollegeInfo[i][2], areaDict)))) {
                final_colleges.push(currentCollegeInfo[i])
            }
        }

        if (env) console.log(final_colleges.length);
        return final_colleges;
    }
}

//Uses the user's entry of start year and end year to filter out publications in a given timeline.
function yearCheck(collegeInfo, startYear) {
    let currentInfo = [];
    for (let i = 0; i < collegeInfo.length; i++) {
        if ((collegeInfo[i][4] >= startYear)) {
            currentInfo.push(collegeInfo[i]);
        }
    }
    return currentInfo;
}

// Logs everything on console in the local browser
async function rankings(subject, subAreas, startYr) {
    if (env) console.log('Environment:', process.env.NODE_ENV);

    areaDict = areaDictionary[subject];
    if (env) console.log(areaDict);

    let institutionAuthors = [];
    let colleges = [];
    let collegeInfo = await readCSV(subject);
    if (env) console.log(subject);
    if (env) console.log('Result of readCSV call', collegeInfo);

    let currentCollegeInfo = yearCheck(collegeInfo, startYr);
    if (env) console.log('Result of yearCheck call', currentCollegeInfo);

    // 'vision', "plan", "soft", "ops", "metrics", "mobile", "hpc", "bed", "da", "mod", "sec", "comm", "arch", "log", "act", "mlmining", "compgraph", "ir", "chi", "nlp", "robotics", "crypt", "bio", "visual", "ecom", "ai"
    let final_colleges = areaCheck(currentCollegeInfo, subAreas, subject);
    if (env) console.log('The filtered data', final_colleges);

    let rankAuthors = AuthorList(final_colleges, institutionAuthors, areaDict);
    if (env) console.log('The adjusted count per author', rankAuthors);

    if (env) console.log('The average count for each author', authorAvgCount(rankAuthors, subAreas, areaDict))
    let averageCountAuthors = authorAvgCount(rankAuthors, subAreas, areaDict);

    let finalAuthors = AuthorRank(averageCountAuthors, institutionAuthors);
    if (env) console.log('Authors', finalAuthors);

    let authorArea = speciality(rankAuthors);
    if (env) console.log("Author strongest areas", authorArea);

    let rank_dic = rankingsInfo(final_colleges, colleges);
    if (env) console.log('Result of rankingsInfo call', rank_dic);

    let counts = avgCount(rank_dic, subAreas);
    if (env) console.log('Result of avgCount call', counts);

    let final = ranks(counts, colleges);
    if (env) console.log('Result of ranks call', final);

    if (env) console.log('Author Counts:', finalAuthorCounts);

    return [final, finalAuthors, finalAuthorCounts, authorArea, rankAuthors];
}

export default rankings;