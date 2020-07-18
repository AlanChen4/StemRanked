import React from 'react';
import './App.css';
import RankingInputForm from './components/RankingInputForm';
import { Image, Container, Row, Col } from 'react-bootstrap';

const subjectList = [
  'Computer Science',
  'Life Sciences',
  'Chemistry',
  'Engineering',
  'Mathematics',
  'Physics'
]

function App() {
  return (
    <div>
    <Container fluid>
      <Row className="Main">
        <Col className="Sidebar">
          <Row className="Title">
            <Col>
              <Image className="Title-Logo" src="./logo.png" fluid />
            </Col>
          </Row>
          <Row className="Sidebar-Links">
            <Col>
              <Row className="Main-Link">
                <Col xs={4}>
                  <Image className="Main-Link-Icon" src="./subjects-icon.png" />
                </Col>
                <Col>
                  Subjects
                  {subjectList.map((subject) => <Row className="Subject-Link" key={subject}><Col>{subject}</Col></Row>)}
                </Col>
              </Row>
              <Row className="Main-Link">
                <Col xs={4}>
                  <Image className="Main-Link-Icon" src="./about-icon.png" />
                </Col>
                <Col>
                  About
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="GitHub-Logo">
            <Col>
              GitHub Logo Here
            </Col>
          </Row>
        </Col>
        <Col>
          Main Body Component goes here {/* put main body component here */}
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default App;
