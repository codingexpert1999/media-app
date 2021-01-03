import React, {useEffect} from 'react'
import { useSelector } from 'react-redux';
import RegisterForm from "../modals/RegisterForm";
import {State} from '../../interfaces'
import LoginForm from '../modals/LoginForm';
import { useHistory } from 'react-router-dom';

const AuthenticateUser = () => {
    const {formType} = useSelector((state:State) => state.layout);
    const {isAuthenticated} = useSelector((state:State) => state.user);

    const history = useHistory();

    useEffect(() => {
        if(isAuthenticated){
            history.push("/dashboard");
        }
    }, [isAuthenticated])

    return (
        <React.Fragment>
            <div className="container d-flex justify-content-center align-items-center layout-container">
                <div className="img-container">
                    <img src="/assets/illustration.svg" className="img-fluid" alt="Illustration"/>
                </div>

                <div className="layout-text">
                    <h1>With Socialize you can</h1>
                    <p className="d-flex justify-content-start align-items-center p-2 fs-3">
                        <span className="dot"></span> Meet new people
                    </p>
                    <p className="d-flex justify-content-start align-items-center p-2 fs-3">
                        <span className="dot"></span> Read others posts
                    </p>
                    <p className="d-flex justify-content-start align-items-center p-2 fs-3">
                        <span className="dot"></span> Upload your own posts
                    </p>
                </div>
            </div>
            {formType && formType === "register" && <RegisterForm/>}

            {formType && formType === "login" && <LoginForm/>}

            <footer className="container-fluid d-flex justify-content-start align-items-center px-4 fs-5">
                <p>Socialize &copy; 2021</p>
            </footer>
        </React.Fragment>
    )
}

export default AuthenticateUser
