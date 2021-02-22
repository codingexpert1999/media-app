import { 
    CLEAR_FORM_ERRORS, 
    CLOSE_FORM, 
    FORM_ERROR_OCCURED, 
    SUBMIT_FORM, 
    OPEN_FORM, 
    REMOVE_FORM_ERROR, 
    OPEN_MODAL, 
    CLOSE_MODAL, 
    SET_ID_TO_USE_IN_MODAL,
    SET_POST_INDEX,
    SET_COMMENT_INDEX
} from "../actionTypes/layoutActionTypes"

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

export const openModal = (modalType: string) => {
    return {type: OPEN_MODAL, payload: {modalType}};    
}

export const closeModal = () => {
    return {type: CLOSE_MODAL};    
}

export const setIdToUseInModal = (id: number) => {
    return {type: SET_ID_TO_USE_IN_MODAL, payload: {id}}
}

export const setPostIndex = (index: number) => {
    return {type: SET_POST_INDEX, payload: {index}}
}

export const setCommentIndex = (index: number) => {
    return {type: SET_COMMENT_INDEX, payload: {index}}
}