import axios from 'axios';
import { LOAD_USER, LOGIN, REGISTER_USER } from '../actionTypes/userActionTypes';
import { API, getAxiosBody, getAxiosConfig } from '../helper';
import {Dispatch} from 'redux'
import { FORM_ERROR_OCCURED } from '../actionTypes/layoutActionTypes';

export const registerUser = (formValues: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig();
            const body = getAxiosBody(formValues);
    
            const res = await axios.post(`${API}/signup`, body, config);
            
            dispatch({type: REGISTER_USER, payload: res.data});
        } catch (err) {
            dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "username"}})
        }
    } 
}

export const login = (formValues: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig();
            const body = getAxiosBody(formValues);
    
            const res = await axios.post(`${API}/login`, body, config);
                        
            dispatch({type: LOGIN, payload: res.data});
        } catch (err) {
            dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "email"}});
        }
    }
}

export const loadUser = () => {
    if(localStorage.getItem("token")){
        return {
            type: LOAD_USER
        }
    }else{
        return {
            type: "CANNOT_LOAD_USER"
        }
    }
}