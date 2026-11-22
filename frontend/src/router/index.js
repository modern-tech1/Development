import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Contact from '../views/Contact.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',
       component: HomeView },
    {
       path: '/admin/login',
        component: AdminLogin },
    { 
      path: '/admin', 
      component: AdminDashboard, meta: { requiresAdmin: true }
     },
    
     {
      path:'/Contact',
      component:Contact
         }
  ],
  scrollBehavior: () => ({ top: 0 }),
})
router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !localStorage.getItem('gospelhub_token')) return '/admin/login'
  if (to.path === '/admin/login' && localStorage.getItem('gospelhub_token'));
})
export default router
