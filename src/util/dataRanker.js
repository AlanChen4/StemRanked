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

// Global array that has the institutions
// rank_dic[colleges[0]] <-- all the areas and it's values in Imperial College London key

// Returns the final rankings from dictionary that contains the average count and institutions
function ranks(counts,colleges) {
    let averageCount = [];

    console.log('Right before the first loop in ranks()', counts);
    for (let i = 0; i < Object.keys(counts).length; i++) {
        //Added this statement to log all the college names
        console.log((Object.keys(counts))[i]);
        averageCount.push(counts[colleges[i]]);
    }
    console.log('Right after the first loop in ranks()', averageCount);

    // points.sort(function(a, b){return a - b});
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
            numAreas++
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
    //return conferences;
    return ("Cannot find area")
}

// Adds the institution name to the global array 'colleges
function getInstitutions(institutions,colleges) {
    colleges.push(institutions);

}

// Created a dictionary from the publications that contains the institution names, areas, and the adjusted count
function rankingsInfo(currentCollegeInfo,colleges) {
    let rank_dic = {};
    for (let i = 0; i < currentCollegeInfo.length; i++) {
        if (!(rank_dic.hasOwnProperty(currentCollegeInfo[i][0]))) {
            rank_dic[(currentCollegeInfo[i][0])] = {}
            getInstitutions((currentCollegeInfo[i])[0],colleges);
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
    let colleges = [];

    let collegeInfo = await readCSV(subject);
    console.log('Result of readCSV call', collegeInfo);

    let currentCollegeInfo = yearCheck(collegeInfo);
    console.log('Result of yearCheck call', currentCollegeInfo);

    let rank_dic = rankingsInfo(currentCollegeInfo,colleges);
    console.log('Result of rankingsInfo call', rank_dic);

    let counts = avgCount(rank_dic);
    console.log('Result of avgCount call', counts);

    let final = ranks(counts,colleges);
    console.log('Result of ranks call', final);

    return final;
}

export default rankings;