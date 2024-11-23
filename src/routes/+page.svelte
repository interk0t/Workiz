<script lang="ts">
    import { onMount } from 'svelte';

    let { accessToken }: { accessToken: string } = $props();
    console.log(accessToken); // accessToken должен быть здесь
    const clientId = 'd5b97127d6cc9814';
    const redirectUri = 'https://workizpreview.onrender.com/';
    const authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    let authCode: string;
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        authCode = params.get('code')!;
        console.log('Authorization Code:', authCode);
    });
    async function handleAuth() {
        window.location.href = authUrl;
        console.log(authCode);

        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            client_id: 'd5b97127d6cc9814',
            client_secret: '0441c6cff83aa5ca3ba64d0c7989f3d1e61ecf98',
            redirect_uri: 'https://workizpreview.onrender.com/',
        });

        fetch('https://oauth.pipedrive.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error:', error));
    }
</script>

<h1>CRM Integration</h1>

<iframe title="form" src="/form" width="1000" height="600" id="iframe"></iframe>
<button onclick={handleAuth}>Получить API Token</button>

<style>
    iframe {
        border: 1px solid #ccc;
        margin-top: 20px;
    }
</style>
