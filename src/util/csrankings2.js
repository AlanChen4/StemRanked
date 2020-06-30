/*function rankingsInfo(currentCollegeInfo) {
    let rank_dic = [];
    for (let i = 0; i < collegeInfo.length; i++) {
        for (let j = 0; j < rank_dic.length; j++) {
            if (rank_dic[j][0] != currentCollegeInfo[i][0]) {

            }
        }
    }
} */

function yearCheck(collegeInfo) {
    let i = 0;
    let count = 0;
    while (i < collegeInfo.length) {
        if (collegeInfo[i][4] < 2010) {
            collegeInfo.splice(i, 1);
            i--;
        }
        i++;
    }
    return collegeInfo;
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