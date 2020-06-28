// Object.keys(dictionary).length <-- find the length of the dictionary
// delete dictionary[key] <-- remove elements from a dictionary
//!(rank_dic.hasOwnProperty(currentCollegeInfo[i][1]))

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

let colleges = [];
// rank_dic[colleges[0]] <-- all the areas and it's values in Imperial College London key

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
            if (counts[colleges[x]] == averageCount[j]) {
                final_rank[colleges[x]] = averageCount[j];
            }
        }
    }
    return final_rank;
}

function avgCount(rank_dic, currentCollegeInfo) {

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

function confAreas(conferences) {
    for (let x = 0; x < Object.keys(areaDict).length; x++) {
        if ((areaDict[Object.keys(areaDict)[x]].includes(conferences))) {
            return (Object.keys(areaDict))[x];
        }

    }
    return ("Cannot find area");
}

function getInstitutions(institutions) {
    colleges.push(institutions);

}

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

let collegeInfo = {
    0: ["Abdullah Muzahid", "Imperial College London", "icra", 0.3333333333333333, 2016],
    1: ["Abdullah Muzahid", "Imperial College London", "icra", 0.3333333333333333, 2019],
    2: ["Abdullah Muzahid", "Imperial College London", "iros", 0.3333333333333333, 2019],
    3: ["Abdullah Muzahid", "Imperial College London", "nips", 0.14285714285714285, 2018],
    4: ["Abdullah Muzahid", "Imperial College London", "ubicomp", 0.16666666666666666, 2019],
    5: ["Abdullah Muzahid", "BUET", "chiconf", 0.3333333333333333, 2017],
    6: ["Abdullah Muzahid", "BUET", "ubicomp", 0.125, 2019],
    7: ["Abdullah Muzahid", "Istanbul Technical University", "acl", 0.3333333333333333, 2007],
    8: ["Abdullah Muzahid", "Istanbul Technical University", "acl", 0.3333333333333333, 2019],
    9: ["Abdullah Muzahid", "Cardiff University", "cvpr", 0.3333333333333333, 2009],
    10: ["Abdullah Muzahid", "Cardiff University", "cvpr", 0.3333333333333333, 2011],
    11: ["Abdullah Muzahid", "Cardiff University", "eccv", 0.3333333333333333, 1998],
    12: ["Abdullah Muzahid", "Cardiff University", "icml", 0.3333333333333333, 2019]
};

currentCollegeInfo = yearCheck(collegeInfo);
rank_dic = rankingsInfo(currentCollegeInfo);
counts = avgCount(rank_dic);
//console.log(counts[colleges[1]]);
console.log(ranks(counts));