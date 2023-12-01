import axios from "axios";

export const API_URL = process.env.API_URL;

export async function fetchEndpoint(endpoint) {
    var request = await doRequest(endpoint);
    if(!request.success && request.code === 401) {
        await refreshToken();
        return fetchEndpoint(endpoint);
    }else{
        return request;
    }
}

async function refreshToken() {
    try {
        var resp = await axios.get(`${API_URL}/refresh-token`, {
            withCredentials: true
        });
        localStorage.setItem("accessToken", (await resp.json()).accessToken);
    }catch{
        
    }
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