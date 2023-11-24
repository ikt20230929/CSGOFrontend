export const API_URL = "https://localhost:7233/api";

export async function fetchEndpoint(endpoint) {
    var request = await doRequest(endpoint);
    if(!request.success && request.code === 401) {
        await refreshToken();
        await fetchEndpoint(endpoint);
    }else{
        return request;
    }
}

async function refreshToken() {
    // TODO
}

async function doRequest(endpoint) {
    let resp;
    try {
        resp = await fetch(`${API_URL}/${endpoint}`, {
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
        data: await resp.json()
    }
}