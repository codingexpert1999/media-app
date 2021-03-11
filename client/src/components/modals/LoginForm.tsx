import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearFormErrors, closeForm, formErrorOccured, submitForm, removeFormError } from '../../actions/layoutActions';
import { State } from '../../interfaces';
import {validateEmail} from '../../helper';
import { login } from '../../actions/userActions';

const LoginForm = () => {
    const dispatch = useDispatch();
    const {formErrors, formSubmitted} = useSelector((state: State) => state.layout);

    const [formValues, setFormValues] = useState({
        email: "mike12@gmail.com",
        password: "123456",
    });

    const [validInputs, setValidInputs] = useState({
        email: false,
        password: false,
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});

        if(name === "email" || name === "password"){
            if(formErrors[name].errorOccured){
                dispatch(removeFormError(name));
            }
        }
    }

    const handleSumit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        dispatch(submitForm());
        dispatch(login(formValues));
    }

    const handleValidation = (inputName: string) => {
        switch(inputName){
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
            default:
                break;
        }
    }

    const {email, password} = formValues;

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

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                dispatch(closeForm());
                                dispatch(clearFormErrors());
                            }}>Cancel</button>
                            <button type="submit" disabled={
                                !validInputs.email || !validInputs.password || formSubmitted
                            } className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
