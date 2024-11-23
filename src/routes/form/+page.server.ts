// +page.server.ts
import { json } from '@sveltejs/kit';

const BASE_API_URL = 'https://api.pipedrive.com/v1';

// Функция получения access_token с использованием authorization code
async function getAccessToken(authCode: string) {
    const response = await fetch('https://oauth.pipedrive.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code: authCode,
            client_id: 'd5b97127d6cc9814',
            client_secret: '0441c6cff83aa5ca3ba64d0c7989f3d1e61ecf98',
            redirect_uri: 'https://workizpreview.onrender.com/',
        }),
    });

    const result = await response.json();
    return result.access_token;
}

// Основной обработчик загрузки страницы
export async function load({ url }) {
    const authCode = '5bc8c268e9e771db18b3c19e91356d75dedfee1a';
    if (!authCode) {
        throw new Error('Authorization code not found');
    }

    // Получаем access token
    const accessToken = await getAccessToken(authCode);
    console.log('accessToken2', accessToken);

    // Возвращаем объект, который будет доступен в компоненте
    return {
        accessToken: authCode, // возвращаем как свойство
    };
}
