import React from 'react';
import { useState } from 'react';
import './App.css';
import RankingInputForm from './components/RankingInputForm';
import { Image, Container, Row, Col, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

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
    console.log('Subject selected', event.currentTarget.value);
  }

  return (
    <Container fluid>
      <Row className="Main">
        <Col className="Sidebar">
          <Row className="Title">
            <Col>
              <Image className="Title-Logo" src="./images/logo.png" fluid />
            </Col>
          </Row>
          <Row className="Sidebar-Links">
            <Col>
              <Row className="Main-Link">
                <Col xs={4}>
                  <Image className="Main-Link-Icon" src="./images/subjects-icon.png" />
                </Col>
                <Col>
                  Subjects
                  <ToggleButtonGroup className="Subject-Link-Container" type="radio" name='subjects' defaultValue={selectedSubject} vertical>
                    {subjectList.map((subject) => <Row className={selectedSubject === subject ? "Subject-Link-Active" : "Subject-Link-Inactive"} as={ToggleButton} variant="custom" value={subject} onChange={onSubjectChange} block><Col>{subject}</Col></Row>)}
                  </ToggleButtonGroup>
                </Col>
              </Row>
              <Row className="Main-Link">
                <Col xs={4}>
                  <Image className="Main-Link-Icon" src="./images/about-icon.png" />
                </Col>
                <Col>
                  About
                </Col>
              </Row>
            </Col>
          </Row>
          <Row >
            <Col className="GitHub-Logo">
              <a href="https://github.com/AlanChen4/StemRanked" target="_blank" rel="noopener noreferrer" ><Image className="GitHub-Logo-Icon" src="./images/github-logo.png" /></a>
            </Col>
          </Row>
        </Col>
        <Col>
          Main Body Component goes here {/* put main body component here */}
        </Col>
      </Row>
    </Container>
  );
}

export default App;