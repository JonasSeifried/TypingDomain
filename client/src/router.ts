import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
    meta: {
      title: "Home",
    },
  },
  { path: "/auth", component: () => import("./views/auth/AuthUser.vue"), meta: { title: "Login" } },
  {
    path: "/ffa/lobby",
    component: () => import("./views/FreeForAll/FreeForAllLobby.vue"),
    meta: { title: "FFA Lobby", requiresAuth: true },
  },
  {
    path: `/ffa/room/:roomId`,
    component: () => import("./views/FreeForAll/FreeForAll.vue"),
    meta: { title: "FFA", requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// router.beforeEach(async (to) => {
//   const auth = useAuthStore();
//   await auth.authReady();
//   if (to.meta.requiresAuth && !auth.isSignedIn) {
//     auth.returnURL = to.fullPath;
//     console.debug("Redirecting to", AuthUserRoute);
//     return AuthUserRoute;
//   }
// });

router.afterEach(async (to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});
