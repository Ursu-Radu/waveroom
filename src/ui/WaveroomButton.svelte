<script lang="ts">
    export let style = "";
    export let onClick = () => {};
    export let disabled = false;
</script>

<button on:click={onClick} {style} {disabled}><slot /></button>

<style>
    button {
        background-color: #1118;

        border: 1px solid #fff1;
        border-radius: 8px;
        padding: 8px;
        padding-left: 12px;
        padding-right: 12px;
        color: white;
        font-family: Cabin;
        font-size: 18px;

        transition: background-color 0.15s, transform 0.08s;
        box-shadow: 0 4px 12px 0 #0005;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    button:enabled:hover {
        background-color: #2228;
    }
    button:enabled:active {
        background-color: #3338;
        transform: scale(0.9);
    }
    button:disabled {
        opacity: 0.5;
    }
</style>
