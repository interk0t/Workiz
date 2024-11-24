export async function getValidToken() {
    try {
        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'get_valid_token' }),
        });

        const data = await response.json();

        if (data.access_token) {
            if (data.tokenRefresh) {
                console.log('Token has been refreshed', data);
            } else {
                console.log('Token is valid', data);
            }

            return data.access_token;
        }
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
