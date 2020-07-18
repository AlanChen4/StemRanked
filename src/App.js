import React from 'react';
import './App.css';
import RankingInputForm from './components/RankingInputForm';
import { Container, Row, Col } from 'react-bootstrap';

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
              STEM Ranked
            </Col>
          </Row>
          <Row className="Sidebar-Links">
            <Col>
              <Row className="Main-Links">
                <Col>
                  Subjects
                  {subjectList.map((subject) => <Row className="Subject-Link" key={subject}><Col>{subject}</Col></Row>)}
                </Col>
              </Row>
              <Row className="Main-Links">
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
