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