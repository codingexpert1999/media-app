import { LayoutPayload, LayoutState } from "../interfaces/layout";
import { CLEAR_FORM_ERRORS, CLOSE_FORM, FORM_ERROR_OCCURED, SUBMIT_FORM, OPEN_FORM, REMOVE_FORM_ERROR, OPEN_MODAL, CLOSE_MODAL, SET_ID_TO_USE_IN_MODAL, SET_POST_INDEX, SET_COMMENT_INDEX } from "../actionTypes/layoutActionTypes"
import { LOGIN, REGISTER_USER } from "../actionTypes/userActionTypes";

const initialState:LayoutState = {
    formType: null,
    formErrors: {
        username: {errorOccured: false, errorMessage: ""},
        email: {errorOccured: false, errorMessage: ""},
        password: {errorOccured: false, errorMessage: ""},
        confirmPassword: {errorOccured: false, errorMessage: ""}
    },
    formSubmitted: false,
    showModal: false,
    modalType: "",
    idToUseInModal: 0,
    postIndex: -1,
    commentIndex: -1
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
        case OPEN_MODAL:
            return {...state, showModal: true, modalType: payload.modalType}
        case CLOSE_MODAL:
            return {...state, showModal: false, modalType: "", idToUseInModal: 0, postIndex: -1, commentIndex: -1}
        case SET_ID_TO_USE_IN_MODAL:
            return {...state, idToUseInModal: payload.id}
        case SET_POST_INDEX:
            return {...state, postIndex: payload.index}
        case SET_COMMENT_INDEX:
            return {...state, commentIndex: payload.index}
        default:
            return state;
    }
};

export default layoutReducer;