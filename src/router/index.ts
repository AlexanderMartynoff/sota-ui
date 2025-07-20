import { createRouter, createWebHistory } from 'vue-router'
import MessengerView from '../views/MessengerView.vue'
import MessengerContactListView from '../views/MessengerChatListView.vue'
import AccountView from '../views/AccountView.vue'
import LoginView from '../views/LoginView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/messanger/:chatId?',
      name: 'messenger',
      component: MessengerView,
      props: true,
    },
    {
      path: '/',
      name: 'contact-list',
      component: MessengerContactListView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
