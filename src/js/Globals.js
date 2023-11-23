export const API_URL = "https://localhost:7233/api";

export async function fetchEndpoint(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
    }catch (error) {
        if(error.response != null) {

        }
    }
}