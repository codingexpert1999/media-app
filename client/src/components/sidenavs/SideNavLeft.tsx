import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '../../actions/layoutActions';
import { State } from '../../interfaces';

const SideNavLeft = () => {
    const dispatch = useDispatch();

    const {modalType} = useSelector((state:State) => state.layout);

    return (
        <ul className="sidenav sidenav-left shadow">
            <li>
                <button className="btn btn-primary" onClick={() => {
                    if(modalType !== ""){
                        return;
                    }
                    
                    dispatch(openModal("post"))
                }}>Create Post +</button>
            </li>
            <li>
                <button className="btn btn-add-friend btn-outline-success">Add Friend +</button>
            </li>
            <li className="clickable">Notifications <i className="fas fa-bell"></i></li>
            <li className="clickable">Messages <i className="fas fa-inbox"></i></li>
        </ul>
    )
}

export default SideNavLeft
