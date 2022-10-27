<script lang="ts">
    import { currentPhoto, currentUsername } from "./firebase/auth";
</script>

<div class="view">
    <div class="profile_menu">
        <div
            style="display: flex; justify-content: flex-end; align-items: center; gap: 16px"
        >
            {$currentUsername}
            <img src={$currentPhoto} alt="profile" width="50" height="50" />
        </div>
    </div>
</div>

<style>
    .full {
        width: 100%;
        height: 100%;
    }
    .view {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .profile_menu {
        float: right;
        margin: 24px;
        font-family: Cabin;
        font-size: 24px;
        color: white;
    }
    .profile_menu img {
        object-fit: cover;
        border-radius: 100px;
        border: 2px solid white;
    }
</style>
