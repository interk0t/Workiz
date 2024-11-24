<script lang="ts">
    import './styles.sass';
    let { children, title } = $props();
</script>

<form class="Form">
    <span>{title}</span>
    {@render children()}
</form>
