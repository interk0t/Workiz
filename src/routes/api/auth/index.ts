import moment from 'moment';

export function setCookie(name: string, value: string, days: number) {
    // const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // const isProduction = import.meta.env.VITE_MODE === 'production';
    // document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; HttpOnly`;
}

export function getCookie(name: string) {
    // const match = document.cookie.match(
    //     new RegExp('(^| )' + name + '=([^;]+)'),
    // );
    // return match ? match[2] : null;
}

// export function getTokensFromCookies() {
//     const accessToken = getCookie('access_token');
//     const refreshToken = getCookie('refresh_token');
//     const tokenExpiry = getCookie('token_expiry');

//     return {
//         accessToken,
//         refreshToken,
//         tokenExpiry,
//     };
// }

export async function getValidToken() {
    try {
        // Пробуем получить актуальный токен
        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'get_valid_token' }),
        });

        const data = await response.json();

        // Если токен обновлен
        if (data.access_token) {
            if (data.tokenRefresh) {
                console.log('Token has been refreshed', data);
            } else {
                console.log('Token is valid', data);
            }

            return data.access_token;
        }
        console.log(data);
        throw new Error('Failed to get valid token');
    } catch (error) {
        console.error('Error fetching valid token:', error);
        throw new Error('Unable to refresh token');
    }
}

export async function handleTokenExchange(code: string) {
    console.log('token_exchange');
    try {
        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'token_exchange', code }),
        });

        const data = await response.json();
        console.log(data);

        if (data.access_token) {
            console.log('Token exchange success');
        } else {
            throw new Error('Failed to get access token');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function isAccessTokenExist() {
    try {
        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'is_access_token_exist' }),
        });

        const data = await response.json();
        if (data.access_token) {
            console.log('Token is exist');
            return data.access_token;
        } else {
            console.log('Token is exist');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
