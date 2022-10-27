<script lang="ts">
    import AuthScreen from "./AuthScreen.svelte";
    import AuthBackground from "./AuthBackground.svelte";
    import { currentUser } from "./firebase/auth";
    import MainWindow from "./MainWindow.svelte";
    import Background from "./Background.svelte";
</script>

<div class="everything">
    {#if typeof $currentUser != "string"}
        {#if $currentUser == null || !$currentUser.emailVerified}
            <AuthBackground />
            <AuthScreen />
        {:else}
            <Background />
            <MainWindow />
        {/if}
    {/if}
</div>

<style>
    .everything {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
