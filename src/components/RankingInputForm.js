import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

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
/*
<ToggleButtonGroup type="radio" name="subjects" defaultValue={selectedSubject}>
        <ToggleButton value="test" onChange={(event) => onSubjectChange(event.currentTarget.value)}>test</ToggleButton>
        <ToggleButton value="Emery Computer Science" onChange={(event) => onSubjectChange(event.currentTarget.value)}>Emery Computer Science</ToggleButton>
        <ToggleButton value="Life Sciences" onChange={(event) => onSubjectChange(event.currentTarget.value)}>Life Sciences</ToggleButton>
      </ToggleButtonGroup>
*/

function RankedSchoolList(props) {
  let school_ranks = [];
  for (const [key, value] of Object.entries(props.data)) { // eslint-disable-line
    school_ranks.push(key);
  }

  return (
    <tbody>
      {school_ranks.map(school => <tr key={school}><td>{school}</td></tr>)}
    </tbody>
  );
}

export default RankingInputForm;