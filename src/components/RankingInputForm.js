import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';
import { Accordion, Button, Card, Spinner, ToggleButton, ToggleButtonGroup, Form } from 'react-bootstrap';

var subAreas = ['vision'];
function RankingInputForm() {
  const [selectedSubject, setSelectedSubject] = useState('test');
  const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const [ranks, setRanks] = useState({});
  const [authorRanks, setAuthorRanks] = useState({});
  // Wait for CSV parsing and rankings function to finish (runs on every render)
  useEffect(() => {
    const fetchData = async (subject) => {
      const [result, authorRankings] = await rankings(subject, subAreas, 2005, 2020);
      console.log('Current contents of subAreas:', subAreas);
      setRanks(result);
      setAuthorRanks(authorRankings);
      setLoadingDataStatus(false);
    };
    fetchData(selectedSubject);
  }, [selectedSubject]); // eslint-disable-line

  const onSubjectChange = (event) => {
    setSelectedSubject(event.currentTarget.value);
    setLoadingDataStatus(true);
  }
  let i = 0;
  function addAI() {
    let index = subAreas.indexOf('ai');
    if (index > -1) {
      subAreas.splice(index, 1);
    }
    else {
      subAreas.push('ai');
    }
    console.log(subAreas);
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
        <Button onClick={addAI}>Add AI</Button>
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