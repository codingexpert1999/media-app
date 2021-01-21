import React from 'react'
import {Route} from 'react-router-dom'
import Dashboard from '../layout/Dashboard';
import Layout from '../layout/Layout'
import PrivateRoute from './PrivateRoute';

const Routes = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={Layout}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </React.Fragment>
    )
}

export default Routes
