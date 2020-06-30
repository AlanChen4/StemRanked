import readCSV from './dataReader';

// Object.keys(dictionary).length <-- find the length of the dictionary
// delete dictionary[key] <-- remove elements from a dictionary
//!(rank_dic.hasOwnProperty(currentCollegeInfo[i][1]))

// Dictionary in which the keys are areas and the values are conferences
let areaDict = {
    "vision": ['cvpr', 'iccv', 'eccv'],
    "plan": ['popl', 'pldi', 'oopsla'],
    "soft": ['icse', 'fse', 'icfp'],
    "ops": ['sosp', 'osdi', 'eurosys', 'fast', 'usenixatc'],
    'metrics': ['imc', 'sigmetrics'],
    'mobile': ['mobisys', 'mobicom', 'sensys'],
    'hpc': ['sc', 'hpdc', 'ics'],
    'bed': ['emsoft', 'rtss', 'rtas'],
    'da': ['iccad', 'dac'],
    'mod': ['vldb', 'sigmod', 'icde', 'pods'],
    'sec': ['ccs', 'oakland', 'usenixsec', 'ndss'],
    'comm': ['sigcomm', 'nsdi'],
    'arch': ['asplos', 'isca', 'micro', 'hpca'],
    'log': ['cav', 'lics'],
    'act': ['focs', 'stoc', 'soda'],
    'mlmining': ['nips', 'icml', 'ijcai'],
    'compgraph': ['siggraph', 'siggraph-asia'],
    'ir': ['sigir', 'www'],
    'chi': ['chiconf', 'ubicomp', 'uist'],
    'nlp': ['emnlp', 'acl', 'naacl'],
    'robotics': ['icra', 'iros', 'rss'],
    'crypt': ['crypto', 'eurocrypt'],
    'bio': ['ismb', 'recomb'],
    'visual': ['vis', 'vr'],
    'ecom': ['ec', 'wine', 'cse']

}

// Global array that has the institutions
let colleges = [];
// rank_dic[colleges[0]] <-- all the areas and it's values in Imperial College London key

// Returns the final rankings from dictionary that contains the average count and institutions
function ranks(counts) {
    let averageCount = []
    for (let i = 0; i < Object.keys(counts).length; i++) {
        averageCount.push(counts[colleges[i]])
    }
    averageCount.sort();
    averageCount.reverse();
    let final_rank = {}
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
    return ("Cannot find area");
}

// Adds the institution name to the global array 'colleges
function getInstitutions(institutions) {
    colleges.push(institutions);

}

// Returns a dictionary that has the institution names, areas, and adjusted counts
function rankingsInfo(currentCollegeInfo) {
    let rank_dic = {};
    for (let college in Object.keys(currentCollegeInfo)) {
        if (!(rank_dic.hasOwnProperty(currentCollegeInfo[college][1]))) {
            rank_dic[(currentCollegeInfo[college])[1]] = {};
            getInstitutions((currentCollegeInfo[college])[1]);
        }
        if (!(Object.keys(rank_dic[(currentCollegeInfo[college])[1]]).includes(confAreas(currentCollegeInfo[college][2])))) {
            rank_dic[(currentCollegeInfo[college])[1]][confAreas(currentCollegeInfo[college][2])] = currentCollegeInfo[college][3];
        }
        else {
            rank_dic[(currentCollegeInfo[college])[1]][confAreas(currentCollegeInfo[college][2])] += currentCollegeInfo[college][3];
        }
    }
    return rank_dic
}

// Checks to make sure that each publication isn't before 2010
function yearCheck(collegeInfo) {
    for (let i = 0; i < Object.keys(collegeInfo).length; i++) {
        if ((collegeInfo[i])[4] < 2010) {
            let deletes = i;
            delete collegeInfo[i];
            for (let j = deletes; j < Object.keys(collegeInfo).length; j++) {
                collegeInfo[j] = collegeInfo[j + 1]
                delete collegeInfo[j + 1]
            }
        }
    }
    // Makes the keys go in numerical order again
    return collegeInfo;
}

async function rankings(subject) {

    console.log('Making call to readCSV')
    let collegeInfo = await readCSV(subject);
    console.log('Result of readCSV call', collegeInfo);

    console.log('Making call to yearCheck');
    let currentCollegeInfo = yearCheck(collegeInfo);
    console.log('Result of yearCheck call', currentCollegeInfo);

    console.log('Making call to rankingsInfo');
    let rank_dic = rankingsInfo(currentCollegeInfo);
    console.log('Result of rankingsInfo call', rank_dic);

    console.log('Making call to avgCount');
    let counts = avgCount(rank_dic);
    console.log('Result of avgCount call', counts);

    //console.log(counts[colleges[1]]);

    console.log('Making call to ranks');
    let final = ranks(counts);
    console.log('Result of ranks call', final);

    return final;
}

export default rankings;