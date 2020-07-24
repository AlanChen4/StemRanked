import React from 'react';
import { useState } from 'react';
import './App.css';
import MainBody from './components/MainBody';
import { subjectAreaInfo } from './constants';
import { Image, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { subjectList } from './constants';
import { areaDictionary } from './util/constants';

function App() {
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  let [subAreas, setSubAreas] = useState(Object.keys(areaDictionary['Computer Science']));
  const [temp, setTemp] = useState(0);
  
  const onSubjectChange = (event) => {
    setSelectedSubject(event);
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
    setTemp(subAreas.length);
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
                {subjectAreaInfo[selectedSubject].map((subArea) => <div className="SubArea" key={subArea[0]}><label className="checkboxes"><input defaultChecked type="checkbox" onChange={() => addBlank(subArea[1])} /><span className="box"></span>{subArea[0]}</label></div>)}
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
      <MainBody subject={selectedSubject} subjectAreas={subAreas} temporary={temp} />
    </div>
  );
}

export default App;