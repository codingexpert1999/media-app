import { CLEAR_FORM_ERRORS, CLOSE_FORM, FORM_ERROR_OCCURED, SUBMIT_FORM, OPEN_FORM, REMOVE_FORM_ERROR } from "../actionTypes/layoutActionTypes"

export const openForm = (formType: string) => {
    return {type: OPEN_FORM, payload: {formType}};    
}

export const closeForm = () => {
    return {type: CLOSE_FORM};
}

export const formErrorOccured = (inputName: string, error: string) => {
    return {type: FORM_ERROR_OCCURED, payload: {inputName, error}}
}

export const removeFormError = (inputName: string) => {
    return {type: REMOVE_FORM_ERROR, payload: {inputName}};
}

export const clearFormErrors = () => {
    return {type: CLEAR_FORM_ERRORS};
}

export const submitForm = () => {
    return {type: SUBMIT_FORM};
}