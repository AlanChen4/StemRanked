import readCSV from './dataReader';
import { findAllByRole, findAllByTestId } from '@testing-library/react';

// Object.keys(dictionary).length <-- find the length of the dictionary
// delete dictionary[key] <-- remove elements from a dictionary
//!(rank_dic.hasOwnProperty(currentCollegeInfo[i][1]))

// Dictionary in which the keys are areas and the values are conferences
/*
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

}*/
let areaDict = {
    'Artificial Intelligence': ['AAAI', 'AAAI Conference on Artificial Intelligence', 'IJCAI', 'International Joint Conference on Artificial Intelligence'],
    'Computer Vision': ['CVPR', 'Computer Vision and Pattern Recognition', 'ECCV', 'European Conference on Computer Vision', 'ICCV', 'International Conference on Computer Vision'],
    'Machine Learning & Data Mining': ['ICML', 'International Conference on Machine Learning', 'KDD', 'Knowledge Discovery and Data Mining', 'NeurIPS', 'Neural Information Processing Systems'],
    'Natural Language Processing': ['ACL', 'Meeting of the Association for Computational Linguistics', 'EMNLP', 'Empirical Methods in Natural Language Processing', 'NAACL', 'North American Chapter of the Association for Computational Linguistics'],
    'The Web and Information': ['SIGIR', 'International ACM SIGIR Conference on Research and Development in Information Retrieval', 'WWW', 'The Web Conference'],
    'Computer Architecture': ['ASPLOS', 'Architectural Support for Programming Languages and Operating Systems', 'ISCA', 'International Symposium on Computer Architecture', 'MICRO', 'International Symposium on Microarchitecture', 'HPCA', 'High-Performance Computer Architecture'],
    'Computer Networks': ['SIGCOMM', 'ACM Special Interest Group on Data Communication', 'NSDI', 'Networked Systems Design and Implementation'],
    'Computer Security': ['CCS', 'Computer and Communications Security', 'S&P', 'IEEE Symposium on Security and Privacy', 'USENIX', 'USENIX Security Symposium', 'NDSS', 'Network and Distributed System Security Symposium'],
    'Databases': ['SIGMOD', 'International Conference on Management of Data', 'VLDB', 'Very Large Data Bases', 'ICDE', 'International Conference on Data Engineering', 'PODS', 'Symposium on Principles of Database Systems'],
    'Design Automation': ['DAC', 'Design Automation Conference', 'ICCAD', 'International Conference on Computer Aided Design'],
    'Embedded and Real-Time Systems': ['EMSOFT', 'Embedded Software', 'RTAS', 'Real Time Technology and Applications Symposium', 'RTSS', 'Real-Time Systems Symposium'],
    'High Performance Computing': ['HPDC', 'High Performance Distributed Computing', 'ICS', 'International Conference on Supercomputing'],
    'Mobile Computing': ['MOBICOM', 'ACM/IEEE International Conference on Mobile Computing and Networking', 'MobiSys', 'International Conference on Mobile Systems, Applications, and Services', 'SenSys', 'International Conference on Embedded Networked Sensor Systems'],
    'Measurement and Performance Analysis': ['IMC', 'Internet Measurement Conference', 'SIGMETRICS', 'Measurement and Modeling of Computer Systems'],
    'Operating Systems': ['OSDI', 'Operating Systems Design and Implementation', 'SOSP', 'Symposium on Operating Systems Principles', 'EuroSys', 'European Conference on Computer Systems'],
    'Programming Languages': ['PLDI', 'Programming Language Design and Implementation', 'POPL', 'Symposium on Principles of Programming Languages', 'ICFP', 'International Conference on Functional Programming', 'OOPSLA', 'Conference on Object-Oriented Programming Systems, Languages, and Applications'],
    'Software Engineering': ['FSE', 'Foundations of Software Engineering', 'ICSE', 'International Conference on Software Engineering', 'ISSTA', 'International Symposium on Software Testing and Analysis'],
    'Algorithms & Complexity': ['FOCS', 'Foundations of Computer Science', 'SODA', 'Symposium on Discrete Algorithms', 'STOC', 'Symposium on the Theory of Computing', 'CRYPTO', 'International Cryptology Conference', 'EUROCRYPT', 'Theory and Application of Cryptographic Techniques'],
    'Logic and Verification': ['CAV', 'Computer Aided Verification', 'LICS', 'Logic in Computer Science'],
    'Comp. bio & bioinformatics': ['ISMB', 'Intelligent Systems in Molecular Biology', 'RECOMB', 'Research in Computational Molecular Biology'],
    'Computer Graphics': ['SIGGRAPH', 'International Conference on Computer Graphics and Interactive Techniques', 'SIGGRAPH Asia', 'SIGGRAPH Conference and Exhibition on Computer Graphics and Interactive Techniques in Asia'],
    'Human-Computer Interaction': ['CHI', 'Human Factors in Computing Systems', 'UbiComp', 'Ubiquitous Computing', 'UIST', 'User Interface Software and Technology'],
    'Robotics': ['ICRA', 'International Conference on Robotics and Automation', 'IROS', 'Intelligent Robots and Systems', 'RSS', 'Robotics, Science and Systems'],
    'Visualization': ['VIS', 'IEEE Transactions on Visualization and Computer Graphics']
}

// Returns the final rankings from dictionary that contains the average count and institutions
function ranks(counts, colleges) {
    let averageCount = [];
    let collegeList = [];

    for (let i = 0; i < Object.keys(counts).length; i++) {
        averageCount.push(counts[colleges[i]]);
        collegeList.push(colleges[i]);
    }

    let n = averageCount.length;

    // One by one move boundary of unsorted subarray 
    for (let i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array 
        let max_idx = i;
        for (let j = i + 1; j < n; j++)
            if (averageCount[j] > averageCount[max_idx])
                max_idx = j;

        // Swap the found minimum element with the first 
        // element 
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
    if (subAreas.length === 0) {
        numAreas = 67;
    }
    else {
        for (let i = 0; i < subAreas.length; i++) {
            numAreas += (areaDict[subAreas[i]].length);
        }
    }
    console.log('Number of Areas:', numAreas);
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
        if (!(Object.keys(rank_dic[(currentCollegeInfo[i][0])]).includes((currentCollegeInfo[i][2])))) {
            rank_dic[(currentCollegeInfo[i][0])][(currentCollegeInfo[i][2])] = currentCollegeInfo[i][3];
        }
        else {
            rank_dic[(currentCollegeInfo[i][0])][(currentCollegeInfo[i][2])] += currentCollegeInfo[i][3];
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

    let counts = avgCount(rank_dic, subAreas);
    console.log('Result of avgCount call', counts);

    let final = ranks(counts, colleges);
    console.log('Result of ranks call', final);

    return [final, finalAuthors];
}

export default rankings;