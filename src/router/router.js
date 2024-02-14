// Essentials
import { createRouter, createWebHistory } from "vue-router";
import store from '../store/store'

// Views
import Home from '@/views/Home/Home.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Signup from '@/views/SignUp/SignUp.vue'
import Signin from '@/views/SignIn/SignIn.vue'
import Challenge from '@/views/Challenge/Challenge.vue'
import Join from '@/views/Join/Join.vue'
import ChallengeView from '@/views/ChallengeView/ChallengeView.vue'
import Gamepage from '@/views/Gamepage/Gamepage.vue'
import EditProfile from '@/views/EditProfile/EditProfile.vue'
import Error from '@/views/ErrorPage/Error.vue'


// Routes
const routes = [{
    path: '/',
    name: 'Home',
    component: Home
}, {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true}
}, {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresGuest: true}
},
 {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    meta: { requiresGuest: true}
}, {
    path: '/challenge',
    name: 'Challenge',
    component: Challenge,
    meta: { requiresAuth: true}
}, {
    path: '/join',
    name: 'Join',
    component: Join,
    meta: { requiresAuth: true }
}, {
    path: '/challenge-view/:id',
    name: 'ChallengeView',
    component: ChallengeView,
    meta: { requiresAuth: true}
}
, {
    path: '/game',
    name: 'Gamepage',
    component: Gamepage,
    meta: { requiresAuth: true}
}, {
    path: '/editprofile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true}
}, {
    path: '/error',
    name: 'Error',
    component: Error,
    // meta: { requiresAuth: true}
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    // Wait until the authentication state is ready
    await store.dispatch('waitForAuth');

    const isAuthenticated = store.state.user !== null;
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({
          path: '/signin',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (isAuthenticated) {
        next({
          path: '/dashboard',
          // query: {
          //   redirect: to.fullPath
          // }
        });
      } else {
        next();
      }
    } 
    else {
      next();
    }
  });

export default router