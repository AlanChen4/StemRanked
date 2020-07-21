import React from 'react';
import { useState } from 'react';
import './App.css';
import MainBody from './components/MainBody';
import { Image, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

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

  const onSubjectChange = (event) => {
    setSelectedSubject(event.currentTarget.value);
    console.log('Subject selected', event);
  }

  return (

    <Navbar className="NavBar" expand="lg" variant="dark">
      <Navbar.Brand>
        <Image className="Logo" src="./images/logo.png" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <Nav.Link className="SubjectLink">Computer Science</Nav.Link>
          <Nav.Link className="SubjectLink" onClick={onSubjectChange}>Life Sciences</Nav.Link>
          <Nav.Link className="SubjectLink">Chemistry</Nav.Link>
          <Nav.Link className="SubjectLink">Engineering</Nav.Link>
          <Nav.Link className="SubjectLink">Mathematics</Nav.Link>
          <Nav.Link className="SubjectLink">Physics</Nav.Link>
        </Nav>
        <Nav className="RightSideNavLinks">
          <Nav.Link className="AboutLink">About</Nav.Link>
          <a href="https://github.com/AlanChen4/StemRanked" target="_blank" rel="noopener noreferrer" >
            <Image className="GitHubLogoIcon" src="./images/github-logo.png" />
          </a>
        </Nav>
      </Navbar.Collapse>
    </Navbar>



  );
}

export default App;