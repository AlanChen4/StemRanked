import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './MainBody.css';

function MainBody(props) {
  return (
    <Row className="Outside">
      <Col>
        <Row>
          <Col className="SubjectName">
            {props.subject}
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="YearSelect">
              <Col>
                Publication Year Dropdown
              </Col>
              <Col>
                {/* empty column for spacing */}
              </Col>
              <Col>
                {/* empty column for spacing */}
              </Col>
            </Row>
            <Row className="InstitutionRankings">
              <Col>
                Institution Rankings
              </Col>
            </Row>
          </Col>
          <Col className="AuthorRanks">
            College Info/Author Rankings
          </Col>
        </Row>
      </Col>
    </Row>
	);
}

export default MainBody;