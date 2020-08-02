import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import About from './About';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <Redirect to="/Computer_Science" />
      </Route>
      <Route exact path="/Computer_Science" render={() => { return <App subject="Computer Science" /> }} />
      <Route exact path="/Life_Sciences" render={() => { return <App subject="Life Sciences" /> }} />
      <Route exact path="/Chemistry" render={() => { return <App subject="Chemistry" /> }} />
      <Route exact path="/Engineering" render={() => { return <App subject="Engineering" /> }} />
      <Route exact path="/Mathematics" render={() => { return <App subject="Mathematics" /> }} />
      <Route exact path="/Physics" render={() => { return <App subject="Physics" /> }} />
      <Route exact path="/About" render={() => { return <About /> }} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
