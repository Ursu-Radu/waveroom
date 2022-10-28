import "./global.css";
import App from "./App.svelte";

import { signOut } from "./firebase/auth";
import { createRoom } from "./firebase/firestore";

const app = new App({
    target: document.getElementById("app"),
});
createRoom("farter");
export default app;
