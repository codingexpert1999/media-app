import { LayoutPayload, LayoutState } from "../interfaces/layout";
import { CLEAR_FORM_ERRORS, CLOSE_FORM, FORM_ERROR_OCCURED, SUBMIT_FORM, OPEN_FORM, REMOVE_FORM_ERROR } from "../actionTypes/layoutActionTypes"
import { LOGIN, REGISTER_USER } from "../actionTypes/userActionTypes";

const initialState:LayoutState = {
    formType: null,
    formErrors: {
        username: {errorOccured: false, errorMessage: ""},
        email: {errorOccured: false, errorMessage: ""},
        password: {errorOccured: false, errorMessage: ""},
        confirmPassword: {errorOccured: false, errorMessage: ""}
    },
    formSubmitted: false
};

const layoutReducer = (state=initialState, action: {type: String, payload: LayoutPayload}) => {
    const {type, payload} = action;

    switch(type){
        case OPEN_FORM:
            return {...state, formType: payload.formType}
        case CLOSE_FORM:
            return {...state, formType: null};
        case FORM_ERROR_OCCURED:
            return {...state, formSubmitted: false, formErrors: {...state.formErrors, [payload.inputName]: {errorOccured: true, errorMessage: payload.error}}}
        case REMOVE_FORM_ERROR:
            return {...state, formErrors: {...state.formErrors, [payload.inputName]: {errorOccured: false, errorMessage: ""}}}
        case CLEAR_FORM_ERRORS:
            return {...state, formErrors: initialState.formErrors}
        case SUBMIT_FORM:
            return {...state, formSubmitted: true}
        case REGISTER_USER:
        case LOGIN:
            return {...state, formSubmitted: false, formType: null}
        default:
            return state;
    }
};

export default layoutReducer;