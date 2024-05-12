const API_BASE_URL = 'http://localhost:8000'; 

const callAPI = async (url, method, body = null) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorDetail = await response.text();
            throw new Error(`API call was not successful: ${response.status}, detail: ${errorDetail}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error calling API: ${error}`);
        throw error;
    }
};

export const listUsers = async () => {
    return callAPI(`${API_BASE_URL}/user/list`, 'GET');
};

export const createTransaction = async (transactionData) => {
    return callAPI(`${API_BASE_URL}/transaction/create`, 'POST', transactionData);
};

export const listTransactions = async () => {
    return callAPI(`${API_BASE_URL}/transaction/list`, 'GET');
};