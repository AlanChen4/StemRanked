import React from 'react';
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
        <SchoolRankingList subject="test" />
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

function SchoolRankingList(subject) {
  let ranks = rankings(subject.subject);
  let school_ranks = [];
  // eslint-disable-next-line
  for (const [key, value] of Object.entries(ranks)) {
    school_ranks.push(key);
  }
  return (
    <ol>
      {school_ranks.map(school => <li key={school}>{school}</li>)}
    </ol>
  );
}

export default App;
