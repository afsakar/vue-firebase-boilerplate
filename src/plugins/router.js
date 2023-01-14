import {createRouter, createWebHistory} from 'vue-router';
import auth from "@/middleware/auth.js";
import authCheck from "@/middleware/authCheck.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Layout',
            component: () => import('@/components/Layout.vue'),
            children: [
                {
                    path: '/',
                    component: () => import('@/pages/Home.vue'),
                },
            ],
            meta: {
                middleware: [auth]
            }
        },
        {
            path: '/auth',
            name: 'AuthLayout',
            component: () => import('@/components/AuthLayout.vue'),
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: () => import('@/pages/Login.vue')
                },
            ],
            meta: {
                middleware: [authCheck]
            }
        },
        {
            name: 'NotFound',
            path: '/:pathMatch(.*)*',
            component: () => import('@/pages/NotFound.vue')
        }
    ]
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Then run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({...context, next: nextMiddleware});
    }

    return next();
});

export default router;