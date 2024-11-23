import moment from 'moment';

export function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const isProduction = import.meta.env.VITE_MODE === 'production';
    document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; HttpOnly`;
}

export function getCookie(name: string) {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)'),
    );
    return match ? match[2] : null;
}

export function getTokensFromCookies() {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');
    const tokenExpiry = getCookie('token_expiry');

    return {
        accessToken,
        refreshToken,
        tokenExpiry,
    };
}

export async function getValidToken() {
    const { accessToken, tokenExpiry } = getTokensFromCookies();
    const currentTime = Date.now();
    console.log({
        currentTime: moment(currentTime).format('HH:mm:ss'),
        tokenExpiry: moment(Number(tokenExpiry)).format('HH:mm:ss'),
    });
    if (accessToken && tokenExpiry && currentTime < Number(tokenExpiry)) {
        console.log('Токен актуален');
        return accessToken;
    }
    console.log('Токен устарел');
    await handleTokenRefresh();
    return getCookie('access_token');
}

export async function handleTokenExchange(code: string) {
    try {
        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (data.access_token) {
            const expiryTime = Date.now() + 5 * 1000;
            console.log('handleTokenExchange: ', {
                expiryTime: moment(expiryTime).format('HH:mm:ss'),
            });
            setCookie('access_token', data.access_token, 7);
            setCookie('refresh_token', data.refresh_token, 7);
            setCookie('token_expiry', expiryTime.toString(), 7);
        } else {
            throw new Error('Failed to get access token');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function handleTokenRefresh() {
    try {
        const refreshToken = getCookie('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();

        if (data.access_token) {
            const expiryTime = Date.now() + 5 * 1000;
            setCookie('access_token', data.access_token, 7);
            setCookie('token_expiry', expiryTime.toString(), 7);
            console.log('Updated Access Token:', data.access_token);
        } else {
            throw new Error('Failed to refresh access token');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
