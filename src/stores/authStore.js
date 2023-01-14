import { defineStore } from 'pinia'
import {
    onAuthStateChanged,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {auth} from "@/plugins/firebase";
import router from "@/plugins/router.js";

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
    }),
    actions: {
        async login() {
            this.loadingUser = true;
            try {
                const provider = new GithubAuthProvider();
                const { user } = await signInWithPopup(auth, provider);
                this.userData = user;
                await router.push("/");
            }catch (e) {
                console.log(e)
            }finally {
                this.loadingUser = false;
            }
        },
        async logout() {
            try {
                await signOut(auth);
                this.userData = null;
                await router.push("/login");
            }catch (e) {
                console.log(e)
            }
        },
        async checkSession() {
            return new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(
                    auth,
                    (user) => {
                        if (user) {
                            this.userData = user;
                        } else {
                            this.userData = null;
                        }
                        resolve(user);
                    },
                    (e) => reject(e)
                );
                unsubscribe();
            });
        }
    }
})