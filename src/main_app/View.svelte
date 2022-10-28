<script lang="ts">
    import type { User } from "firebase/auth";
    import WaveroomButton from "../ui/WaveroomButton.svelte";
    import { currentPhoto, currentUsername, signOut } from "../firebase/auth";
    import { setUserData } from "../firebase/firestore";
    import { playPlayer } from "./player";
    import WaveroomTextInput from "../ui/WaveroomTextInput.svelte";
    import WaveroomImgButton from "../ui/WaveroomImgButton.svelte";

    export let loggedInUser: User;

    enum ProfileMenu {
        Settings,
        LogOut,
    }
    let currentProfileMenu = null;

    let usernameEdit = "";
</script>

<div class="view">
    <div class="profile_menu">
        <div
            style="display: flex; justify-content: flex-end; align-items: center; gap: 16px"
        >
            {$currentUsername}
            <img
                src={$currentPhoto}
                alt="profile"
                class="profile_picture"
                width="50"
                height="50"
            />
        </div>
        <div class="buttons">
            <WaveroomImgButton
                img="assets/gear.svg"
                alt="profile settings"
                imgStyle="width: 32px; height: 32px; opacity: 0.5"
                onClick={() => {
                    if (currentProfileMenu != ProfileMenu.Settings) {
                        currentProfileMenu = ProfileMenu.Settings;
                    } else {
                        currentProfileMenu = null;
                    }
                    usernameEdit = $currentUsername;
                }}
            />
            <WaveroomImgButton
                img="assets/logout.svg"
                alt="log out"
                imgStyle="width: 32px; height: 32px; opacity: 0.5"
                onClick={() => {
                    if (currentProfileMenu != ProfileMenu.LogOut) {
                        currentProfileMenu = ProfileMenu.LogOut;
                    } else {
                        currentProfileMenu = null;
                    }
                }}
            />
        </div>
    </div>
    {#if currentProfileMenu != null}
        <div class="menu_bg waveroom_panel">
            {#if currentProfileMenu == ProfileMenu.Settings}
                <div>
                    Username:
                    <WaveroomTextInput
                        type="text"
                        style="width: 150px; margin-left: 8px"
                        bind:value={usernameEdit}
                    />
                </div>
                <WaveroomButton
                    onClick={async () => {
                        await setUserData(loggedInUser.uid, {
                            username: usernameEdit,
                        });
                    }}>Apply</WaveroomButton
                >
            {:else if currentProfileMenu == ProfileMenu.LogOut}
                Are you sure you wish to log out?
                <WaveroomButton
                    onClick={() => {
                        signOut();
                    }}>Yes</WaveroomButton
                >
            {/if}
        </div>
    {/if}
    <WaveroomButton
        onClick={() => {
            playPlayer();
        }}>cock</WaveroomButton
    >
</div>

<style>
    .view {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .profile_menu {
        position: absolute;
        right: 0;
        margin: 24px;
        font-family: Cabin;
        font-size: 24px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    }
    .profile_picture {
        object-fit: cover;
        border-radius: 100px;
        border: 2px solid white;
    }
    .buttons {
        display: flex;
        gap: 8px;
    }
    .buttons > img {
        opacity: 0.5;
        transition: all 0.1s ease-in-out;
        cursor: pointer;
    }
    .buttons > img:hover {
        opacity: 0.75;
        transform: scale(1.1);
    }
    .menu_bg {
        position: absolute;
        width: 300px;
        height: 300px;
        top: 130px;
        right: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 16px;
    }
</style>
