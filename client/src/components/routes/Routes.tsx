import React from 'react'
import {Route} from 'react-router-dom'
import Layout from '../layout/Layout'
import PrivateRoute from './PrivateRoute';

const Routes = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={Layout}/>
            <PrivateRoute exact path="/dashboard" component={() => <h1>Dashboard</h1>} />
        </React.Fragment>
    )
}

export default Routes
