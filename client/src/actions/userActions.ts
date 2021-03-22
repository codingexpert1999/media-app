import axios from 'axios';
import { LOGIN, REGISTER_USER, VERIFY_USER } from '../actionTypes/userActionTypes';
import { API, getAxiosBody, getAxiosConfig } from '../helper';
import {Dispatch} from 'redux'
import { FORM_ERROR_OCCURED } from '../actionTypes/layoutActionTypes';

export const registerUser = (formValues: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig();
            const body = getAxiosBody(formValues);
    
            const res = await axios.post(`${API}/signup`, body, {...config, withCredentials: true});
            
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
    
            const res = await axios.post(`${API}/login`, body, {...config, withCredentials: true});
                        
            dispatch({type: LOGIN, payload: res.data});
        } catch (err) {
            dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "email"}});
        }
    }
}

export const verifyUser = (userId: number) => {
    if(localStorage.getItem("user")){
        return async (dispatch: Dispatch) => {
            const config = getAxiosConfig(false);

            const res = await axios.get(`${API}/verify_user/${userId}`, {...config, withCredentials: true});

            if(res.data.success){
                dispatch({type: VERIFY_USER})
            }else{
                dispatch({type: "CANNOT_LOAD_USER"})
            }
        }
    }else{
        return {
            type: "CANNOT_LOAD_USER"
        }
    }
}