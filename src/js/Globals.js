import axios from "axios";
import { API_URL } from "./settings";
import store, { actions } from "./store";

export async function fetchEndpoint(endpoint) {
    var request = await doRequest(endpoint);
    if(!request.success && request.code === 401) {
        var resp = await refreshToken();
        if(resp && resp.status == 200) {
            store.dispatch(actions.setAccessToken(resp.data.message));
            return fetchEndpoint(endpoint);
        }else{
            return {
                data: null
            }
        }
    }else{
        return request;
    }
}

export async function fetchProfile() {   
    const profileResponse = (await fetchEndpoint("profile")).data;
    if (profileResponse == null) {
        return false;
    }

    const inventoryResponse = (await fetchEndpoint("inventory")).data;
    if (inventoryResponse == null) {
        return false;
    }
    
    const casesResponse = (await fetchEndpoint("cases")).data;
    if (casesResponse == null) {
        return false;
    }
    
    store.dispatch(actions.setProfile(profileResponse));
    store.dispatch(actions.setInventory(inventoryResponse));
    store.dispatch(actions.setCases(casesResponse));

    return true;
}


async function refreshToken() {
    var resp = await axios.get(`${API_URL}/refresh-token`, {
        withCredentials: true,
        validateStatus: () => true
    });

    return resp;
}

async function doRequest(endpoint) {
    let resp;
    try {
        resp = await axios.get(`${API_URL}/${endpoint}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${store.getState().auth.accessToken}`
            }
        });
    }catch (error) {
        return {
            success: false,
            code: error.response.status,
            data: error.response.data
        };
    }

    return {
        success: true,
        code: resp.status,
        data: resp.data
    }
}

// https://stackoverflow.com/a/61725074
export function coerceToArrayBuffer(input) {
    if (typeof input === "string") {
        input = input.replace(/-/g, "+").replace(/_/g, "/");

        var str = window.atob(input);
        var bytes = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        input = bytes;
    }

    if (Array.isArray(input)) {
        input = new Uint8Array(input);
    }

    if (input instanceof Uint8Array) {
        input = input.buffer;
    }

    if (!(input instanceof ArrayBuffer)) {
        throw new TypeError(`could not coerce to ArrayBuffer`);
    }

    return input;
}

// https://stackoverflow.com/a/61725074
export function coerceToBase64Url(input) {
    if (Array.isArray(input)) {
        input = Uint8Array.from(input);
    }

    if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
    }

    if (input instanceof Uint8Array) {
        var str = "";
        var len = input.byteLength;

        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(input[i]);
        }
        input = window.btoa(str);
    }

    if (typeof input !== "string") {
        throw new Error("could not coerce to string");
    }

    input = input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");

    return input;
}