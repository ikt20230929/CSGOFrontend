import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react';
import { coerceToBase64Url, fetchProfile } from '../Globals';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../context/LoginContext';
import { API_URL } from '../settings';
import { actions } from '../store';

export default function WebAuthnPage() {
    const data = useContext(loginContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (data.mfa.mfaType !== "WebAuthn") return navigate("/login");

        const abortController = new AbortController();

        const fetchWebAuthn = async () => {
            try {
                const response = await axios.post(`${API_URL}/login`, {
                    username: data.username,
                    password: data.password,
                    mfa: {
                        mfaType: 2
                    }
                }, {
                    signal: abortController.signal,
                    withCredentials: true,
                    validateStatus: () => true
                });

                if (response.status !== 401) {
                    return navigate("/login");
                }

                const publicKeyOptions = JSON.parse(response.data.message);
                const challenge = publicKeyOptions.challenge.replace(/-/g, "+").replace(/_/g, "/");
                publicKeyOptions.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

                publicKeyOptions.allowCredentials.forEach(function (listItem) {
                    var fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
                    listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
                });

                let credential = await navigator.credentials.get({ publicKey: publicKeyOptions });
                let authData = new Uint8Array(credential.response.authenticatorData);
                let clientDataJSON = new Uint8Array(credential.response.clientDataJSON);
                let rawId = new Uint8Array(credential.rawId);
                let sig = new Uint8Array(credential.response.signature);

                const assertionData = {
                    id: credential.id,
                    rawId: coerceToBase64Url(rawId),
                    type: credential.type,
                    extensions: credential.getClientExtensionResults(),
                    response: {
                        authenticatorData: coerceToBase64Url(authData),
                        clientDataJson: coerceToBase64Url(clientDataJSON),
                        signature: coerceToBase64Url(sig)
                    }
                };

                const loginResponse = await axios.post(`${API_URL}/login`, {
                    username: data.username,
                    password: data.password,
                    mfa: {
                        mfaType: 3,
                        webAuthnAssertionResponse: assertionData
                    }
                }, {
                    signal: abortController.signal,
                    withCredentials: true,
                    validateStatus: () => true
                });

                if (loginResponse.status !== 200) {
                    return navigate("/login");
                }

                dispatch(actions.setAccessToken(loginResponse.data.message));
                if (await fetchProfile()) {
                    return navigate("/profile");
                } else {
                    // how did we get here?
                    return navigate("/login");
                }
            } catch (err) {
                console.log(err.message ? err.message : err);
            }
        };

        fetchWebAuthn();

        return () => abortController.abort();
    }, []);

    return (
        <h1>Várj...</h1>
    );
};
