import React from 'react';
import { withRouter } from 'react-router';
import { Route, Redirect } from 'react-router-dom';

const AuthRouter = ({ component: Component, ...rest }) => {
  if (window.navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    return <Redirect to={'/phoneExam'} />
  }
  const isLogged = localStorage.getItem('isLogin') ? true : false;
  return <Route {...rest} render={props => (isLogged ? <Component {...props} /> : <Redirect to={'/login'} />)} />;
};

export default withRouter(AuthRouter);
