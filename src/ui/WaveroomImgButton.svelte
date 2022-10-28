<script lang="ts">
    export let img: string;
    export let alt: string;
    export let style = "";
    export let imgStyle = "";
    export let onClick = () => {};
    export let disabled = false;
</script>

<button on:click={onClick} {style} {disabled}>
    <img src={img} {alt} style={imgStyle} draggable="false" /></button
>

<style>
    button {
        background-color: #1118;
        padding: 0;
        margin: 0;
        outline: none;
        border: none;
        cursor: pointer;
        transition: transform 0.08s;
        min-height: 0;
        min-width: 0;
        border-radius: 2px;
    }
    button > img {
        display: block;
    }
    button:hover {
        transform: scale(1.1);
    }
    button:active {
        transform: scale(0.9);
    }
</style>
