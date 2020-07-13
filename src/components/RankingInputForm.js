import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';
import { Accordion, Button, Card, Spinner, ToggleButton, ToggleButtonGroup, Form } from 'react-bootstrap';

function RankingInputForm() {
  const [selectedSubject, setSelectedSubject] = useState('test');
  const [loadingDataStatus, setLoadingDataStatus] = useState(false);
  const [ranks, setRanks] = useState({});
  const [authorRanks, setAuthorRanks] = useState({});
  const [subAreas, setSubAreas] = useState([]);
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
  }, [selectedSubject, subAreas]); // eslint-disable-line

  const onSubjectChange = (event) => {
    setSelectedSubject(event.currentTarget.value);
    setLoadingDataStatus(true);
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
        const [result, authorRankings] = await rankings('Emery Computer Science', subAreas, 2005, 2020);
        console.log('Current contents of subAreas:', subAreas);
        setRanks(result);
        setAuthorRanks(authorRankings);
        setLoadingDataStatus(false);
      }
      updateRankings();
      //rankings('Emery Computer Science', subAreas, 2005, 2010);

    }
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
            <Form.Check type="checkbox" label="Computer Vision" onClick={() => addBlank('vision')} />
            <Form.Check type="checkbox" label="Programming Languages" onClick={() => addBlank('plan')} />
            <Form.Check type="checkbox" label="Software Engineering" onClick={() => addBlank('soft')} />
            <Form.Check type="checkbox" label="Operating Systems" onClick={() => addBlank('ops')} />
            <Form.Check type="checkbox" label="Measurement and perf. analysis" onClick={() => addBlank('vision')} />
            <Form.Check type="checkbox" label="Mobile Computing" onClick={() => addBlank('mobile')} />
            <Form.Check type="checkbox" label="High Performance Computing" onClick={() => addBlank('hpc')} />
            <Form.Check type="checkbox" label="Embeddec and real-time systems" onClick={() => addBlank('bed')} />
            <Form.Check type="checkbox" label="Design Automation" onClick={() => addBlank('da')} />
            <Form.Check type="checkbox" label="Databases" onClick={() => addBlank('mod')} />
            <Form.Check type="checkbox" label="Computer Security" onClick={() => addBlank('sec')} />
            <Form.Check type="checkbox" label="Computer Networks" onClick={() => addBlank('comm')} />
            <Form.Check type="checkbox" label="Computer Architeture" onClick={() => addBlank('arch')} />
            <Form.Check type="checkbox" label="Logic and Verification" onClick={() => addBlank('log')} />
            <Form.Check type="checkbox" label="Algorithms and Complexity" onClick={() => addBlank('act')} />
            <Form.Check type="checkbox" label="Machine Learning and Data Mining" onClick={() => addBlank('mlmining')} />
            <Form.Check type="checkbox" label="Computer Graphics" onClick={() => addBlank('compgraph')} />
            <Form.Check type="checkbox" label="The Web and Information Retrieval" onClick={() => addBlank('ir')} />
            <Form.Check type="checkbox" label="Human Computer Interaction" onClick={() => addBlank('chi')} />
            <Form.Check type="checkbox" label="Natural Language Processing" onClick={() => addBlank('nlp')} />
            <Form.Check type="checkbox" label="Robotics" onClick={() => addBlank('robotics')} />
            <Form.Check type="checkbox" label="Cryptography" onClick={() => addBlank('crypt')} />
            <Form.Check type="checkbox" label="Computer Biology and Bioinformatics" onClick={() => addBlank('bio')} />
            <Form.Check type="checkbox" label="Visualization" onClick={() => addBlank('visual')} />
            <Form.Check type="checkbox" label="Ecomonics and Computation" onClick={() => addBlank('ecom')} />
            <Form.Check type="checkbox" label="Artificial Intelligence" onClick={() => addBlank('ai')} />
          </Form.Group>
        </Form>
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