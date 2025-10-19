import CryptoJS from "crypto-js";
import api from "@/lib/api";
import { logger } from "./logger";

const secretKey = process.env.SECRET_KEY || "1234567890123456"; // 16, 24 หรือ 32 ตัว

export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const checkPayload = async (...args) => {
    // Backward-compatible signature: (req) or ('get'|'put', req)
    let req = args[0];
    if (!req || typeof req?.method !== 'string' || typeof req?.headers?.get !== 'function') {
        req = args[1];
    }
    let body;
    const authHeader = req?.headers?.get('authorization') || null;
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
            Authorization: authHeader,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
}

export const formatThaiId = (raw) => {
    const n = String(raw).replace(/\D/g, '').slice(0, 13);
    if (!n) return '';
    return [
        n.slice(0, 1),
        n.slice(1, 5),
        n.slice(5, 10),
        n.slice(10, 12),
        n.slice(12, 13),
    ]
    .filter(Boolean)
    .join('-');
};

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('เบราว์เซอร์ไม่รองรับการดึงตำแหน่ง'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ lat: latitude, lng: longitude });
            },
            (error) => {
                let errorMessage = 'ไม่สามารถดึงตำแหน่งได้';

                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'กรุณาอนุญาตการเข้าถึงตำแหน่ง';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'หมดเวลาในการดึงตำแหน่ง';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
};

export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await api.get('reverse', {
            lat: lat,
            lon: lng,
            format: 'json',
            accept_language: 'th'
        });
        // Response shape expected: { success: true, data: {...} }
        if (response?.success && response.data) {
            return response.data; // return pure nominatim data object
        }
        throw new Error(response?.message || 'Reverse geocoding failed');
    } catch (error) {
        logger.error('Reverse geocoding error', { error, lat, lng });
        throw error;
    }
};

export const getCurrentLocationWithAddress = async (provinces = []) => {
    try {
        // ดึงตำแหน่งปัจจุบัน
        const location = await getCurrentLocation();

        // ดึงข้อมูลที่อยู่จากพิกัด (already normalized nominatim object)
        const addressData = await reverseGeocode(location.lat, location.lng);

        const displayName = addressData?.display_name || '';
        // หาจังหวัดที่ตรงกันจาก list ที่ส่งมา
        const foundProvince = provinces.length > 0
            ? provinces.find(p => displayName.includes(p)) || ''
            : '';
        const postcodeMatch = displayName.match(/\b\d{5}\b/);
        const foundPostcode = postcodeMatch ? postcodeMatch[0] : '';
        return {
            location,
            address: {
                displayName,
                province: foundProvince,
                postcode: foundPostcode
            },
            raw: addressData
        };
    } catch (error) {
        logger.error('Error getting current location with address', { error, provinces });
        throw error;
    }
};

export const sanitizePhone = (input) => {
    // คืนค่าเฉพาะตัวเลข และ normalize +66XXXXXXXXX -> 0XXXXXXXXX
    const raw = String(input || '').replace(/\D/g, '');
    if (raw.startsWith('66')) {
        // 66 + 9 ตัว (รวม 11) -> 0 + 9 ตัว = 10 หลัก
        return ('0' + raw.slice(2)).slice(0, 10);
    }
    return raw.slice(0, 10);
}

export const formatPhone = (value) => {
    // format เป็น XXX-XXX-XXXX สำหรับแสดงใน input
    const numbers = sanitizePhone(value);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}

export const getPhoneValidationError = (input) => {
    // ตรวจเงื่อนไขตาม DEFECT และรูปแบบเบอร์ไทย
    const phone = sanitizePhone(input);

    if (phone.length !== 10) {
        return 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก';
    }

    // ไม่อนุญาตขึ้นต้น 00,01,02,03,04,05,07
    const disallowedPrefixes = ['00', '01', '02', '03', '04', '05', '07'];
    if (disallowedPrefixes.some(p => phone.startsWith(p))) {
        return 'หมายเลขขึ้นต้นไม่ถูกต้อง (ไม่อนุญาต 00, 01, 02, 03, 04, 05, 07)';
    }

    // mobile ไทยที่ถูกต้องต้องขึ้นต้น 06/08/09
    const thaiMobilePattern = /^0(6|8|9)\d{8}$/;
    if (!thaiMobilePattern.test(phone)) {
        return 'หมายเลขโทรศัพท์ไม่ถูกต้อง (ต้องขึ้นต้น 06, 08 หรือ 09)';
    }

    return null; // ผ่าน
}

export const  base64ToBlob = (base64String, contentType = 'image/jpeg') => {
    try {
        // Remove data URL prefix if exists (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.includes(',')
            ? base64String.split(',')[1]
            : base64String;

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    } catch (error) {
        logger.error('Error converting base64 to blob:', error);
        return null;
    }
};