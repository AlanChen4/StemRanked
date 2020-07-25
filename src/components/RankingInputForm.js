import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import { subjectAreaInfo } from '../constants';
import './RankingInputForm.css';
import { Accordion, Button, Card, Spinner, ToggleButton, ToggleButtonGroup, Form, DropdownButton } from 'react-bootstrap';
import { areaDictionary } from '../util/constants';

function RankingInputForm() {
  const [selectedSubject, setSelectedSubject] = useState('Emery Computer Science');
  const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const [ranks, setRanks] = useState({});
  const [authorRanks, setAuthorRanks] = useState({});
  let [subAreas, setSubAreas] = useState(Object.keys(areaDictionary['Emery Computer Science']));
  const [startyear, setStartYear] = useState(1970);
  const [authCounts, setAuthCounts] = useState({});
  // Wait for CSV parsing and rankings function to finish (runs on every render)
  useEffect(() => {
    const fetchData = async (subject) => {
      const [result, authorRankings, authorCounts] = await rankings(subject, subAreas, startyear, 2020);
      console.log('Current contents of subAreas:', subAreas);
      console.log('Current Start Year', startyear);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
      setAuthCounts(authorCounts);


    };
    fetchData(selectedSubject);
  }, [selectedSubject, subAreas, startyear]); // eslint-disable-line

  const onSubjectChange = (event) => {
    setSubAreas(Object.keys(areaDictionary[event.currentTarget.value]));
    setSelectedSubject(event.currentTarget.value);
    console.log('Subject selected', event.currentTarget.value);
    setLoadingDataStatus(true);
  }
  function yearBlank(startYr) {
    setStartYear(startYr);
    const updateRankings = async () => {
      setLoadingDataStatus(true);
      const [result, authorRankings] = await rankings(selectedSubject, subAreas, startyear, 2020);
      console.log('Current start year:', startyear);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
    }
    updateRankings();
  }

  function addBlank(subjectArea) {
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
      const [result, authorRankings] = await rankings(selectedSubject, subAreas, startyear, 2020);
      console.log('Current contents of subAreas:', subAreas);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
    }
    updateRankings();
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
          <ToggleButton value="Chemistry" onChange={onSubjectChange}>
            Chemistry
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Engineering" onChange={onSubjectChange}>
            Engineering
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Mathematics" onChange={onSubjectChange}>
            Mathematics
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Computer Science" onChange={onSubjectChange}>
            Computer Science
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Physics" onChange={onSubjectChange}>
            Physics
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Life Sciences" onChange={onSubjectChange}>
            Life Sciences
          </ToggleButton>
          &nbsp;
          <ToggleButton value="Statistics" onChange={onSubjectChange}>
            Statistics
          </ToggleButton>
        </ToggleButtonGroup>
        <DropdownButton id="dropdown-basic-button" title={selectedSubject}>
          {subjectAreaInfo[selectedSubject].map((subArea) => <label class="container"><input defaultChecked type="checkbox" onChange={() => addBlank(subArea[1])} /><span class="checkmark"></span> {subArea[0]}</label>)}
        </DropdownButton>
        <p>The total number of subareas are {(Object.keys(areaDictionary[selectedSubject])).length}</p>
        <p>The number of subareas clicked is {subAreas.length}</p>
        <br />
        Ranked List for {selectedSubject}:
        <div className = "scrollBar">
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