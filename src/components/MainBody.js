import React from 'react';
import { Row, Col, Dropdown, ButtonGroup } from 'react-bootstrap';
import './MainBody.css';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import LoadingSpinner from './LoadingSpinner';
import AuthorRankings from './AuthorRankings';
import { areaDictionary } from '../util/constants';

function MainBody(props) {
  const [ranks, setRanks] = useState([]);
  const [authorRanks, setAuthorRanks] = useState({});
  const [loadingDataStatus, setLoadingDataStatus] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [startYear, setStartYear] = useState(1970);
  const [authCount, setAuthCount] = useState({});
  const [temp2, setTemp2] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDataStatus(true);
      setSelectedSchool('loading');
      console.log(props.subject);
      console.log(props.subjectAreas);
      const [result, authorRankings, authorCount] = await rankings(props.subject, props.subjectAreas, startYear, 2020);
      console.log('fjewoifjewoifjewoifwjeofweij', authorRankings);
      let school_ranks = [];
      for (const [key, value] of Object.entries(result)) { // eslint-disable-line
        school_ranks.push(key);
      }
      console.log('Current contents of subAreas:', props.subjectAreas);
      console.log('Current Start Year', startYear);
      setRanks(school_ranks);
      setAuthorRanks(authorRankings);
      setSelectedSchool(null);
      setLoadingDataStatus(false);
      setAuthCount(authorCount);

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
        <Row className="Rankings">
          <Col>
            <Row>
              <Col className="YearSelect">
                <Row>
                  <Col>
                    Publications from
                  </Col>
                </Row>
                <Row className="BottomLine">
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle className="YearDropdown">{startYear}</Dropdown.Toggle>
                    <Dropdown.Menu className="DropdownScrollBar">
                      {startYears.map((startyear) => <Dropdown.Item className={startYear === startyear ? "Active" : "Inactive"} onClick={() => yearBlank(startyear)} active={startYear === startyear}>{startyear}</Dropdown.Item>)}
                    </Dropdown.Menu>
                  </Dropdown>
                  to 2020
                </Row>
              </Col>
              <Col className="SubAreas">
                <Row>
                  <Col>
                    Selected {(props.subjectAreas).length} of
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {(Object.keys(areaDictionary[props.subject])).length} sub-areas
                  </Col>
                </Row>
              </Col>
              <Col>
                {/* empty column for spacing */}
              </Col>
            </Row>
            <Row className="InstitutionRankings">
              <Col>
                <Row className="TableHeaders">
                  <Col xs={3}>
                    Rank
                  </Col>
                  <Col xs={9}>
                    Institution
                  </Col>
                  <Col>
                    {/* empty column for spacing ---- NOT SURE IF WE NEED THIS */}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="DataColumnInstitutions">
                      {loadingDataStatus ? <LoadingSpinner /> :
                        ranks.map((school, i) => <a onClick={() => setSelectedSchool(school)} key={school} title={'Select ' + school + ' to view its details.'}><Row className={selectedSchool === school ? "InstitutionSelected" : "Institution"}><Col xs={3}>{i + 1}</Col><Col xs={8}>{school}</Col><Col className="Arrow">{selectedSchool === school ? '>' : ''}</Col></Row></a>) // eslint-disable-line
                      }
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className="AuthorRanks">
            <div className="dataColumnAuthors">
              <AuthorRankings school={selectedSchool} author={authorRanks} authorCount={authCount} />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default MainBody;