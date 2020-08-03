import React from 'react';
import { useState } from 'react';
import './App.css';
import MainBody from './components/MainBody';
import { subjectAreaInfo } from './constants';
import { Image, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { subjectList } from './constants';
import { areaDictionary } from './util/constants';

function App(props) {
  const [selectedSubject, setSelectedSubject] = useState(props.subject);
  let [subAreas, setSubAreas] = useState(Object.keys(areaDictionary[props.subject]));
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
    <div className="Main">
      <Navbar className="NavBar" expand="xl" variant="dark">
        <Navbar.Brand>
          <Image className="Logo" src="./images/logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {subjectList.map((subject) => selectedSubject === subject ?
              <NavDropdown href={"/" + subject.replace(' ', '_')} key={subject} title={<span title="Edit the selected sub-areas" className="SubjectLinkActive">{subject}</span>}>
                <NavDropdown.Header>Sub-Areas</NavDropdown.Header>
                {subjectAreaInfo[selectedSubject].map((subArea) => <div className="SubArea" key={subArea[0]}><label className="checkboxes"><input defaultChecked type="checkbox" onChange={() => addBlank(subArea[1])} /><span className="box"></span>{subArea[0]}</label></div>)}
              </NavDropdown> :
              <Nav.Link href={"/" + subject.replace(' ', '_')} title={'View rankings for ' + subject} className="SubjectLink" key={subject} onClick={() => onSubjectChange(subject)}>{subject}</Nav.Link>)}
          </Nav>
          <Nav className="RightSideNavLinks">
            <Nav.Link title="About STEM Ranked" className="AboutLink" href="/About">About</Nav.Link>
            <a title="View our GitHub page" href="https://github.com/AlanChen4/StemRanked" target="_blank" rel="noopener noreferrer" >
              <Image className="GitHubLogoIcon" src="./images/github-logo.png" />
            </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MainBody subject={selectedSubject} subjectAreas={subAreas} temporary={temp} /> :
    </div>
  );
}

export default App;