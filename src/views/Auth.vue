<template lang="pug">
    .auth
        v-card.authCard.elevation-12
            // Sign In
            template(v-if="typeForm === 0")
                v-card-title Welcome
                v-card-subtitle Don't have an account?
                    span.card__link(@click="typeForm = 1")  Sign Up Free
                v-card-text
                    template(v-if="signInSuccess")
                        p.body-1 Your account is not verified, please check your email.
                        .text-center
                            v-btn(color="black" dark @click="toAuth").ma-0 Ok
                    v-form(ref="formSignIn" v-model="validSignIn" v-else)
                        v-text-field(v-model="emailSignIn" type="email" :rules="emailRules" label="E-mail" required outlined dense)
                        v-text-field(v-model="passwordSignIn" :rules="passwordRules" label="Password" required outlined dense
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPass = !showPass"
                            :type="showPass ? 'text' : 'password'")
                        p(v-if="signInError").red--text {{signInError}}
                        v-btn(color="default" block :disabled="!validSignIn" @click="signIn").ma-0 Submit
                        br
                        p.text-right.card__link(@click="typeForm = 2") Forgot your password?
            // Sign Up
            template(v-if="typeForm === 1")
                v-card-title Create account
                v-card-subtitle Already have an account?
                    span.card__link(@click="typeForm = 0")  Log In
                v-card-text
                    template(v-if="signUpSuccess")
                        p.body-1 Thank you for registering, a confirmation email has been sent.
                        .text-center
                            v-btn(color="black" dark @click="toAuth").ma-0 Ok
                    v-form(ref="formSignUp" v-model="validSignUp" v-else)
                        v-text-field(v-model="name" counter="16" :rules="nameRules" label="Name" outlined dense)
                        v-text-field(v-model="emailSignUp" type="email" :rules="emailRules" label="E-mail" required outlined dense)
                        v-text-field(v-model="passwordSignUp" :rules="passwordRules" label="Password" required outlined dense
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPass = !showPass"
                            :type="showPass ? 'text' : 'password'")
                        v-text-field(v-model="confirmPasswordSignUp" :rules="[confirmPasswordRules,passMatches(passwordSignUp, confirmPasswordSignUp)]" type="password" label="Confirm password" required outlined dense)
                        p(v-if="signUpError").red--text {{signUpError}}
                        v-btn(color="default" :disabled="!validSignUp" block @click="signUp").ma-0 Submit
            // Password Reset
            template(v-if="typeForm === 2")
                v-card-title Forgot password?
                v-card-subtitle Submit the email you signed up with to reset your password.
                    span.card__link(@click="typeForm = 0")  Go back
                v-card-text
                    template(v-if="resetPassSuccess")
                        p.body-1 The password has been reset, check your mail.
                        .text-center
                            v-btn(color="black" dark @click="toAuth").ma-0 Ok
                    v-form(ref="formPasswordReset" v-model="validPasswordReset" v-else)
                        v-text-field(v-model="emailPasswordReset" type="email" :rules="emailRules" label="E-mail" required outlined dense)
                        p(v-if="resetPassError").red--text {{resetPassError}}
                        v-btn(color="default" block :disabled="!validPasswordReset" @click="passwordReset").ma-0 Submit
            // Password Change
            template(v-if="typeForm === 3")
                v-card-title Change password
                v-card-subtitle
                    span.card__link(@click="typeForm = 0") Go to sign in
                v-card-text
                    template(v-if="resetPassConfirmSuccess")
                        p.body-1 Thank you, your password has been changed.
                        .text-center
                            v-btn(color="black" dark @click="toAuth").ma-0 Ok
                    v-form(ref="formPasswordChange" v-model="validPasswordChange" v-else)
                        v-text-field(v-model="passwordChange" :rules="passwordRules" label="Password" required outlined dense
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPass = !showPass"
                            :type="showPass ? 'text' : 'password'")
                        v-text-field(v-model="confirmPasswordChange" :rules="[confirmPasswordRules,passMatches(passwordChange, confirmPasswordChange)]" type="password" label="Confirm password" required outlined dense)
                        p(v-if="resetPassConfirmError").red--text {{resetPassConfirmError}}
                        v-btn(color="default" block :disabled="!validPasswordChange" @click="onPasswordChange").ma-0 Submit
            // Invalid Code
            template(v-if="applyCodeError && typeForm > 3")
                v-card-title Invalid code.
                v-card-subtitle {{applyCodeError}}
                v-card-text.text-center
                    v-btn(color="black" dark @click="toAuth").ma-0 Ok
            // Email Verified.
            template(v-if="applyCodeSuccess && typeForm > 3")
                v-card-title Email verified.
                v-card-subtitle Your email is verified, you can sign in.
                v-card-text.text-center
                    v-btn(color="black" dark @click="toAuth").ma-0 Ok
