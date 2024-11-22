<script lang="ts">
    import './styles.sass';
    let { data }: { title: string; options?: string[] } = $props();
    let selectedValue = $state('');
    let isOptions = $state(false);

    const handleSelectChange = (event: Event) => {
        const selectedOption = (event.target as HTMLSelectElement).value;
        selectedValue = selectedOption; // Вставляем выбранное в инпут
    };
</script>

<div class="Input" id="54">
    <input
        type="time"
        placeholder={data.title}
        bind:value={selectedValue}
        id={data.title.replace(' ', '')}
        onfocus={() => (isOptions = false)}
    />
    {#if data.options}
        <div
            class="select"
            onclick={() => (isOptions = !isOptions)}
            tabindex="0"
            onkeyup={null}
            role="button"
        ></div>
        {#if isOptions}
            <div class="options">
                {#each data.options as option}
                    <div
                        tabindex="0"
                        onkeyup={null}
                        role="button"
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
