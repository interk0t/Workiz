<script>
    let receivedData = {};

    // Обработка сообщений из iframe
    function handleIframeMessage(event) {
        if (event.origin !== window.location.origin) {
            console.warn('Сообщение от неизвестного источника:', event.origin);
            return;
        }

        if (event.data.source === 'react-devtools-content-script') {
            return;
        }

        receivedData = event.data;
        sendToPipedrive(receivedData);
        console.log('Данные из iframe:', receivedData);
    }

    // Добавляем слушатель событий
    $effect(() => {
        const messageHandler = (event) => handleIframeMessage(event);
        window.addEventListener('message', messageHandler);
        return () => {
            console.log('SDASDADASD');
            window.removeEventListener('message', messageHandler);
        };
    });

    async function sendToPipedrive(data) {
        const API_TOKEN = '8fe93718029bbba034ce292515232b7af3b3f392';
        const API_URL = `https://api.pipedrive.com/v1/deals?api_token=${API_TOKEN}`;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Сделка успешно создана:', result);
        } catch (error) {
            console.error('Ошибка отправки данных в Pipedrive:', error);
        }
    }
</script>

<h1>CRM Integration</h1>
<p>Отправленные данные из iframe:</p>
<pre>{JSON.stringify(receivedData, null, 2)}</pre>

<iframe title="form" src="/form" width="1000" height="600" id="iframe"></iframe>

<style>
    iframe {
        border: 1px solid #ccc;
        margin-top: 20px;
    }
</style>
