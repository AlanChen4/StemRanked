import React from 'react';
import { useState, useEffect } from 'react';
import rankings from '../util/dataRanker';
import './RankingInputForm.css';


function RankingInputForm() {
    const [selectedSubject, setSelectedSubject] = useState('test');
  
    const onSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    }
  
    return(
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
          <RankedSchoolList subject={selectedSubject} />
        </div>
      </div>
    );
  }
  
function RankedSchoolList(props) {
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
        if (value !== undefined) { // temporary if statement to catch bugged rankings TODO: figure out why some ranking values become undefined
          school_ranks.push(key);
        }
    }
  
    return (
      <ol>
        {school_ranks.map(school => <li key={school}>{school}</li>)}
      </ol>
    );
}

export default RankingInputForm;