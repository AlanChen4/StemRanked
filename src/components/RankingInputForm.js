import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import { subjectAreaInfo } from '../constants';
import './RankingInputForm.css';
import { Accordion, Button, Card, Spinner, ToggleButton, ToggleButtonGroup, Form, Dropdown } from 'react-bootstrap';

function RankingInputForm() {
  const [selectedSubject, setSelectedSubject] = useState('test');
  const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const [ranks, setRanks] = useState({});
  const [authorRanks, setAuthorRanks] = useState({});
  const [subAreas, setSubAreas] = useState([]);
  const [startyear, setStartYear] = useState([]);
  // Wait for CSV parsing and rankings function to finish (runs on every render)
  useEffect(() => {
    const fetchData = async (subject) => {
      const [result, authorRankings] = await rankings(subject, subAreas, startyear, 2020);
      console.log('Current contents of subAreas:', subAreas);
      console.log('Current Start Year', startyear);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
    };
    fetchData(selectedSubject);
  }, [selectedSubject, subAreas, startyear]); // eslint-disable-line

  const onSubjectChange = (event) => {
    setSelectedSubject(event.currentTarget.value);
    setLoadingDataStatus(true);
  }
  function yearBlank(startYr) {
    if (selectedSubject === 'Emery Computer Science') {
      setStartYear(startYr);
    }
    else {
      startYr = 2005;
    }
    const updateRankings = async () => {
      setLoadingDataStatus(true);
      const [result, authorRankings] = await rankings('Emery Computer Science', subAreas, startyear, 2020);
      console.log('Current start year:', startyear);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
    }
    updateRankings();
  }

  function addBlank(subjectArea) {
    if (selectedSubject === 'Emery Computer Science') {
      let temp = subAreas;
      let index = temp.indexOf(subjectArea);
      if (index > -1) {
        temp.splice(index, 1);
        setSubAreas(temp);
      }
      else {
        temp.push(subjectArea);
        setSubAreas(temp);
      }
      const updateRankings = async () => {
        setLoadingDataStatus(true);
        const [result, authorRankings] = await rankings('Emery Computer Science', subAreas, startyear, 2020);
        console.log('Current contents of subAreas:', subAreas);
        setRanks(result);
        setAuthorRanks(authorRankings);
        setLoadingDataStatus(false);
      }
      updateRankings();
      //rankings('Emery Computer Science', subAreas, 2005, 2010);

    }
  }

  let startYears = [];
  for (let i = 1970; i < 2020; i++) {
    startYears.push(i);
  }

  return (
    <div className="Wrapper">
      <div className="Input">
        Subject:
      </div>
      <div className="Rankings">
        <ToggleButtonGroup type="radio" name='subjects' defaultValue={selectedSubject}>
          <ToggleButton value="test" onChange={onSubjectChange}>
            test
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Emery Computer Science" onChange={onSubjectChange}>
            Emery Computer Science
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Life Sciences" onChange={onSubjectChange}>
            Life Sciences
          </ToggleButton>
        </ToggleButtonGroup>
        <Form>
          <Form.Group>
            {subjectAreaInfo[selectedSubject].map((subArea) => <Form.Check key={subArea[0]} type="checkbox" label={subArea[0]} onClick={() => addBlank(subArea[1])} />)}
          </Form.Group>
        </Form>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">Start Year: {startyear}</Dropdown.Toggle>
          <Dropdown.Menu>
            {startYears.map((startyear) => <Dropdown.Item key={startyear} onClick={() => yearBlank(startyear)}>{startyear}</Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
        <br />
        Ranked List for {selectedSubject}:
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Institution</th>
            </tr>
          </thead>
          {loadingDataStatus ? <tbody><tr><td>Loading Data...<br /><Spinner animation="border" variant="primary" /></td></tr></tbody> : <RankedSchoolList data={ranks} authors={authorRanks} />}
        </table>
      </div>
    </div>
  );
}

function RankedSchoolList(props) {
  let school_ranks = [];
  for (const [key, value] of Object.entries(props.data)) { // eslint-disable-line
    school_ranks.push(key);
  }

  return (
    <tbody>
      {school_ranks.map((school, i) => <tr key={school} ><td>{i + 1}</td><td><SchoolAuthorRanks school={school} authors={props.authors} /></td></tr>)}
    </tbody>
  );
}

function SchoolAuthorRanks(props) {
  const author_ranks = props.authors[props.school];

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle className="Accordion" as={Button} variant="link" eventKey="0">
          <Card.Header className="Accordion">
            {props.school}
          </Card.Header>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="Accordion">
            {author_ranks === undefined ? <div>Loading Data...<br /><Spinner animation="border" variant="primary" /></div> : <ol>{author_ranks.map((author, i) => <li key={i}>{author}</li>)}</ol>}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default RankingInputForm;