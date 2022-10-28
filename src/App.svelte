<script lang="ts">
    import AuthScreen from "./auth_ui/AuthScreen.svelte";
    import AuthBackground from "./auth_ui/AuthBackground.svelte";
    import { currentUser } from "./firebase/auth";
    import MainWindow from "./main_app/View.svelte";
    import Background from "./main_app/Background.svelte";
</script>

<div class="everything">
    {#if typeof $currentUser != "string"}
        {#if $currentUser == null || !$currentUser.emailVerified}
            <AuthBackground />
            <AuthScreen />
        {:else}
            <Background />
            <MainWindow loggedInUser={$currentUser} />
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
