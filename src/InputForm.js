import React from 'react';
import { useState, useEffect } from 'react';
import rankings from './util/dataRanker';

function InputForm() {
    const [selectedSubject, setSelectedSubject] = useState('test');
    const [submittedSubject, setSubmittedSubject] = useState('test');
  
    const onSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    }
    const formSubmit = (event) => {
        event.preventDefault();
        setSubmittedSubject(selectedSubject);
    }
  
    return(
      <div>
        <form onSubmit={formSubmit}>
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
              value="namh"
              checked={selectedSubject === "namh"}
              onChange={onSubjectChange}
            />
            namh
          </label>
          <div>
            Selected subject is: {selectedSubject}
          </div>
          <input type="submit" value="Submit" />
          <div>Submitted subject is: {submittedSubject}</div>
        </form>
        <br />
        <div>
          Ranked List for {submittedSubject}:
        </div>
        <SchoolRankingList subject={submittedSubject} />
      </div>
    );
  }
  
function SchoolRankingList(props) {
    const [ranks, setRanks] = useState({});
    let school_ranks = [];
  
    useEffect(() => {
        const fetchData = async (subject) => {
            const result = await rankings(subject);
            setRanks(result);
        };
        fetchData(props.subject);
    }, [props.subject]); // eslint-disable-line
    
    for (const [key, value] of Object.entries(ranks)) { // eslint-disable-line
        school_ranks.push(key);
    }
  
    return (
      <ol>
        {school_ranks.map(school => <li key={school}>{school}</li>)}
      </ol>
    );
}

export default InputForm;