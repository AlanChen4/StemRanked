import readCSV from './dataReader';

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

function AuthorRank(author_rank_dic, institutionAuthors, authorarray) {
    let finalAuthorRank = {};
    for (let x = 0; x < institutionAuthors.length; x++) {
        finalAuthorRank[institutionAuthors[x]] = {};
    }
    for (let inst of Object.keys(author_rank_dic)) {
        let authorCount = [];
        for (let author of Object.keys(author_rank_dic[inst])) {
            authorCount.push(author_rank_dic[inst][author])
        }
        authorCount.sort(function (a, b) { return a - b });
        authorCount.reverse();

        /*for (let author in Object.keys(author_rank_dic[inst])) {
            for (let j of Object.keys(author_rank_dic[inst])) {
                if (author_rank_dic[inst][j] === authorCount[author]) {
                    finalAuthorRank[inst][j] = authorCount[author];
                }

            }
        }*/
        finalAuthorRank[inst] = authorCount;
    }
    return finalAuthorRank;
}

// Adds the institution name to the global array 'colleges'
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

function getCollegeAuthors(college, institutionAuthors) {
    institutionAuthors.push(college);
}

function getAuthors(theauthor, authorarray) {
    authorarray.push(theauthor)
}

function AuthorList(final_colleges, institutionAuthors, authorarray) {
    let author_rank_dic = {};
    for (let i = 0; i < final_colleges.length; i++) {
        if (!(author_rank_dic.hasOwnProperty(final_colleges[i][0]))) {
            author_rank_dic[(final_colleges[i][0])] = {};
            getCollegeAuthors((final_colleges[i])[0], institutionAuthors);
        }
        if (!(Object.keys(author_rank_dic[(final_colleges[i][0])]).includes(final_colleges[i][1]))) {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]] = final_colleges[i][3];
            getAuthors(final_colleges[i][1], authorarray);
        }
        else {
            author_rank_dic[(final_colleges[i][0])][final_colleges[i][1]] += final_colleges[i][3];
        }
    }
    return author_rank_dic;

}

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

// Checks to make sure that each publication isn't before 2010
function yearCheck(collegeInfo) {
    let currentInfo = [];
    for (let i = 0; i < collegeInfo.length; i++) {
        if (collegeInfo[i][4] >= 2010) {
            currentInfo.push(collegeInfo[i]);
        }
    }
    return currentInfo;
}

// Logs everythin on console in the local browser
async function rankings(subject) {
    let institutionAuthors = [];
    let colleges = [];
    let authorarray = [];

    let collegeInfo = await readCSV(subject);
    console.log('Result of readCSV call', collegeInfo);

    let currentCollegeInfo = yearCheck(collegeInfo);
    console.log('Result of yearCheck call', currentCollegeInfo);

    let final_colleges = areaCheck(currentCollegeInfo, ['ai']);
    console.log('The filtered data', final_colleges);

    let rankAuthors = AuthorList(final_colleges, institutionAuthors, authorarray)
    console.log('The adjusted count per author', rankAuthors);
    console.log(authorarray);
    console.log('Authors', AuthorRank(rankAuthors, institutionAuthors, authorarray))

    let rank_dic = rankingsInfo(final_colleges, colleges);
    console.log('Result of rankingsInfo call', rank_dic);

    let counts = avgCount(rank_dic);
    console.log('Result of avgCount call', counts);

    let final = ranks(counts, colleges);
    console.log('Result of ranks call', final);

    return final;
}

export default rankings;