import React from 'react';
import { Image, Navbar, Nav } from 'react-bootstrap';
import { subjectList } from './constants';
import './About.css';

function About() {
  return (
    <div className="Main">
      <Navbar className="NavBar" expand="xl" variant="dark">
        <Navbar.Brand>
          <Image className="Logo" src="./images/logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {subjectList.map((subject) => <Nav.Link title={'View rankings for ' + subject} href={"/" + subject.replace(' ', '_')} className="SubjectLink" key={subject}>{subject}</Nav.Link>)}
          </Nav>
          <Nav className="RightSideNavLinks">
            <Nav.Link className="AboutLink"><span title="About STEM Ranked" className="SubjectLinkActive">About</span></Nav.Link>
            <a title="View our GitHub page" href="https://github.com/AlanChen4/StemRanked" target="_blank" rel="noopener noreferrer" >
              <Image className="GitHubLogoIcon" src="./images/github-logo.png" />
            </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <p>Picture of Oum Lahade</p>
      <p>Oum Lahade's Bio</p>
      <br />
      <p>Picture of Namh Lahade</p>
      <p>Namh Lahade's Bio</p>
      <br />
      <p>Picture of Alan Chen</p>
      <p>Alan Chen's Bio</p>
      <br />
      <p>Picture of Neel Runton</p>
      <p>Neel Runton's Bio</p>
    </div>
  );
}

export default About;