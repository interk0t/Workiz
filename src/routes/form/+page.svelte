<script lang="ts">
    import Form from '../../components/Form/index.svelte';
    import Input from '../../components/Input/index.svelte';
    import { forms, formStore } from '../../store/index.svelte';
    import {
        checkCustomFields,
        apiRequest,
        getDealFields,
        setDealFields,
    } from '../api/utils/index.js';
    import {
        handleTokenExchange,
        isAccessTokenExist,
    } from '../api/auth/index.js';
    import './styles.sass';
    import { onMount } from 'svelte';

    let isPending = $state(false);
    let authCode: string | null = null;

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        authCode = params.get('code');
        const API_TOKEN = await isAccessTokenExist();

        if (authCode && !API_TOKEN) {
            handleTokenExchange(authCode).then(() => {
                console.log('dasdad');
                checkCustomFields();
            });
        }
        console.log('Auth Code:', authCode, 'Access Token:', API_TOKEN);
    });

    async function createDeal() {
        const data = { title: 'new deal' };
        isPending = true;

        try {
            const newDeal = await apiRequest('POST', {
                action: 'create_deal',
                endpoint: 'deals',
                data,
            });
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
