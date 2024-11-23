<script lang="ts">
    import Form from '../../components/Form/index.svelte';
    import Input from '../../components/Input/index.svelte';
    import { customFields, forms, formStore } from '../../store/index.svelte';
    import './styles.sass';

    let isPending = $state(false);
    async function getAccessToken(authCode) {
        const response = await fetch(
            'https://oauth.pipedrive.com/oauth/token',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    code: authCode,
                    client_id: 'd5b97127d6cc9814',
                    client_secret: '0441c6cff83aa5ca3ba64d0c7989f3d1e61ecf98',
                    redirect_uri: 'https://workizpreview.onrender.com/',
                }),
            },
        );

        const result = await response.json();
        return result.access_token;
    }
    async function checkCustomFields() {
        const _customFields = await getCustomFields();
        const existingFields = _customFields.map(
            (field: { name: string }) => field.name,
        );

        const missingFields = customFields.filter(
            (field) => !existingFields.includes(field),
        );
        if (missingFields.length > 0) {
            await addCustomFields(missingFields);
        } else {
            console.log('Все кастомные поля уже созданы');
        }
    }

    $effect(() => {
        checkCustomFields();
    });

    const API_TOKEN = '5bc8c268e9e771db18b3c19e91356d75dedfee1a';
    const BASE_API_URL = 'https://api.pipedrive.com/v1';

    async function apiRequest(
        endpoint: string,
        method: string = 'GET',
        body?: any,
    ) {
        console.log(document);

        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const API_TOKEN = await getAccessToken(authCode);
        const url = `${BASE_API_URL}/${endpoint}?api_token=${API_TOKEN}`;
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            });
            const result = await response.json();
            if (!result.success) {
                console.error(`Ошибка: ${result.error}`);
                throw new Error(result.error);
            }
            return result.data;
        } catch (error) {
            console.error(`Ошибка запроса ${method} ${url}:`, error);
            throw error;
        }
    }

    async function getCustomFields() {
        return await apiRequest('dealFields');
    }

    async function addCustomFields(missingFields: string[]) {
        for (const field of missingFields) {
            await apiRequest('dealFields', 'POST', {
                name: field,
                field_type: 'text',
            });
            console.log(`Кастомное поле "${field}" создано`);
        }
    }

    async function createDeal() {
        const data = { title: 'new deal' };
        isPending = true;

        try {
            const newDeal = await apiRequest('deals', 'POST', data);
            const dealFields = await getDealFields();

            const updatePromises = dealFields.map(
                (field: { name: string; key: string }) => {
                    if (field.name in formStore) {
                        return setDealFields(
                            newDeal.id,
                            field.key,
                            formStore[field.name],
                        );
                    }
                },
            );

            await Promise.all(updatePromises);
            console.log('Сделка успешно создана с выбранными полями!');
        } catch (error) {
            console.error('Ошибка создания сделки:', error);
        } finally {
            isPending = false;
            Object.keys(formStore).forEach((key) => delete formStore[key]);
        }
    }

    async function setDealFields(dealId: number, key: string, value: string) {
        const data = { [key]: value };
        await apiRequest(`deals/${dealId}`, 'PUT', data);
        console.log(`Поле ${key} обновлено значением: ${value}`);
    }

    async function getDealFields() {
        const fields = await getCustomFields();
        return fields.filter((field: { name: string; key: string }) =>
            customFields.includes(field.name),
        );
    }
</script>

<div class="Page">
    <div class="FormsWrapper">
        {#each Object.keys(forms) as form}
            <Form title={form}>
                {#each forms[form] as row}
                    <div class="row">
                        {#each row as input}
                            <Input data={input} />
                        {/each}
                    </div>
                {/each}
            </Form>
        {/each}
    </div>
    <div class="buttonWrapper">
        <button
            onclick={createDeal}
            style="background-color: {isPending ? 'yellow' : 'lightgrey'};"
            >{isPending ? '...Pending' : 'Create job'}</button
        >
    </div>
</div>
