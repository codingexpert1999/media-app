import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openForm } from '../actions/layoutActions';
import { hideSearchedResults } from '../actions/profileActions';
import { logOut } from '../actions/userActions';
import { State } from '../interfaces';

const NavBar = () => {
    const dispatch = useDispatch();
    const {profile} = useSelector((state: State) => state.profile)
    const {isAuthenticated, user} = useSelector((state: State) => state.user);

    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <span className="navbar-brand">Socialize</span>

                <ul className="nav">
                    { !isAuthenticated && 
                        <React.Fragment>
                            <li className="nav-item">
                            <span className="nav-link" onClick={() => dispatch(openForm("login"))}>Login</span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={() => dispatch(openForm("register"))}>Register</span>
                            </li>
                        </React.Fragment>
                    }

                    {isAuthenticated && <Link to="/dashboard" className="link" onClick={() => dispatch(hideSearchedResults())}>
                        <li className="nav-item">
                            <span className="nav-link">Home</span>
                        </li>
                    </Link>}

                    { isAuthenticated && 
                        <React.Fragment>
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" onClick={() => setOpenDropdown(!openDropdown)}>
                                    <img src="/assets/user.png" className="img-fluid" alt="Default User"/> {user.username}
                                </span>

                                <ul className={openDropdown ? "dropdown-menu show" : "dropdown-menu"}>
                                    <Link to={`/profile/${profile.id}`} className="link" onClick={() => setOpenDropdown(false)}>
                                        <li>
                                            <span className="dropdown-item">
                                                Profile <i className="fas fa-user"></i>
                                            </span>
                                        </li>
                                    </Link>
                                    
                                    <li onClick={() => {
                                        setOpenDropdown(false)
                                        dispatch(logOut(user.id, profile.id))
                                    }}>
                                        <span className="dropdown-item">Log Out <i className="fas fa-power-off"></i></span>
                                    </li>
                                </ul>
                            </li>
                        </React.Fragment>
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;
