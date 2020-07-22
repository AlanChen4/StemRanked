import React from 'react';
import { useState } from 'react';
import './App.css';
import MainBody from './components/MainBody';
import { subjectAreaInfo } from './constants';
import rankings from './util/dataRanker';
import { Image, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';

const subjectList = [
  'Computer Science',
  'Life Sciences',
  'Chemistry',
  'Engineering',
  'Mathematics',
  'Physics'
]

function App() {
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  let [subAreas, setSubAreas] = useState([]);
  //const [ranks, setRanks] = useState({});
  //const [authorRanks, setAuthorRanks] = useState({});
  const [startyear, setStartYear] = useState([]);
  //const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const onSubjectChange = (subject) => {
    setSelectedSubject(subject);
  }

  function addBlank(subjectArea) {
    let temp = subAreas;
    let index = temp.indexOf(subjectArea);
    if (index > -1) {
      temp.splice(index, 1);
      setSubAreas(temp);
    }
    else {
      temp.push(subjectArea);
      setSubAreas(temp);
    }
    const updateRankings = async () => {
      //setLoadingDataStatus(true);
      const [result, authorRankings] = await rankings(selectedSubject, subAreas, startyear, 2020);
      console.log('Current contents of subAreas:', subAreas);
      //setRanks(result);
      //setAuthorRanks(authorRankings);
      //setLoadingDataStatus(false);
    }
    updateRankings();
    //rankings('Emery Computer Science', subAreas, 2005, 2010);
  }

  return (
    <div>
      <Navbar className="NavBar" expand="xl" variant="dark">
        <Navbar.Brand>
          <Image className="Logo" src="./images/logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {subjectList.map((subject) => selectedSubject === subject ?
              <NavDropdown key={subject} title={<span className="SubjectLinkActive">{subject}</span>}>
                <NavDropdown.Header>Sub-Areas</NavDropdown.Header>
                {subjectAreaInfo[selectedSubject].map((subArea) => <label class="container"><input defaultChecked type="checkbox" onChange={() => addBlank(subArea[1])} /><span class="checkmark"></span> {subArea[0]}</label>)}
              </NavDropdown> :
              <Nav.Link className="SubjectLink" key={subject} onClick={() => onSubjectChange(subject)}>{subject}</Nav.Link>)}
          </Nav>
          <Nav className="RightSideNavLinks">
            <Nav.Link className="AboutLink">About</Nav.Link>
            <a href="https://github.com/AlanChen4/StemRanked" target="_blank" rel="noopener noreferrer" >
              <Image className="GitHubLogoIcon" src="./images/github-logo.png" />
            </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MainBody subject={selectedSubject} />
    </div>



  );


}

export default App;