import { createWebHistory, createRouter } from 'vue-router'
import Home from './views/home.vue'
import Login from './views/login.vue'
import Registration from './views/registration.vue'
import { useUser } from './core/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      async beforeEnter(_, __, next) {
        const { user, fetchUser } = useUser()

        await fetchUser()

        if (user.value) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/registration', name: 'registration', component: Registration },
  ],
})

export default router
