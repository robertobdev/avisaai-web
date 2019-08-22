import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/login';
import Parse from 'parse';
import 'antd/dist/antd.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  Parse.initialize(
    '', // This is your Application ID
    '' // This is your Javascript key
  );
  return (
    <Router>
      <Route exact path="/" component={LoginPage}/>
    </Router>
    // <LoginPage></LoginPage>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
