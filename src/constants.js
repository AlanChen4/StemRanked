export const subjectAreaInfo = {
    'Computer Science': [
        ['Computer Vision', 'Vision'],
        ['Programming Languages', 'PL'],
        ['Software Engineering', 'SE'],
        ['Operating Systems', 'OS'],
        ['Measurement and Perf. Analysis', 'MPA'],
        ['Mobile Computing', 'Mobile'],
        ['High Performance Computing', 'HPC'],
        ['Embedded and real-time systems', 'Embedded'],
        ['Design Automation', 'DA'],
        ['Databases', 'Databases'],
        ['Computer Security', 'Security'],
        ['Computer Networks', 'Networks'],
        ['Computer Architecture', 'Arch'],
        ['Logic and Verification', 'Logic'],
        ['Algorithms and Complexity', 'Algorithms'],
        ['Machine Learning and Data Mining', 'ML & DM'],
        ['Computer Graphics', 'Graphics'],
        ['The Web and Information Retrieval', 'Web'],
        ['Human Computer Interaction', 'HCI'],
        ['Natural Language Processing', 'NLP'],
        ['Robotics', 'Robotics'],
        ['Computer Biology and Bioinformatics', 'Bio'],
        ['Visualization', 'Visual'],
        ['Artificial Intelligence', 'AI']
    ],
    'Chemistry': [
        ['Analytical Chemistry', 'None'],
        ['Electrochemistry', 'None'],
        ['Inorganic Chemistry', 'None'],
        ['Organic Chemistry', 'None'],
        ['Physical and Theoretical Chemistry', 'None'],
        ['Spectroscopy', 'None']
    ],

    'Engineering': [
        ['Aerospace Engineering', 'None'],
        ['Biomedical Engineering', 'None'],
        ['Computational Mechanics', 'None'],
        ['Control and Systems Engineering', 'None'],
        ['Electrical, Electronics, and Computer Engineering', 'None'],
        ['Industrial and Manufacturing Engineering', 'None'],
        ['Mechanical Engineering', 'None'],

    ],

    'Mathematics': [
        ['Algebra and Number Theory','Algebra and Number Theory'],
        ['Analysis','Analysis'],
        ['Applied Mathematics','Applied Mathematics'],
        ['Computational Mathematics','Computational Mathematics'],
        ['Geometry and Topology','Geometry and Topology'],
        ['Numerical Analysis','Numerical Analysis'],
        ['Statistics and Probability','Statistics and Probability'],
        ['Discrete Mathematics and Combinatorics','Discrete Mathematics and Combinatorics'],
    ],

    'Physics': [
        ['Astronomy and Astrophysics', 'Astronomy and Astrophysics'],
        ['Atomic and Molecular Physics', 'Atomic and Molecular Physics'],
        ['Condensed Matter Physics', 'Condensed Matter Physics'],
        ['Nuclear and High Energy Physics', 'Nuclear and High Energy Physics'],
        ['Surfaces and Interfaces', 'Surfaces and Interfaces']
        ['Optics', 'Optics']
    ],

    'Life Sciences': [
        ['Biochemistry', 'None'],
        ['Biophysics', 'None'],
        ['Biotechnology', 'None'],
        ['Cancer Research', 'None'],
        ['Cell Biology', 'None'],
        ['Developmental Biology', 'None'],
        ['Genetics', 'None'],
        ['Molecular Biology', 'None'],
        ['Molecular Medicine', 'None'],
        ['Physiology', 'None'],
        ['Microbiology', 'None']
    ],

    'Statistics': []
};

export const subjectList = [
    'Computer Science',
    'Life Sciences',
    'Chemistry',
    'Engineering',
    'Mathematics',
    'Physics',
    'Statistics'
]

export const env = process.env.NODE_ENV === 'development';