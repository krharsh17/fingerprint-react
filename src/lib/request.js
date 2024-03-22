import { API_BASE_URL } from "./utils/constants"

export const httpPost = async (url, payload) => {
    return await (await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })).json()
}