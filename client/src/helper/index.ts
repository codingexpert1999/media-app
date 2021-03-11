export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getAxiosConfig = (isSendingData=true) => {
    return isSendingData ? {
        headers: {
            'Content-Type': "application/json",
            withCredentials: true
        }
    } 
        :
    {
        headers: {
            withCredentials: true
        }
    }
}

export const getAxiosBody = (obj: Object) => JSON.stringify(obj);

export const API = process.env.REACT_APP_API_URL;