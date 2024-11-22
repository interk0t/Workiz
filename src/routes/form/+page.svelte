<script>
    import Form from '../../components/Form/index.svelte';
    import Input from '../../components/Input/index.svelte';
    import { forms } from '../../store/index.svelte';
    import './styles.sass';
    let title = '';
    let value = '';
    let currency = 'USD';

    function sendDataToParent() {
        if (!title || !value || !currency) {
            alert('Все поля должны быть заполнены!');
            return;
        }

        const data = { title, value, currency };
        window.parent.postMessage(data, window.location.origin);
    }
</script>

<h1>Форма для создания сделки</h1>
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

<!-- <form
    on:submit|preventDefault={() => {
        sendDataToParent();
    }}
>
    <label>
        Название сделки:
        <input type="text" bind:value={title} required />
    </label>
    <br />
    <label>
        Сумма сделки:
        <input type="number" bind:value required />
    </label>
    <br />
    <label>
        Валюта:
        <input type="text" bind:value={currency} />
    </label>
    <br />
    <button type="submit">Отправить</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
    }
</style> -->
