import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/login';
import Parse from 'parse';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SiderDemo from './pages/layout';
import { Button } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
window.auth = function (Component) {
  // let token = window.localStorage.getItem("app_session_token")
  // token = (token === null) ? "" : token
  // return (new Parse.Session().isValid(token) && !!Parse.User.current()) ? <Component /> : <LoginApp />
  return <Component />;
}


const App = () => {
  Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  Parse.initialize(
    '', // This is your Application ID
    '' // This is your Javascript key
  );
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/panel/" render={() => window.auth(SiderDemo)} />
        <Route exact render={() => {
          return <Exception type="404" style={{
            minHeight: 500,
            height: "80%",
            marginTop: "100px"
          }}
            desc="Pagina não encontrada."
            img='/images/404.svg'
            linkElement={() => <Link to="/"><Button type="primary">Voltar à página inicial</Button></Link>} />
        }} />
      </Switch>
    </Router>
  );
}

export default App;
