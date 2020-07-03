import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';


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
    setSelectedSubject(event.target.value);
    setLoadingDataStatus(true);
  }

  return (
    <div className="Wrapper">
      <form className="Input">
        Subject:
        <br />
        <label>
          <input
            type="radio"
            value="test"
            checked={selectedSubject === "test"}
            onChange={onSubjectChange}
          />
          test
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="Emery Computer Science"
            checked={selectedSubject === "Emery Computer Science"}
            onChange={onSubjectChange}
          />
          Emery Computer Science
        </label>
      </form>
      <div className="Rankings">
        Ranked List for {selectedSubject}:
        {loadingDataStatus ? <p>Loading Data...</p> : <RankedSchoolList data={ranks} />}
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
    <ol>
      {school_ranks.map(school => <li key={school}>{school}</li>)}
    </ol>
  );
}

export default RankingInputForm;