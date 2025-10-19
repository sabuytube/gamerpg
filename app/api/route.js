import axios from "axios";
import { decrypt } from "@/lib/utils";

export const POST = async (req) => {
    try {
        const decode = await req.json();
        const dataBody = JSON.parse(decrypt(decode));
        const { url, method = "GET", body } = dataBody;

        // ส่ง cookies และ headers จาก request เดิมไปด้วย
        const cookies = req.headers.get('cookie');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (cookies) {
            headers['cookie'] = cookies;
        }

        const response = await axios({
            url,
            method,
            data: method === "GET" ? undefined : body,
            headers,
        });

        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error) {
        const status = error.response?.status || 500;
        return new Response(JSON.stringify({
            error: error.response?.data || "Something went wrong"
        }), { status });
    }
};
