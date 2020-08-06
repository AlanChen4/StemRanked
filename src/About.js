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
      <Row>
        <Col>
          <h3 className="center"><Image className="images" src="./images/namh.png" /></h3>
          <h4 className="center2">Namh Lahade</h4>
          <h5 className="center2">fwefewoifjewoifjewofi fewjfioewjfoweifj weoi jfjewoifj ewoifjewoifj woifj we  fjewoifj weoifjewoij oif jweoi weoifj </h5>
        </Col>
        <Col>
          <h3 className="center"><Image className="images" src="./images/oum2.png" /></h3>
          <h4 className="center2">Oum Lahade</h4>
          <h5 className="center2">fwefewoifjewoifjewofi fewjfioewjfoweifj weoi jfjewoifj ewoifjewoifj woifj we  fjewoifj weoifjewoij oif jweoi weoifj </h5>
        </Col>
        <Col>
          <h3 className="center"><Image className="images" src="./images/neel3.png" /></h3>
          <h4 className="center2">Neel Runton</h4>
          <h5 className="center2">fwefewoifjewoifjewofi fewjfioewjfoweifj weoi jfjewoifj ewoifjewoifj woifj we  fjewoifj weoifjewoij oif jweoi weoifj </h5>
        </Col>
        <Col>
          <h3 className="center"><Image className="images" src="./images/alan.jpg" /></h3>
          <h4 className="center2">Alan Chen</h4>
          <h5 className="center2">fwefewoifjewoifjewofi fewjfioewjfoweifj weoi jfjewoifj ewoifjewoifj woifj we  fjewoifj weoifjewoij oif jweoi weoifj </h5>
        </Col>
      </Row>
    </div>
  );
}

export default About;