import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Route from './Route';

import Dashboard from '../pages/Dashboard/Dashboard';
import Signin from '../pages/Signin/Signin';
import Signup from '../pages/Signup/Signup';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Profile from '../pages/Profile/Profile';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Signin} />
        <Route path="/sign-up" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route isPrivate path="/dashboard" component={Dashboard} />
        <Route isPrivate path="/profile" component={Profile} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
