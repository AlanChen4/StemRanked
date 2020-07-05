import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';
import { Accordion, Button, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

function RankingInputForm() {
  const [selectedSubject, setSelectedSubject] = useState('test');
  const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const [ranks, setRanks] = useState({});

  // Wait for CSV parsing and rankings function to finish (runs on every render)
  useEffect(() => {
    const fetchData = async (subject) => {
      const result = await rankings(subject);
      setRanks(result);
      setLoadingDataStatus(false);
    };
    fetchData(selectedSubject);
  }, [selectedSubject]); // eslint-disable-line

  const onSubjectChange = (event) => {
    setSelectedSubject(event.currentTarget.value);
    setLoadingDataStatus(true);
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
        <br />
        Ranked List for {selectedSubject}:
        <table>
          <thead>
            <tr>
              <th>Institution</th>
            </tr>
          </thead>
          {loadingDataStatus ? <tbody><tr><td>Loading Data...</td></tr></tbody> : <RankedSchoolList data={ranks} />}
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
      {school_ranks.map(school => <tr key={school}><td><SchoolAuthorRanks school={school} /></td></tr>)}
    </tbody>
  );
}

function SchoolAuthorRanks(props) {
  // code to rank authors goes here

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle className="Accordion" as={Button} variant="link" eventKey="0">
          <Card.Header className="Accordion">
            {props.school}
          </Card.Header>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="Accordion">Author Ranks Here</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default RankingInputForm;