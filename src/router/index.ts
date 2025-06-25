import { createRouter, createWebHistory } from 'vue-router'
import MessengerView from '../views/MessengerView.vue'
import MessengerContactListView from '../views/MessengerChatListView.vue'
import SettingsView from '../views/SettingsView.vue'


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
      name: 'contacts',
      component: MessengerContactListView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

export default router
