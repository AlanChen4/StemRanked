import re
'''
purpose of this file is to contain dictionaries of all conferences and publications that we will including in our rankings 
structure = {subject; area; conference_acronyms; conference_name} (https://www.scimagojr.com/journalrank.php?area=2200&category=2210 wieghting off SJR 
(their ranking system)) (cs conferences from http://www.guide2research.com/topconf/ which are based off h5 index) 
'''

#problem, not all of them are registered the same in google scholar for the same conference

venue_dictionary = {
    'Computer Science': { 
        'Artificial Intelligence': {'AAAI': 'AAAI Conference on Artificial Intelligence', 'IJCAI':'International Joint Conference on Artificial Intelligence'},
        'Computer Vision': {'CVPR': 'Computer Vision and Pattern Recognition', 'ECCV': 'European Conference on Computer Vision', 'ICCV': 'International Conference on Computer Vision'},
        'Machine Learning & Data Mining' : {'ICML': 'International Conference on Machine Learning', 'KDD': 'Knowledge Discovery and Data Mining', 'NeurIPS': 'Neural Information Processing Systems'},
        'Natural Language Processing' : {'ACL': 'Meeting of the Association for Computational Linguistics', 'EMNLP': 'Empirical Methods in Natural Language Processing', 'NAACL': 'North American Chapter of the Association for Computational Linguistics'},
        'The Web and Information': {'SIGIR': 'International ACM SIGIR Conference on Research and Development in Information Retrieval', 'WWW': 'The Web Conference'},
        'Computer Architecture' : {'ASPLOS': 'Architectural Support for Programming Languages and Operating Systems', 'ISCA': 'International Symposium on Computer Architecture', 'MICRO': 'International Symposium on Microarchitecture', 'HPCA': 'High-Performance Computer Architecture'},
        'Computer Networks' : {'SIGCOMM': 'ACM Special Interest Group on Data Communication', 'NSDI': 'Networked Systems Design and Implementation'},
        'Computer Security' : {'CCS': 'Computer and Communications Security', 'S&P': 'IEEE Symposium on Security and Privacy', 'USENIX': 'USENIX Security Symposium','NDSS': 'Network and Distributed System Security Symposium'},
        'Databases': {'SIGMOD': 'International Conference on Management of Data', 'VLDB': 'Very Large Data Bases', 'ICDE': 'International Conference on Data Engineering', 'PODS': 'Symposium on Principles of Database Systems'},
        'Design Automation': {'DAC': 'Design Automation Conference', 'ICCAD': 'International Conference on Computer Aided Design'},
        'Embedded and Real-Time Systems':{'EMSOFT': 'Embedded Software', 'RTAS': 'Real Time Technology and Applications Symposium', 'RTSS': 'Real-Time Systems Symposium'},
        'High Performance Computing': {'HPDC': 'High Performance Distributed Computing', 'ICS': 'International Conference on Supercomputing'},
        'Mobile Computing': {'MOBICOM': 'ACM/IEEE International Conference on Mobile Computing and Networking', 'MobiSys': 'International Conference on Mobile Systems, Applications, and Services', 'SenSys': 'International Conference on Embedded Networked Sensor Systems'},
        'Measurement and Performance Analysis': {'IMC': 'Internet Measurement Conference', 'SIGMETRICS': 'Measurement and Modeling of Computer Systems'},
        'Operating Systems' : {'OSDI': 'Operating Systems Design and Implementation', 'SOSP': 'Symposium on Operating Systems Principles', 'EuroSys': 'European Conference on Computer Systems'},
        'Programming Languages': {'PLDI': 'Programming Language Design and Implementation', 'POPL': 'Symposium on Principles of Programming Languages', 'ICFP': 'International Conference on Functional Programming', 'OOPSLA': 'Conference on Object-Oriented Programming Systems, Languages, and Applications'},
        'Software Engineering': {'FSE': 'Foundations of Software Engineering', 'ICSE': 'International Conference on Software Engineering', 'ISSTA': 'International Symposium on Software Testing and Analysis'},
        'Algorithms & Complexity': {'FOCS': 'Foundations of Computer Science', 'SODA': 'Symposium on Discrete Algorithms', 'STOC': 'Symposium on the Theory of Computing', 'CRYPTO': 'International Cryptology Conference', 'EUROCRYPT': 'Theory and Application of Cryptographic Techniques'},
        'Logic and Verification': {'CAV': 'Computer Aided Verification', 'LICS': 'Logic in Computer Science'},
        'Comp. bio & bioinformatics': {'ISMB': 'Intelligent Systems in Molecular Biology', 'RECOMB': 'Research in Computational Molecular Biology'},
        'Computer Graphics':{'SIGGRAPH': 'International Conference on Computer Graphics and Interactive Techniques', 'SIGGRAPH Asia': 'SIGGRAPH Conference and Exhibition on Computer Graphics and Interactive Techniques in Asia'},
        'Human-Computer Interaction':{'CHI': 'Human Factors in Computing Systems','UbiComp':'Ubiquitous Computing','UIST': 'User Interface Software and Technology'},
        'Robotics': {'ICRA': 'International Conference on Robotics and Automation', 'IROS': 'Intelligent Robots and Systems', 'RSS': 'Robotics: Science and Systems'},
        'Visualization':{'VIS':'IEEE Transactions on Visualization and Computer Graphics'}

    },

    'Life Sciences' : {
        'Biochemistry':None,
        'Biophysics':None,
        'Biotechnology':None,
        'Cancer Research':None,
        'Cell Biology':None, #blood here not in biochemistry (bioinformatics there instead)
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
        'Algebra and Number Theory': {'Journal of Differential Geometry':'Journal of Differential Geometry','Compositio Mathematica':'Compositio Mathematica','Forum of Mathematics, Pi':'Forum of Mathematics, Pi'},
        'Analysis': {"Annales de l'Institut Henri Poincaré C, Analyse non linéaire":"Annales de l'Institut Henri Poincaré C, Analyse non linéaire", "Geometric and Functional Analysis":"Geometric and Functional Analysis","Archive for Rational Mechanics and Analysis":"Archive for Rational Mechanics and Analysis"},
        'Applied Mathematics':{'Journal of the American Mathematical Society':'Journal of the American Mathematical Society',"IEEE Transactions on Pattern Analysis and Machine Intelligence":"IEEE Transactions on Pattern Analysis and Machine Intelligence", "Communications on Pure and Applied Mathematics":"Communications on Pure and Applied Mathematics"},
        'Computational Mathematics':{"Journal of Computational Physics":"Journal of Computational Physics","Journal of Computational Chemistry":"Journal of Computational Chemistry"},
        'Geometry and Topology': {"Geometry & Topology":"Geometry & Topology","Geometric and Functional Analysis":"Geometric and Functional Analysis", "Journal of Topology":"arXiv: Geometric Topology"},
        'Numerical Analysis': {"Acta Numerica":"Acta Numerica","R Journal":"R Journal","Analysis & PDE":"Analysis & PDE"},
        'Statistics and Probability': {"Journal of Statistical Software":"Journal of Statistical Software", "Journal of Machine Learning Research":"Journal of Machine Learning Research","Journal of the American Statistical Association":"Journal of the American Statistical Association", "Annals of Mathematics":"Annals of Mathematics", "Annals of Statistics":"Annals of Statistics", "Annals of Probability":"Annals of Probability"}, #statistics has more because we intitially categorized it an individual subject
        'Discrete Mathematics and Combinatorics': {"Combinatorica":"Combinatorica","Journal of Combinatorial Theory, Series B":"Journal of Combinatorial Theory, Series B","Journal of Combinatorial Theory, Series A":"Journal of Combinatorial Theory, Series A","IEEE Transactions on Information Theory":"IEEE Transactions on Information Theory"}

    },

    'Physics': {
        'Astronomy and Astrophysics': None,
        'Atomic and Molecular Physics, and Optics': None,
        'Condensed Matter Physics': None,
        'Nuclear and High Energy Physics': None,
        'Surfaces and Interfaces': None
    }
}


