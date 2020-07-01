'''
purpose of this file is to contain dictionaries of all conferences and publications that we will including in our rankings 
structure = {subject; area; conference_acronyms; conference keywords (for recognition) #conference_name} (https://www.scimagojr.com/journalrank.php?area=2200&category=2210 wieghting off SJR 
(their ranking system)) (cs conferences from http://www.guide2research.com/topconf/ which are based off h5 index) 
'''

#problem, not all of them are registered the same in google scholar for the same conference

venue_dictionary = {
    'Computer Science': { 
        'Image Processing and Computer Vision': {'CVPR':'IEEE Conference on Computer Vision and Pattern Recognition', 'ICCV':'IEEE International Conference on Computer Vision', 'ECCV': 'European Conference on Computer Vision'}, 
        'Machine Learning, Data Mining, & Artificial Intelligence': {'NeurIPS': 'Neural Information Processing Systems', 'ICML':'International Conference on Machine Learning', 'AAAI': 'AAAI Conference on Artificial Intelligence'},
        'Computer Network and Communications': {'CCS':'ACM Symposium on Computer and Communications Security','INFOCOM':'IEEE International Conference on Computer Communications', 'SIGCOMM':'Special Interest Group on Data Communications'},
        'Human Computer Interaction': {'CHI':'Computer Human Interaction','UIST':'ACM International Conference on Multimedia'},
        'Software Engineering and Programming Languages': {'ICSE':'International Conference on Software Engineering','PLDI':'ACM SIGPLAN Conference on Programming Language Design and Implementation', 'FSE':'ACM SIGSOFT International Symposium on Foundations of Software Engineering'},
        'Computational Theory and Mathematics': {'STOC':'ACM Symposium on Theory of Computing', 'EUROCRYPT':'International Conference on Theory and Applications of Cryptographic Techniques'},
        'Web, Mobile, and Multimedia Technologies': {'WWW':'International World Wide Web Conferences', 'UbiComp':'ACM Conference on Pervasive and Ubiquitous Computing'},
        'Computational Linguistics and Speech Processing': {'ACL':'Meeting of the Association for Computational Linguistics', 'EMNLP':'Conference on Empirical Methods in Natural Language Processing', 'NAACL':'Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies'}
    },

    'Life Sciences' : {
        'Biochemistry':None,
        'Biophysics':None,
        'Biotechnology':None,
        'Cancer Research':None,
        'Cell Biology':None,
        'Developmental Biology': None,
        'Genetics':None,
        'Molecular Biology':None,
        'Molecular Medicine':None,
        'Physiology':None,
        'Microbiology':None

    },

    'Chemistry': {
        'Analytical Chemistry': None,
        'Electrochemistry':None,
        'Inorganic Chemistry':None,
        'Organic Chemistry':None,
        'Physical and Theoretical Chemistry':None,
        'Spectroscopy':None
    },

    'Engineering': {
        'Aerospace Engineering': None,
        'Biomedical Engineering': None,
        'Computational Mechanics': None,
        'Control and Systems Engineering': None,
        'Electrical, Electronics, and Computer Engineering': None,
        'Industrial and Manufacturing Engineering': None,
        'Mechanical Engineering': None,

    },

    'Mathematics': {
        'Algebra and Number Theory': None,
        'Analysis': None,
        'Applied Mathematics':None,
        'Computational Mathematics':None,
        'Geometry and Topology': None,
        'Numerical Analysis': None,
        'Statistics and Probability': None,
        'Discrete Mathematics and Combinatorics': None

    },

    'Physics': {
        'Astronomy and Astrophysics': None,
        'Atomic and Molecular Physics, and Optics': None,
        'Condensed Matter Physics': None,
        'Nuclear and High Energy Physics': None,
        'Surfaces and Interfaces': None
    }
}

print(venue_dictionary)

def check50(): #checks if 50% of keywords are matched
    pass

def check100(): #checks if 100% of keyworks are matched
    pass