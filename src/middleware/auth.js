import {useAuthStore} from "@/stores/authStore.js";

export default async function auth({next, router}) {
    const userStore = useAuthStore();
    userStore.loadingSession = true;
    const user = await userStore.checkSession();
    if (user) {
        next();
    } else {
        next("/login");
    }
    userStore.loadingSession = false;
}