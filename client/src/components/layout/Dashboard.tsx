import React from 'react'
import Posts from '../post/Posts'
import SideNavLeft from '../sidenavs/SideNavLeft'
import SideNavRight from '../sidenavs/SideNavRight'

const Dashboard = () => {
    return (
        <div className="dashboard container">
            <React.Fragment>
                <SideNavLeft/>

                <SideNavRight/>
            </React.Fragment>

            <Posts/>
        </div>
    )
}

export default Dashboard
