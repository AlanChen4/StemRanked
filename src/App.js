import React from 'react';
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import rankings from './util/dataRanker';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <SchoolRankingList subject="namh" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function SchoolRankingList(props) {
  const [ranks, setRanks] = useState({});
 
  useEffect(() => {
    const fetchData = async (subject) => {
      const result = await rankings(subject);
      setRanks(result);
    };
    fetchData(props.subject);
  }, []); // eslint-disable-line

  let school_ranks = [];
  for (const [key, value] of Object.entries(ranks)) { // eslint-disable-line
    school_ranks.push(key);
  }
  return (
    <ol>
      {school_ranks.map(school => <li key={school}>{school}</li>)}
    </ol>
  );
}

export default App;
