'''
purpose of this file is to contain dictionaries of all conferences and publications that we will including in our rankings 
structure = {subject; area; conference_acronyms; conference_names} (https://www.scimagojr.com/journalrank.php?area=2200&category=2210 wieghting off SJR 
(their ranking system)) (cs conferences from http://www.guide2research.com/topconf/ which are based off h5 index) 
'''

#problem, not all of them are registered the same in google scholar for the same conference

venue_dictionary = {
    'Computer Science': { 
        'Image Processing and Computer Vision': {'CVPR':'IEEE Conference on Computer Vision and Pattern Recognition', 'NeurIPS': 'Neural Information Processing Systems'}, #look at the name in google scholar
        'Machine Learning, Data Mining, & Artificial Intelligence': None,
        'Computer Network and Communications': None,
        'Human Computer Interaction': None,
        'Software Engineering and Programming Languages': None,
        'Computational Theory and Mathematics': None,
        'Web, Mobile, and Multimedia Technologies': None,
        'Computational Linguistics and Speech Processing': None
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
        'Electrical and Electronics Engineering': None,
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

