import CryptoJS from "crypto-js";
const secretKey = process.env.SECRET_KEY || "1234567890123456"; // 16, 24 หรือ 32 ตัว

export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const checkPayload = async (...args) => {
    let req = args[0];
    if (!req || typeof req?.method !== 'string' || typeof req?.headers?.get !== 'function') {
        req = args[1];
    }
    let body;
    if (req?.method !== 'GET') {

        const raw = await req.json();
        // Support both new shape (raw payload) and old shape ({ body: payload })
        body = raw && typeof raw === 'object' && 'body' in raw ? raw.body : raw;
    } else {
        const url = new URL(req.url);
        const params = url.searchParams;
        body = Object.fromEntries(params.entries());
    }
    return {
        body,
        header:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
}
