import { json, type Cookies } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const client_secret = import.meta.env.VITE_CLIENT_SECRET;
    const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token')!;
    const token_expiry = cookies.get('token_expiry')!;
    const secure = false;
    const body = await request.json();

    try {
        if (body.action === 'token_exchange') {
            let code = body.code;
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id,
                client_secret,
                redirect_uri,
            });

            const data = await _fetchTokens(params);

            setCookie(cookies, 'access_token', data.access_token, secure);
            setCookie(cookies, 'refresh_token', data.refresh_token, secure);
            setCookie(
                cookies,
                'token_expiry',
                (Date.now() + 5 * 1000).toString(),
                secure,
            );

            return json(data);
        } else if (body.action === 'get_valid_token') {
            const currentTime = Date.now();

            if (
                access_token &&
                token_expiry &&
                currentTime < Number(token_expiry)
            ) {
                console.log('Токен актуален');
                return json({ access_token });
            } else {
                console.log('Токен не актуален');
                const params = new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token,
                    client_id,
                    client_secret,
                });
                const data = await _fetchTokens(params);
                setCookie(cookies, 'refresh_token', data.refresh_token, secure);
                setCookie(
                    cookies,
                    'token_expiry',
                    (Date.now() + 5 * 1000).toString(),
                    secure,
                );
                return json({ ...data, tokenRefresh: secure });
            }
        } else if (body.action === 'is_access_token_exist') {
            if (access_token) {
                return json({ access_token });
            } else {
                return json({ access_token: false });
            }
        } else if (
            body.action === 'add_custom_fields' ||
            body.action === 'create_deal'
        ) {
            if (!access_token)
                return json(
                    { error: 'Token not available yet try again' },
                    { status: 400 },
                );
            const data = await _fetchDeals(
                body.endpoint,
                body.data,
                access_token,
            );
            return json(data);
        }
    } catch (error) {
        return json({ error: 'Failed to fetch tokens' }, { status: 500 });
    }
}

export async function GET({ url, cookies }) {
    const action = url.searchParams.get('action');
    const access_token = cookies.get('access_token');
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    console.log('Base URL', BASE_URL);

    if (action === 'get_custom_fields') {
        if (access_token) {
            const url = `${BASE_URL}/dealFields`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            return json(data);
        } else {
            return json({ access_token: false });
        }
    }

    return json({ error: 'Invalid action' }, { status: 400 });
}

export async function PUT({ request, cookies }) {
    const body = await request.json();
    const access_token = cookies.get('access_token');
    console.log('PUT Body', body);

    if (body.action === 'set_deal_fields') {
        const response = await fetch(
            `https://api.pipedrive.com/v1/${body.endpoint}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: body.data ? JSON.stringify(body.data) : undefined,
            },
        );
        const data = await response.json();
        return json(data);
    }

    return json({ error: 'Invalid action' }, { status: 400 });
}

async function _fetchTokens(params: any) {
    const response = await fetch('https://oauth.pipedrive.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params?.toString(),
    });

    return await response.json();
}

async function _fetchDeals(
    endpoint: string,
    body?: any,
    access_token?: string,
    method: string = 'POST',
) {
    const response = await fetch(`https://api.pipedrive.com/v1/${endpoint}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return await response.json();
}
function setCookie(
    cookies: Cookies,
    key: string,
    data: string,
    secure: boolean,
) {
    cookies.set(key, data, {
        httpOnly: secure,
        secure: secure,
        path: '/',
        maxAge: 5 * 86400,
    });
}
