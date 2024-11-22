<script lang="ts">
    import './styles.sass';

    let { children, title } = $props();
</script>

<div class="Form">
    <span>{title}</span>
    {@render children()}
</div>
