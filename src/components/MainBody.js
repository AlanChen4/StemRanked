import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './MainBody.css';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';

function MainBody(props) {
  const [ranks, setRanks] = useState({});
  const [authorRanks, setAuthorRanks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      console.log(props.subject);
      console.log(props.subjectAreas);
      const [result, authorRankings] = await rankings(props.subject, props.subjectAreas, 1970, 2020);
      console.log('Current contents of subAreas:', props.subjectAreas);
      console.log('Current Start Year', 1970);
      setRanks(result);
      setAuthorRanks(authorRankings);
      //setLoadingDataStatus(false);


    };
    fetchData(props.subject);
  }, [props.subject, props.temporary]);

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