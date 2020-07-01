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
    'sec': ['ccs', 'oakland', 'usenixsec', 'ndss', 'ieee s&p'],
    'comm': ['sigcomm', 'nsdi'],
    'arch': ['asplos', 'isca', 'micro', 'hpca', 'neurlps'],
    'log': ['cav', 'lics'],
    'act': ['focs', 'stoc', 'soda'],
    'mlmining': ['nips', 'icml', 'ijcai', 'kdd'],
    'compgraph': ['siggraph', 'siggraph-asia'],
    'ir': ['sigir', 'www'],
    'chi': ['chiconf', 'ubicomp', 'uist', 'imwut, pervasive'],
    'nlp': ['emnlp', 'acl', 'naacl'],
    'robotics': ['icra', 'iros', 'rss'],
    'crypt': ['crypto', 'eurocrypt'],
    'bio': ['ismb', 'recomb'],
    'visual': ['vis', 'vr'],
    'ecom': ['ec', 'wine', 'cse']

}

let colleges = [];

function ranks(counts) {
    let averageCount = [];
    for (let i = 0; i < Object.keys(counts).length; i++) {
        averageCount.push(counts[colleges[i]]);
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
    for (let i = 0; i < currentCollegeInfo.length; i++) {
        if (!(rank_dic.hasOwnProperty(currentCollegeInfo[i][0]))) {
            rank_dic[(currentCollegeInfo[i][0])] = {}
            getInstitutions((currentCollegeInfo[i])[0]);
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

function yearCheck(collegeInfo) {
    let currentInfo = [];
    for (let i = 0; i < collegeInfo.length; i++) {
        if (collegeInfo[i][4] >= 2010) {
            currentInfo.push(collegeInfo[i]);
        }
    }
    return currentInfo;
}

let collegeInfo = [
    ["Imperial College London", "Abdullah Muzahid", "icra", 0.3333333333333333, 2016],
    ["Imperial College London", "Abdullah Muzahid", "icra", 0.3333333333333333, 2019],
    ["Imperial College London", "Abdullah Muzahid", "iros", 0.3333333333333333, 2019],
    ["Imperial College London", "Abdullah Muzahid", "nips", 0.14285714285714285, 2018],
    ["Imperial College London", "Abdullah Muzahid", "ubicomp", 0.16666666666666666, 2019],
    ["BUET", "Abdullah Muzahid", "chiconf", 0.3333333333333333, 2017],
    ["BUET", "Abdullah Muzahid", "ubicomp", 0.125, 2019],
    ["Istanbul Technical University", "Abdullah Muzahid", "acl", 0.3333333333333333, 2007],
    ["Istanbul Technical University", "Abdullah Muzahid", "acl", 0.3333333333333333, 2019],
    ["Cardiff University", "Abdullah Muzahid", "cvpr", 0.3333333333333333, 2009],
    ["Cardiff University", "Abdullah Muzahid", "cvpr", 0.3333333333333333, 2011],
    ["Cardiff University", "Abdullah Muzahid", "eccv", 0.3333333333333333, 1998],
    ["Cardiff University", "Abdullah Muzahid", "icml", 0.3333333333333333, 2019]
]

let currentCollegeInfo = yearCheck(collegeInfo);
let rank_dic = rankingsInfo(currentCollegeInfo);
let counts = avgCount(rank_dic);
//console.log(counts);
console.log(ranks(counts));