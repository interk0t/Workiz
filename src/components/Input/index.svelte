<script lang="ts">
    import './styles.sass';
    let { data }: { title: string } = $props();
    import Svelecte from 'svelecte';
    let selectedValue = $state('');
    let isOptions = $state(false);

    const handleSelectChange = (event: Event) => {
        const selectedOption = (event.target as HTMLSelectElement).value;
        selectedValue = selectedOption; // Вставляем выбранное в инпут
    };
</script>

<div class="Input">
    <input
        type={'time'}
        placeholder={data.title}
        bind:value={selectedValue}
        id={data.title.replace(' ', '')}
        onfocus={() => (isOptions = false)}
    />
    {#if data.options}
        <div class="select" onclick={() => (isOptions = !isOptions)}></div>
        {#if isOptions}
            <div class="options">
                {#each data.options as option}
                    <div
                        class="option"
                        onclick={() => (
                            (selectedValue = option), (isOptions = !isOptions)
                        )}
                    >
                        {option}
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>
