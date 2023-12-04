import axios from "axios";
import { API_URL } from "./settings";

export async function fetchEndpoint(endpoint) {
    var request = await doRequest(endpoint);
    if(!request.success && request.code === 401) {
        var resp = await refreshToken();
        if(resp && resp.status == 200) {
            localStorage.setItem("accessToken", (await resp.json()).accessToken);
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
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
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