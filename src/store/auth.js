import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import router from '../router'


export default {
    state: {
        // user
        isAuth: false,
        user: null,
        userVerified: false,

        // Sign In
        signInSuccess: null,
        signInError: null,

        // Sign Up
        signUpSuccess: null,
        signUpError: null,

        // Reset Password
        resetPassSuccess: null,
        resetPassError: null,

        // Reset Password Confirm
        resetPassConfirmSuccess: null,
        resetPassConfirmError: null,

        // Apply Code
        applyCodeSuccess: null,
        applyCodeError: null,
    },
    getters: {
        isAuth: state=>state.isAuth,
        user: state=>state.user,
        userVerified: state=>state.userVerified,

        signInSuccess: state=>state.signInSuccess,
        signInError: state=>state.signInError,

        signUpSuccess: state=>state.signUpSuccess,
        signUpError: state=>state.signUpError,

        resetPassSuccess: state=>state.resetPassSuccess,
        resetPassError: state=>state.resetPassError,

        resetPassConfirmSuccess: state=>state.resetPassConfirmSuccess,
        resetPassConfirmError: state=>state.resetPassConfirmError,

        applyCodeSuccess: state=>state.applyCodeSuccess,
        applyCodeError: state=>state.applyCodeError,
    },
    mutations: {
        isAuth:(state,payload)=>{state.isAuth = payload},
        user:(state,payload)=>{state.user = payload},
        userVerified:(state,payload)=>{state.userVerified = payload},

        signInSuccess:(state,payload)=>{state.signInSuccess = payload},
        signInError:(state,payload)=>{state.signInError = payload},

        signUpSuccess:(state,payload)=>{state.signUpSuccess = payload},
        signUpError:(state,payload)=>{state.signUpError = payload},

        resetPassSuccess:(state,payload)=>{state.resetPassSuccess = payload},
        resetPassError:(state,payload)=>{state.resetPassError = payload},

        resetPassConfirmSuccess:(state,payload)=>{state.resetPassConfirmSuccess = payload},
        resetPassConfirmError:(state,payload)=>{state.resetPassConfirmError = payload},

        applyCodeSuccess:(state,payload)=>{state.applyCodeSuccess = payload},
        applyCodeError:(state,payload)=>{state.applyCodeError = payload},
    },
    actions: {
        signIn: (state, {email, password})=>{
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(respond=>{
                    if (respond.user) {
                        state.commit('user', respond.user.uid);
                        state.commit('userVerified', respond.user.emailVerified);
                        state.commit('signInError', null);

                        if (respond.user.emailVerified) {
                            state.dispatch('globalLoading', true);
                            state.dispatch('createUser', respond.user);
                            router.push('/');
                        } else {
                            state.commit('signInError', 'Your account is not verified, please check your email inbox');
                        }
                    }
                })
                .catch(error=>{
                    state.commit('signInError', error.message);
                    console.log('sign in error', error);
                });
        },
        signUp: (state, {email, password})=>{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(respond=>{
                    state.commit('user', respond.user.uid);
                    state.commit('signUpError', null);
                    state.dispatch('emailVerify', respond.user);
                })
                .catch(error=>{
                    state.commit('signUpError', error.message);
                    state.commit('user', null);
                });
        },
        signOut: (state)=>{
            firebase.auth().signOut()
                .then(respond=>{
                    state.commit('user',null);
                    state.commit('isAuth',false);
                })
                .catch(error=>{
                    console.log(error);
                })
        },
        createUser(state, user) {
            const userDoc = firebase.firestore().collection('Users').doc(user.uid);
            userDoc.get().then(respond=>{
                if (!respond.exists) {
                    userDoc.set({
                        image: null,
                        name: user.displayName,
                        settings: {
                            source: { value: "en", name: "English" },
                            target: { value: "ru", name: "Russian" },
                            words: 100
                        }
                    });
                }
            })
        },
        emailVerify(state, user) {
            const _user = user || firebase.auth().currentUser;
            _user.sendEmailVerification().then(respond=>{
                state.commit('signUpSuccess', true);
            }).catch(error=>{
                state.commit('userVerified', null);
                state.commit('signUpSuccess', null);
                state.commit('signUpError', error.message);
                console.log('Send email verification error', error);
            });
        },
        resetPass(state, password) {
            firebase.auth().sendPasswordResetEmail(password)
                .then(respond=>{
                    state.commit('resetPassSuccess', true);
                }).catch(error=>{
                    state.commit('resetPassError', error.message);
                    console.log('Password reset error', error);
                })
        },
        resetPassConfirm(state, {code, password}) {
            firebase.auth().confirmPasswordReset(code, password)
                .then(respond => {
                    state.commit('resetPassConfirmSuccess', true);
                }).catch(error => {
                    state.commit('resetPassConfirmError', error.message);
                })
        },
        user:(state,payload)=>state.commit('user',payload),
        isAuth:(state,payload)=>state.commit('isAuth',payload),
        checkCode(state,payload) {
            firebase.auth().checkActionCode(payload).then(respond=>{
                console.log(respond);
            }).catch(error=>{
                console.log(error);
            })
        },
        applyCode(state,payload) {
            firebase.auth().applyActionCode(payload).then(respond=>{
                state.commit('applyCodeError', null);
                state.commit('applyCodeSuccess', true);
                console.log('applyCodeSuccess', respond);
            }).catch(error=>{
                state.commit('applyCodeSuccess', false);
                state.commit('applyCodeError', error.message);
                console.error('Activation code error', error);
                console.log(error);
            })
        }
    },
}
