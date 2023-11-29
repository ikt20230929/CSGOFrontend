import { createContext } from "react";

export const LoginContext = createContext({
    username: '',
    password: '',
    mfa: {
        mfaType: '',
        mfaToken: ''
    }
});