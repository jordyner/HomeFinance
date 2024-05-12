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


export const createUser = async (userData) => {
    return callAPI(`${API_BASE_URL}/user`, 'POST', userData);
};

export const deleteUser = async (userId) => {
    return callAPI(`${API_BASE_URL}/user/${userId}`, 'DELETE');
};

export const updateUser = async (userId, updateData) => {
    return callAPI(`${API_BASE_URL}/user/${userId}`, 'PUT', updateData);
};

export const getUser = async (userId) => {
    return callAPI(`${API_BASE_URL}/user/get`, 'POST', { id: userId });
};

export const listUsers = async () => {
    return callAPI(`${API_BASE_URL}/user/list`, 'GET');
};

export const addMemberToUser = async (userId, memberId) => {
    return callAPI(`${API_BASE_URL}/user/${userId}/addMember/${memberId}`, 'POST');
};

export const deleteMemberFromUser = async (userId, memberId) => {
    return callAPI(`${API_BASE_URL}/user/${userId}/deleteMember/${memberId}`, 'POST');
};


export const createChart = async (chartData) => {
    return callAPI(`${API_BASE_URL}/chart`, 'POST', chartData);
};

export const deleteChart = async (chartId) => {
    return callAPI(`${API_BASE_URL}/chart/${chartId}`, 'DELETE');
};

export const updateChart = async (chartId, updateData) => {
    return callAPI(`${API_BASE_URL}/chart/${chartId}`, 'PUT', updateData);
};

export const getChart = async (chartId) => {
    return callAPI(`${API_BASE_URL}/chart/${chartId}`, 'GET');
};

export const listCharts = async () => {
    return callAPI(`${API_BASE_URL}/chart/list`, 'GET');
};


export const createTransaction = async (transactionData) => {
    return callAPI(`${API_BASE_URL}/transaction/create`, 'POST', transactionData);
};

export const deleteTransaction = async (transactionId) => {
    return callAPI(`${API_BASE_URL}/transaction/${transactionId}`, 'DELETE');
};

export const updateTransaction = async (transactionId, updateData) => {
    return callAPI(`${API_BASE_URL}/transaction/${transactionId}`, 'PUT', updateData);
};

export const getTransaction = async (transactionId) => {
    return callAPI(`${API_BASE_URL}/transaction/${transactionId}`, 'GET');
};

export const listTransactions = async () => {
    return callAPI(`${API_BASE_URL}/transaction/list`, 'GET');
};


export const createBudget = async (budgetData) => {
    return callAPI(`${API_BASE_URL}/budget`, 'POST', budgetData);
};

export const deleteBudget = async (budgetId) => {
    return callAPI(`${API_BASE_URL}/budget/${budgetId}`, 'DELETE');
};

export const updateBudget = async (budgetId, updateData) => {
    return callAPI(`${API_BASE_URL}/budget/${budgetId}`, 'PUT', updateData);
};

export const getBudget = async (budgetId) => {
    return callAPI(`${API_BASE_URL}/budget/${budgetId}`, 'GET');
};

export const listBudgets = async () => {
    return callAPI(`${API_BASE_URL}/budget/list`, 'GET');
};


export const createDashboard = async (dashboardData) => {
    return callAPI(`${API_BASE_URL}/dashboard`, 'POST', dashboardData);
};

export const deleteDashboard = async (dashboardId) => {
    return callAPI(`${API_BASE_URL}/dashboard/${dashboardId}`, 'DELETE');
};

export const updateDashboard = async (dashboardId, updateData) => {
    return callAPI(`${API_BASE_URL}/dashboard/${dashboardId}`, 'PUT', updateData);
};

export const getDashboard = async (dashboardId) => {
    return callAPI(`${API_BASE_URL}/dashboard/${dashboardId}`, 'GET');
};

export const listDashboards = async () => {
    return callAPI(`${API_BASE_URL}/dashboard/list`, 'GET');
};
