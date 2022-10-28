<script lang="ts">
    export let type;
    export let style = "";
    export let value = "";
    export let disabled = false;
</script>

{#if type == "text"}
    <input type="text" bind:value {style} {disabled} />
{:else if type == "email"}
    <input type="email" bind:value {style} {disabled} />
{:else}
    <input type="password" bind:value {style} {disabled} />
{/if}

<style>
    input {
        border: none;
        border: 1px solid #fff1;
        color: white;
        font-family: Cabin;
        font-size: 18px;
        padding: 6px;
        padding-left: 8px;
        padding-right: 8px;
        background-color: #1118;
        border-radius: 4px;
        box-shadow: 0 4px 12px 0 #0005;
    }

    input:disabled {
        opacity: 0.5;
    }
</style>
