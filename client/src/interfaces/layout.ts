export interface LayoutState{
    formType: string | null;
    formErrors: FormErrors;
    formSubmitted: boolean;
    showModal: boolean;
    modalType: string;
    idToUseInModal: number;
    postIndex: number;
    commentIndex: number;
}

export interface FormErrors{
    username:FormError;
    email:FormError;
    password:FormError;
    confirmPassword:FormError;
}

export interface FormError{
    errorOccured: boolean;
    errorMessage: string;
}

export interface LayoutPayload{
    formType: string;
    inputName: string;
    error: string;
    modalType: string;
    id: number;
    index: number;
}