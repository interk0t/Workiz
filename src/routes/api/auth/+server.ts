// src/routes/api/auth.js
export async function POST({ request }) {
    const { code, refresh_token } = await request.json();

    const client_id = import.meta.env.VITE_CLIENT_ID;
    const client_secret = import.meta.env.VITE_CLIENT_SECRET;
    const redirect_uri = import.meta.env.VITE_REDIRCT_URL;

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
