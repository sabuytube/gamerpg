import axios from "axios";
import { decrypt } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/logger";
import {akeApi,siteAuthApi} from "@/lib/apiConfigs";

// Function to refresh token
async function refreshAccessToken(tokenData) {
    try {
        const {data:dataLogin} = await akeApi.post("/auth/login",{
            "clientId": tokenData.user.lineId,
            "clientSecret": tokenData.user.lineId + tokenData.user.mobile,
        });
        const newTokenResponse = dataLogin;
        const currentTime = Date.now();
        const expiresInMs = newTokenResponse?.expires_in * 1000;
        const expiresAt = new Date(currentTime + expiresInMs);
        return {
            ...tokenData,
            access_token: newTokenResponse?.access_token,
            refresh_token: newTokenResponse?.refresh_token || tokenData.refresh_token,
            expires_in: newTokenResponse?.expires_in,
            expires_at: expiresAt.toISOString(),
            expires_timestamp: currentTime + expiresInMs,
            user: newTokenResponse.user || tokenData.user,
            session: newTokenResponse.session || tokenData.session,
            meta: newTokenResponse.meta || tokenData.meta,
        };
    } catch (error) {
        console.error("Error refreshing token in API proxy:", error);
        return {
            ...tokenData,
            error: "RefreshAccessTokenError",
        };
    }
}

export const POST = async (req) => {
    try {
        logger.info('API Proxy request started', { method: 'POST' });
        let jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const decode = await req.json();
        const dataBody = JSON.parse(decrypt(decode));
        const { url, method = "GET", body } = dataBody;
        logger.debug('Request details', { url, method, hasBody: !!body });

        const token = jwt?.token?.access_token;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        const response = await axios({
            url,
            method,
            data: method === "GET" ? undefined : body,
            headers,
        });
        logger.success('API Proxy request completed', {
            status: response.status,
            url,
            method
        });
        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error) {
        logger.error('API Proxy error:', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method
        });

        const status = error.response?.status || 500;
        return new Response(JSON.stringify({
            error: error.response?.data || "Something went wrong"
        }), { status });
    }
};
