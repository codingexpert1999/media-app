import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearFormErrors, closeForm, formErrorOccured, submitForm, removeFormError } from '../../actions/layoutActions';
import { State } from '../../interfaces';
import {validateEmail} from '../../helper';
import { registerUser } from '../../actions/userActions';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const {formErrors, formSubmitted} = useSelector((state: State) => state.layout);

    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [validInputs, setValidInputs] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});

        if(name === "username" || name === "email" || name === "password" || name === "confirmPassword"){
            if(formErrors[name].errorOccured){
                dispatch(removeFormError(name));
            }
        }
    }

    const handleSumit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        dispatch(submitForm());
        dispatch(registerUser(formValues));
    }

    const handleValidation = (inputName: string) => {
        switch(inputName){
            case "username":
                if(formValues.username === ""){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Username is required"));
                }else{
                    setValidInputs({...validInputs, [inputName]: true});
                }
                break;
            case "email":
                if(formValues.email === ""){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Email is required"));
                }else if(!validateEmail(email)){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Please enter a valid email"));
                }else{
                    setValidInputs({...validInputs, [inputName]: true});
                }
                break;
            case "password":
                if(formValues.password === ""){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Password is required"));
                }else if(formValues.password.length < 6){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Password must be at least 6 characters"));
                }else{
                    setValidInputs({...validInputs, [inputName]: true});
                }
                break;
            case "confirmPassword":
                if(formValues.confirmPassword === ""){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "You need to confirm your password"));
                }else if(formValues.confirmPassword !== formValues.password){
                    setValidInputs({...validInputs, [inputName]: false});
                    dispatch(formErrorOccured(inputName, "Passwords do not match"));
                }else{
                    setValidInputs({...validInputs, [inputName]: true});
                }
                break;
            default:
                break;
        }
    }

    const {username, email, password, confirmPassword} = formValues;

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Register</h5>
                        <button type="button" className="btn-close" onClick={() => {
                                dispatch(closeForm());
                                dispatch(clearFormErrors());
                        }}></button>
                    </div>
                    <form onSubmit={e => handleSumit(e)}>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input 
                                    type="text" 
                                    className={
                                        validInputs.username ? 
                                        "form-control is-valid" : 
                                        formErrors.username.errorOccured ? 
                                        "form-control is-invalid" : 
                                        "form-control"
                                    } 
                                    name="username" 
                                    value={username}
                                    onChange={e => handleChange(e)}
                                    onBlur={e => handleValidation(e.target.name)}
                                    placeholder="example test13"
                                    autoComplete="nope"
                                />
                                {validInputs.username && <div className="valid-feedback">Looks Good!</div>}
                                {formErrors.username.errorOccured && <div className="invalid-feedback">{formErrors.username.errorMessage}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className={
                                        validInputs.email ? 
                                        "form-control is-valid" : 
                                        formErrors.email.errorOccured ? 
                                        "form-control is-invalid" : 
                                        "form-control"
                                    }
                                    name="email"
                                    value={email}
                                    onBlur={e => handleValidation(e.target.name)}
                                    onChange={e => handleChange(e)}
                                    placeholder="example test@user.com"
                                    autoComplete="nope"
                                />
                                {validInputs.email && <div className="valid-feedback">Looks Good!</div>}
                                {formErrors.email.errorOccured && <div className="invalid-feedback">{formErrors.email.errorMessage}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className={
                                        validInputs.password ? 
                                        "form-control is-valid" : 
                                        formErrors.password.errorOccured ? 
                                        "form-control is-invalid" : 
                                        "form-control"
                                    } 
                                    name="password"
                                    value={password}
                                    onChange={e => handleChange(e)}
                                    onBlur={e => handleValidation(e.target.name)}
                                    placeholder="Password must be at least 6 characters"
                                />
                                {validInputs.password && <div className="valid-feedback">Looks Good!</div>}
                                {formErrors.password.errorOccured && <div className="invalid-feedback">{formErrors.password.errorMessage}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className={
                                        validInputs.confirmPassword ? 
                                        "form-control is-valid" : 
                                        formErrors.confirmPassword.errorOccured ? 
                                        "form-control is-invalid" : 
                                        "form-control"
                                    }
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={e => handleChange(e)}
                                    onBlur={e => handleValidation(e.target.name)}
                                    placeholder="Confirm your password"
                                />
                                {validInputs.confirmPassword && <div className="valid-feedback">Looks Good!</div>}
                                {formErrors.confirmPassword.errorOccured && <div className="invalid-feedback">{formErrors.confirmPassword.errorMessage}</div>}
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                dispatch(closeForm());
                                dispatch(clearFormErrors());
                            }}>Cancel</button>
                            <button type="submit" disabled={
                                !validInputs.username || !validInputs.email || !validInputs.password || !validInputs.confirmPassword || formSubmitted
                            } className="btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
