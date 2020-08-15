import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import About from './About';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/Computer_Science" />
        </Route>
        <Route path="/Computer_Science" render={() => { return <App subject="Computer Science" /> }} />
        <Route path="/Life_Sciences" render={() => { return <App subject="Life Sciences" /> }} />
        <Route path="/Chemistry" render={() => { return <App subject="Chemistry" /> }} />
        <Route path="/Engineering" render={() => { return <App subject="Engineering" /> }} />
        <Route path="/Mathematics" render={() => { return <App subject="Mathematics" /> }} />
        <Route path="/Physics" render={() => { return <App subject="Physics" /> }} />
        <Route path="/About" render={() => { return <About /> }} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
