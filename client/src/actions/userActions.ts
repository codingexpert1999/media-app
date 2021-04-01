import axios from 'axios';
import { LOGIN, LOG_OUT, REGISTER_USER, VERIFY_USER } from '../actionTypes/userActionTypes';
import { API, getAxiosBody, getContentType } from '../helper';
import {Dispatch} from 'redux'
import { FORM_ERROR_OCCURED } from '../actionTypes/layoutActionTypes';
import { toast } from 'react-toastify';

export const registerUser = (formValues: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody(formValues);
    
            const res = await axios.post(`${API}/signup`, body, {...contentType, withCredentials: true});
            
            dispatch({type: REGISTER_USER, payload: res.data});
        } catch (err) {
            dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "username"}})
        }
    } 
}

export const login = (formValues: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody(formValues);
    
            const res = await axios.post(`${API}/login`, body, {...contentType, withCredentials: true});
                        
            dispatch({type: LOGIN, payload: res.data});
        } catch (err) {
            dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "email"}});
        }
    }
}

export const verifyUser = (userId: number) => {
    if(localStorage.getItem("user")){
        return async (dispatch: Dispatch) => {
            const res = await axios.get(`${API}/verify_user/${userId}`, {withCredentials: true});

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

export const logOut = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.delete(`${API}/logout/${userId}/${profileId}`, {withCredentials: true});
            localStorage.removeItem("user");

            dispatch({type: LOG_OUT})
        } catch (err) {
            toast.error("Couldn't log out");
        }
    }
}