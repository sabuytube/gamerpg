import axios from "axios";
import {encrypt} from "./utils";
import { logger } from './logger';

// Resolve API base origin for building absolute URL to our Next.js API routes
const resolveOrigin = () => {
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
};

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    },
});

// 🔸 Core request helper that posts encrypted envelope to our proxy
const request = async (method, path, data = {}, headers = {}) => {
    try {
        const origin = resolveOrigin();
        let fullUrl = `${origin}/api/${path}`;
        let requestBody = {};
        if (method.toUpperCase() === "GET") {
            const qs = new URLSearchParams(data).toString();
            if (qs) fullUrl += `?${qs}`;
        } else {
            requestBody = data;
        }
        const bodyToEncrypt = {
            url: fullUrl,
            method: method.toUpperCase(),
            ...(method.toUpperCase() === "GET" ? {} : { body: requestBody })
        };
        const encryptedBody = encrypt(JSON.stringify(bodyToEncrypt));
        const response = await api.post("", encryptedBody, { headers });
        return response.data;
    } catch (error) {
        logger.error('API request failed', { error, path, method });
        throw error?.response?.data || { message: error.message || 'Request failed' };
    }
};

// 🔸 Public API surface
const apiService = {
    get: (path, params = {}, headers = {}) => request("GET", path, params, headers),
    post: (path, body = {}, headers = {}) => request("POST", path, body, headers),
    put: (path, body = {}, headers = {}) => request("PUT", path, body, headers),
    patch: (path, body = {}, headers = {}) => request("PATCH", path, body, headers),
    delete: (path, params = {}, headers = {}) => request("DELETE", path, params, headers)
};

export default apiService;
