import React from 'react';
import './App.css';
import InputForm from './InputForm';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <InputForm />
      </header>
    </div>
  );
}

<<<<<<< HEAD
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

=======
>>>>>>> ef78ca828b0c24585fac6f6901c095b7d8ccd54f
export default App;
