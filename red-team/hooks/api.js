const BASE_URL = 'http://trinity-developments.co.uk';

/**
 * Centralized API request function
 * @param {string} endpoint - API endpoint (starts with /)
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} body - Payload for POST/PATCH requests
 * @returns {Promise<any>} - Parsed JSON response
 */
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            console.error(`API Error: ${response.status} - ${data.message}`);
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`Request failed for ${endpoint}:`, error.message);
        throw error;
    }
};