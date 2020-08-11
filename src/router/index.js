import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from '@/views/layout/Index';
import Login from '@/views/Login';
import PhoneExam from '@/views/PhoneExam/index.js'
import AuthRouter from '@/views/auth/AuthRouter';
const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route component={Login} exact path="/login" />
        <Route component={PhoneExam} path="/phoneExam" />
        <AuthRouter path="/" component={Layout} />
      </Switch>
    </HashRouter>
  );
};

export default Router;