</template>

<script>
    export default {
        name: 'Auth',
        data: () => ({
            validSignIn: false,
            validSignUp: false,
            validPasswordReset: false,
            validPasswordChange: false,
            name: '',
            nameRules: [
                v => (v.length <= 16) || 'Name must be less than 16 characters',
            ],
            emailSignIn: '',
            emailSignUp: '',
            emailPasswordReset: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordSignIn: '',
            passwordSignUp: '',
            passwordChange: '',
            showPass: false,
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8 && v.length <= 128) || 'Password must be more than 8 characters and less than 128 characters',
            ],
            confirmPasswordSignUp: '',
            confirmPasswordChange: '',
            confirmPasswordRules: v => !!v || 'Password is required',
            typeForm: null,
            code: null,
        }),
        computed: {
            router() { return this.$route.query; },
            // user
            user() { return this.$store.getters.user},
            emailVerify() { return this.$store.getters.user },
            userActivated() { return this.emailVerify && this.user},
            // signIn
            signInError() { return this.$store.getters.signInError || null },
            signInSuccess() { return this.$store.getters.signInSuccess || null },
            // signUp
            signUpError() { return this.$store.getters.signUpError || null },
            signUpSuccess() { return this.$store.getters.signUpSuccess || null },
            // Reset Pass
            resetPassError() { return this.$store.getters.resetPassError || null },
            resetPassSuccess() { return this.$store.getters.resetPassSuccess || null },
            // Reset Pass Confirm
            resetPassConfirmError() { return this.$store.getters.resetPassConfirmError || null },
            resetPassConfirmSuccess() { return this.$store.getters.resetPassConfirmSuccess || null },
            // Apply Code
            applyCodeError() { return this.$store.getters.applyCodeError || null },
            applyCodeSuccess() { return this.$store.getters.applyCodeSuccess || null },
        },
        methods: {
            passMatches(p1, p2) {
                return () => {
                    return (p1 === p2) || 'Password must match'
                }
            },
            reset () {
                this.$refs.form.reset()
            },
            resetValidation () {
                this.$refs.form.resetValidation()
            },
            signUp(){
                if (this.$refs.formSignUp.validate()) {
                    this.$store.dispatch('signUp', {
                        email: this.emailSignUp,
                        password: this.passwordSignUp
                    });
                }
            },
            signIn(){
                if (this.$refs.formSignIn.validate()) {
                    this.$store.dispatch('signIn', {
                        email: this.emailSignIn,
                        password: this.passwordSignIn
                    });
                }
            },
            passwordReset() {
                if (this.$refs.formPasswordReset.validate()) {
                    this.$store.dispatch('resetPass', this.emailPasswordReset);
                }
            },
            onPasswordChange() {
                if (this.$refs.formPasswordChange.validate()) {
                    this.$store.dispatch('resetPassConfirm', {
                        code: this.code,
                        password: this.passwordChange
                    });
                }
            },
            toAuth() {
                this.typeForm = 0;
                this.code = null;
                if (Object.keys(this.router).length) {
                    this.$router.replace({'query': null});
                }
                this.showPass = false;
            }
        },
        mounted() {
            this.code = this.router && this.router.oobCode;
            if(this.code) {
                const mode = this.router && this.router.mode;
                switch (mode) {
                    case 'resetPassword':
                        this.typeForm = 3;
                        break;
                    case 'verifyEmail':
                        this.$store.dispatch('applyCode', this.code);
                        this.typeForm = 4;
                        break;
                }
            } else {
                this.typeForm = 0;
            }
        }
    }
</script>

<style scoped lang="sass">
    $imageURL: 'https://images.hdqwalls.com/download/nature-dream-4k-up-1600x900.jpg'

    .auth
        height: 100%
        width: 100%
        display: flex
        align-items: center
        justify-content: center
        position: relative
        &:before
            content: ''
            display: block
            background: #fff url($imageURL) center center no-repeat
            background-size: cover
            position: absolute
            top: 0
            bottom: 0
            left: 0
            z-index: 0
            right: calc(50% + 7.5em)
    .authCard
        max-width: 95%
        min-width: 50%
    .card__link
        cursor: pointer
        color: #007bff
        &:hover
            text-decoration: underline
</style>
