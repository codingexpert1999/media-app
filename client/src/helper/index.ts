export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getAxiosConfig = (token="", isSendingData=true) => {
    if(token === ""){
        return {
            headers: {
                'Content-Type': "application/json"
            }
        }
    }else{
        return isSendingData ? {
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            }
        } 
            :
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    }
}

export const getAxiosBody = (obj: Object) => JSON.stringify(obj);

export const API = process.env.REACT_APP_API_URL;