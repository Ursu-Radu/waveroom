<script lang="ts">
    import {
        createEmailPassword,
        currentUser,
        signInEmailPassword,
        signInGoogle,
        verifyEmail,
    } from "./firebase/auth";
    import { setUserData } from "./firebase/firestore";

    const googleLogo =
        "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";

    let creatingUser = false;
    let signInError = "";
    let createUserError = "";

    let blockInput = false;

    let email = "";
    let password = "";

    let username = "";
</script>

<div class="bg">
    <img src="assets/logo.png" alt="logo" />
    <div class="form_container">
        {#if $currentUser == null}
            <button
                on:click={async () => {
                    blockInput = true;
                    signInGoogle()
                        .then(credential => {
                            blockInput = false;
                            setUserData(credential.user.uid, {
                                photo: credential.user.photoURL,
                                username: credential.user.displayName,
                            });
                        })
                        .catch(() => {
                            blockInput = false;
                        });
                }}
                disabled={blockInput}
            >
                <img src={googleLogo} alt="google logo" /> Continue with Google
            </button><br />

            {#if creatingUser}
                <div>
                    Username: <input
                        style:margin-left="8px"
                        type="text"
                        bind:value={username}
                        disabled={blockInput}
                    />
                </div>
            {/if}

            <div>
                E-mail: <input
                    style:margin-left="8px"
                    type="email"
                    bind:value={email}
                    disabled={blockInput}
                />
            </div>
            <div>
                Password: <input
                    style:margin-left="8px"
                    type="password"
                    bind:value={password}
                    disabled={blockInput}
                />
            </div>
            {#if creatingUser}
                <div>
                    <button
                        on:click={() => {
                            blockInput = true;
                            createEmailPassword(email, password)
                                .then(credential => {
                                    blockInput = false;
                                    setUserData(credential.user.uid, {
                                        username,
                                    });
                                    verifyEmail(credential.user);
                                })
                                .catch(reason => {
                                    blockInput = false;
                                    if (reason.code == "auth/invalid-email") {
                                        createUserError = "Invalid e-mail";
                                    } else if (
                                        reason.code ==
                                        "auth/email-already-in-use"
                                    ) {
                                        createUserError =
                                            "E-mail already in use";
                                    } else if (
                                        reason.code == "auth/weak-password"
                                    ) {
                                        createUserError = "Password too weak";
                                    }
                                    console.log(
                                        JSON.stringify(reason, null, 4)
                                    );
                                });
                        }}
                        disabled={blockInput}
                        style:display="inline-block">Create User</button
                    >
                    {#if createUserError != ""}
                        <span style:color="#FF9B77" style:margin-left="8px"
                            >{createUserError}</span
                        >
                    {/if}
                </div>
                <br />
                <div>
                    Already have an account? <button
                        style:display="inline-block"
                        style:margin-left="8px"
                        on:click={() => (creatingUser = false)}
                        disabled={blockInput}>Log in</button
                    >
                </div>
            {:else}
                <div>
                    <button
                        on:click={() => {
                            blockInput = true;
                            signInEmailPassword(email, password)
                                .then(() => {
                                    blockInput = false;
                                })
                                .catch(reason => {
                                    blockInput = false;
                                    if (reason.code == "auth/user-not-found") {
                                        signInError = "User not found";
                                    } else if (
                                        reason.code == "auth/invalid-email"
                                    ) {
                                        signInError = "Invalid e-mail";
                                    } else if (
                                        reason.code == "auth/wrong-password"
                                    ) {
                                        signInError = "Wrong password";
                                    }
                                });
                        }}
                        disabled={blockInput}
                        style:display="inline-block">Sign In</button
                    >
                    {#if signInError != ""}
                        <span style:color="#FF9B77" style:margin-left="8px"
                            >{signInError}</span
                        >
                    {/if}
                </div>
                <br />
                <div>
                    Don't have an account? <button
                        style:display="inline-block"
                        style:margin-left="8px"
                        on:click={() => (creatingUser = true)}
                        disabled={blockInput}>Create one!</button
                    >
                </div>
            {/if}
        {:else}
            <span
                >You must verify your account before you can continue. Refresh
                the page after doing so.</span
            ><br /><br />
            <span
                >We have sent you an email containing a verification link. If
                you can't find it, check your spam folder.</span
            >
        {/if}
    </div>
</div>

<style>
    .bg {
        width: min(600px, 80%);
        height: min(600px, 80%);
        background-color: #111a;
        border-radius: 8px;
        backdrop-filter: blur(100px) saturate(175%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #fff1;
        padding: 30px;
        padding-bottom: 50px;
        box-shadow: 0 8px 24px 0 #0008;
        font-family: Cabin;
        font-size: 18px;
        color: white;
        overflow-y: auto;
    }
    .bg > img {
        width: 60%;
        filter: drop-shadow(0px 4px 6px #0008);
        margin-bottom: 20px;
    }
    .form_container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        text-align: center;
    }
</style>
