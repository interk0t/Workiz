// src/routes/api/auth.js
export async function POST({ request }) {
    const { code, refresh_token } = await request.json();
    const client_id = 'd5b97127d6cc9814';
    const client_secret = '0441c6cff83aa5ca3ba64d0c7989f3d1e61ecf98';
    const redirect_uri = 'https://workizpreview.onrender.com/form';

    let params;

    if (code) {
        params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id,
            client_secret,
            redirect_uri,
        });
    } else if (refresh_token) {
        params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
            client_id,
            client_secret,
        });
    } else {
        return new Response(
            JSON.stringify({ error: 'Missing code or refresh_token' }),
            { status: 400 },
        );
    }

    try {
        const response = await fetch(
            'https://oauth.pipedrive.com/oauth/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            },
        );

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to refresh token' }),
            { status: 500 },
        );
    }
}