import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import './MainBody.css';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import LoadingSpinner from './LoadingSpinner';
import AuthorRankings from './AuthorRankings';

function MainBody(props) {
  const [ranks, setRanks] = useState([]);
  const [authorRanks, setAuthorRanks] = useState({});
  const [loadingDataStatus, setLoadingDataStatus] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [startYear, setStartYear] = useState(1970);
  const [temp2, setTemp2] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDataStatus(true);
      setSelectedSchool('loading');
      console.log(props.subject);
      console.log(props.subjectAreas);
      const [result, authorRankings] = await rankings(props.subject, props.subjectAreas, startYear, 2020);
      let school_ranks = [];
      for (const [key, value] of Object.entries(result)) { // eslint-disable-line
        school_ranks.push(key);
      }
      console.log('Current contents of subAreas:', props.subjectAreas);
      console.log('Current Start Year', 1970);
      setRanks(school_ranks);
      setAuthorRanks(authorRankings);
      setSelectedSchool(null);
      setLoadingDataStatus(false);

    };
    fetchData(props.subject);
  }, [props.subject, props.temporary, temp2]);

  function yearBlank(startYr) {
    setStartYear(startYr);
    setTemp2(startYr);
  }

  let startYears = [];
  for (let i = 1970; i < 2020; i++) {
    startYears.push(i);
  }


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
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">Start Year</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {startYears.map((startyear) => <Dropdown.Item onClick={() => yearBlank(startyear)}>{startyear}</Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
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
                <Row className="TableHeaders">
                  <Col>
                    Rank
                  </Col>
                  <Col>
                    Institution
                  </Col>
                  <Col>
                    {/* empty column for spacing ---- NOT SURE IF WE NEED THIS */}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {loadingDataStatus ? <LoadingSpinner /> :
                      ranks.map((school, i) => <a onClick={() => setSelectedSchool(school)} key={school}><Row className={selectedSchool === school ? "InstitutionSelected" : "Institution"}><Col>{i + 1}</Col><Col>{school}</Col><Col className="Arrow">{selectedSchool === school ? '>' : ''}</Col></Row></a>)
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className="AuthorRanks">
            <AuthorRankings school={selectedSchool} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default MainBody;