import React from 'react';
import { Row, Col, Dropdown, ButtonGroup, Image } from 'react-bootstrap';
import './MainBody.css';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import LoadingSpinner from './LoadingSpinner';
import AuthorRankings from './AuthorRankings';
import { areaDictionary } from '../util/constants';
import { env } from '../constants';

function MainBody(props) {
  const [ranks, setRanks] = useState([]);
  const [authorRanks, setAuthorRanks] = useState({});
  const [loadingDataStatus, setLoadingDataStatus] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [startYear, setStartYear] = useState(1970);
  const [authorStrongestArea, setAuthorStrongestArea] = useState({});
  const [authorCount, setAuthorCount] = useState({});
  const [everything, setEverything] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDataStatus(true);
      setSelectedSchool('loading');
      if (env) console.log(props.subject);
      if (env) console.log(props.subjectAreas);
      const [result, authorRankings, authorCount, strongestareas, author_rank_dic] = await rankings(props.subject, props.subjectAreas, startYear, 2020);
      if (env) console.log('Current contents of authorRankings:', authorRankings);
      let school_ranks = [];
      for (const [key, value] of Object.entries(result)) { // eslint-disable-line
        school_ranks.push(key);
      }
      if (env) console.log('Current contents of subAreas:', props.subjectAreas);
      if (env) console.log('Current Start Year', startYear);
      setRanks(school_ranks);
      setAuthorRanks(authorRankings);
      setAuthorStrongestArea(strongestareas);
      setSelectedSchool(null);
      setLoadingDataStatus(false);
      setAuthorCount(authorCount);
      setEverything(author_rank_dic);

    };
    fetchData(props.subject);
  }, [props.subject, props.temporary, props.subjectAreas, startYear]);

  let startYears = [];
  for (let i = 1970; i < 2020; i++) {
    startYears.push(i);
  }


  return (
    <Row className="Outside">
      <Col>
        <Row>
          <Col className="SubjectName">
            <span className="RankingColumnAlignment">{props.subject}</span>
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
                    <Dropdown.Toggle className="YearDropdown" title="Edit the starting publication year">{startYear}</Dropdown.Toggle>
                    <Dropdown.Menu className="DropdownScrollBar">
                      {startYears.map((startyear) => 
                        <Dropdown.Item className={startYear === startyear ? "Active" : "Inactive"} onClick={() => setStartYear(startyear)} active={startYear === startyear} key={startyear}>
                          {startyear}
                        </Dropdown.Item>
                      )}
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
                    <span className="RankingColumnAlignment">Rank</span>
                  </Col>
                  <Col xs={9}>
                    <span className="RankingColumnAlignment">Institution</span>
                  </Col>
                  <Col>
                    {/* empty column for spacing ---- NOT SURE IF WE NEED THIS */}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="DataColumnInstitutions">
                      {loadingDataStatus ? <LoadingSpinner /> : ranks.map((school, i) =>
                        // eslint-disable-next-line
                        <a onClick={() => setSelectedSchool(school)} key={school} title={'Select ' + school + ' to view more details'}>
                          <Row className={selectedSchool === school ? "InstitutionSelected" : "Institution"}>
                            <Col xs={3}><span className="RankingColumnAlignment">{i + 1}</span></Col>
                            <Col xs={8}><span className="RankingColumnAlignment">{school}</span></Col>
                            <Col className="ArrowContainer">
                              <Image className={selectedSchool === school ? "Arrow" : "ArrowInactive"} src="./images/arrow.png" />
                            </Col>
                          </Row>
                        </a>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className="AuthorRanks">
            <AuthorRankings school={selectedSchool} author={authorRanks} authorCount={authorCount} strongestSubject={authorStrongestArea} everything={everything} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default MainBody;