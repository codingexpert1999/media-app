import React from 'react'
import {Route} from 'react-router-dom'
import Dashboard from '../layout/Dashboard';
import Layout from '../layout/Layout'
import Profile from '../profile/Profile';
import PrivateRoute from './PrivateRoute';

const Routes = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={Layout}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/profile/:profileId" component={Profile} />
        </React.Fragment>
    )
}

export default Routes
