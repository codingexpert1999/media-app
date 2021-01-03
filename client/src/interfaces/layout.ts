export interface LayoutState{
    formType: string | null;
    formErrors: FormErrors;
    formSubmitted: boolean;
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
}