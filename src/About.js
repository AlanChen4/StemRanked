import React from 'react';
import { Image, Navbar, Nav, Row, Col } from 'react-bootstrap';
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
      <h1 className="title ">About Us</h1>
      <Row className="center">
        <Col>
          <a href="https://www.linkedin.com/in/namh-lahade-015b33177/" className="center"><Image className="images" src="./images/namh.png" /></a>
          <h4 className="center2">Namh Lahade</h4>
          <h6 className="center2">Namh attends Duke University and is currently majoring in Electrical & Computer Engineering and Economics.</h6>
        </Col>
        <Col>
          <a href="https://www.linkedin.com/in/oum-lahade-920b30177/" className="center"><Image className="images" src="./images/oum2.png" /></a>
          <h4 className="center2">Oum Lahade</h4>
          <h6 className="center2">Oum attends Duke University and is currently majoring in Electrical & Computer Engineering and Economics.</h6>
        </Col>
        <Col>
          <a href="https://www.instagram.com/neel_runton/" className="center"><Image className="images" src="./images/neel3.png" /></a>
          <h4 className="center2">Neel Runton</h4>
          <h6 className="center2">Neel attends Duke University and is majoring in Electrical & Computer Engineering and Computer Science. At STEM Ranked, he primarily does front-end design and development. In his freetime, he enjoys playing sports like basketball and football.</h6>
        </Col>
        <Col>
          <a href="https://www.linkedin.com/in/alan-chen-aa8994191/" className="center"><Image className="images" src="./images/alan.jpg" /></a>
          <h4 className="center2">Alan Chen</h4>
          <h6 className="center2">Alan attends Duke University and is majoring in Computer Science and Economics.</h6>
        </Col>
      </Row>

      <h1 className="title">The Rankings</h1>
      <h6 className="center"></h6>
    </div>
  );
}

export default About;