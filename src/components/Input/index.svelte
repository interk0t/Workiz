<script lang="ts">
    import { formStore } from '../../store/index.svelte.js';
    import './styles.sass';

    interface InputProps {
        data: { title: string; options?: string[] };
    }

    let { data }: InputProps = $props();

    let isOptions = $state(false);

    function setType() {
        if (data.title === 'Start time' || data.title === 'End time') {
            return 'time';
        } else if (data.title === 'Start date') {
            return 'date';
        } else {
            return 'text';
        }
    }
</script>

<div class="Input" id="54">
    <input
        type={setType()}
        placeholder={data.title}
        bind:value={formStore[data.title]}
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
                            (formStore[data.title] = option),
                            (isOptions = !isOptions)
                        )}
                    >
                        {option}
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>
