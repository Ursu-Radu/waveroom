<script lang="ts">
    import WaveroomButton from "../ui/WaveroomButton.svelte";
    import WaveroomTextInput from "../ui/WaveroomTextInput.svelte";
    import {
        createEmailPassword,
        currentUser,
        signInEmailPassword,
        signInGoogle,
        verifyEmail,
    } from "../firebase/auth";
    import {
        createUserData,
        setUserData,
        userExists,
    } from "../firebase/firestore";

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
            <WaveroomButton
                onClick={async () => {
                    blockInput = true;
                    signInGoogle()
                        .then(async credential => {
                            blockInput = false;
                            if (!(await userExists(credential.user.uid))) {
                                await createUserData(
                                    credential.user.uid,
                                    credential.user.displayName,
                                    credential.user.photoURL
                                );
                            }
                        })
                        .catch(() => {
                            blockInput = false;
                        });
                }}
                disabled={blockInput}
                ><img src={googleLogo} alt="google logo" /> Continue with Google</WaveroomButton
            >
            <br />

            {#if creatingUser}
                <div>
                    Username: <WaveroomTextInput
                        type="text"
                        style="margin-left: 8px"
                        bind:value={username}
                        disabled={blockInput}
                    />
                </div>
            {/if}

            <div>
                E-mail: <WaveroomTextInput
                    type="email"
                    style="margin-left: 8px"
                    bind:value={email}
                    disabled={blockInput}
                />
            </div>
            <div>
                Password:
                <WaveroomTextInput
                    type="password"
                    style="margin-left: 8px"
                    bind:value={password}
                    disabled={blockInput}
                />
            </div>
            {#if creatingUser}
                <div>
                    <WaveroomButton
                        onClick={() => {
                            blockInput = true;
                            createEmailPassword(email, password)
                                .then(async credential => {
                                    blockInput = false;
                                    await createUserData(
                                        credential.user.uid,
                                        credential.user.displayName,
                                        null
                                    );
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
                        style="display: inline-block"
                        >Create User</WaveroomButton
                    >
                    {#if createUserError != ""}
                        <span style:color="#FF9B77" style:margin-left="8px"
                            >{createUserError}</span
                        >
                    {/if}
                </div>
                <br />
                <div>
                    Already have an account? <WaveroomButton
                        style="display: inline-block; margin-left: 8px"
                        onClick={() => (creatingUser = false)}
                        disabled={blockInput}>Log in</WaveroomButton
                    >
                </div>
            {:else}
                <div>
                    <WaveroomButton
                        style="display: inline-block"
                        onClick={() => {
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
                        disabled={blockInput}>Sign In</WaveroomButton
                    >
                    {#if signInError != ""}
                        <span style:color="#FF9B77" style:margin-left="8px"
                            >{signInError}</span
                        >
                    {/if}
                </div>
                <br />
                <div>
                    Don't have an account?
                    <WaveroomButton
                        style="display: inline-block; margin-left: 8px"
                        onClick={() => (creatingUser = true)}
                        disabled={blockInput}>Create one!</WaveroomButton
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
