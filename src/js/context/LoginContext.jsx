import { createContext } from "react";

export const loginContext = createContext({
    username: '',
    password: '',
    mfa: {
        mfaType: '',
        mfaToken: ''
    }
});