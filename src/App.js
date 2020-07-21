import React from 'react';
import { useState } from 'react';
import './App.css';
import MainBody from './components/MainBody';
import { Image, Navbar, Nav, NavDropdown } from 'react-bootstrap';

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

  const onSubjectChange = (subject) => {
    setSelectedSubject(subject);
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
          {subjectList.map(subject => selectedSubject === subject ?
            <NavDropdown className="SubjectLink" key={subject} title={subject}>
              <NavDropdown.Header>Sub-Areas</NavDropdown.Header>
              <NavDropdown.Item>Action</NavDropdown.Item>
              <NavDropdown.Item>Another action</NavDropdown.Item>
              <NavDropdown.Item>Something</NavDropdown.Item>
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