def check(venue,  subject, completion = 1): 
    nonKeywords = ['of','on','and','the','for','in']
    #print(venue)
    try:
        re.sub(r",", "", venue)
    except:
        return False
    ven = venue.lower(); ven = ven.strip(); ven = f" {ven} " #ensure that every string starts and ends with one whitespace
    #for subject in venue_dictionary:
    for area in venue_dictionary[subject]:
        try:
            for acronym in list(venue_dictionary[subject][area].keys()):
                count = 0
                acr = acronym.lower(); acr = acr.strip()
                if (ven.find(f" {acr} ") != -1 or ven.find(f" ({acr}) ") != -1):
                    if (completion == 1):
                        return acronym
                    return True
                keywords = list(venue_dictionary[subject][area][acronym].split(' '))
                for word in keywords:
                    if (word in nonKeywords):
                        keywords.remove(word)
                for word in keywords:
                    word = word.lower(); word = word.strip(); word = f" {word} "
                    if (ven.find(word) != -1):
                        count+=1
                if (count>=round(len(keywords)*completion)):
                    if (completion == 1):
                        return acronym
                    return True
        except:
            pass
    return False
    
def findSubject(venue):
    for subject in venue_dictionary:
        for area in venue_dictionary[subject]:
            try:
                if (venue in list(venue_dictionary[subject][area].keys())):
                    return subject
            except:
                pass
    return False


