<template>
  <Layout view="shh scc sff">
    <LayoutSidebar side="left" responsive :visible="sidebar">

      <!-- MessengerContactList -->
      <Layout view="hhh ccc">
        <LayoutHeader>
          <Toolbar mode="justify-between">
            <Input/>
          </Toolbar>
        </LayoutHeader>
        <LayoutContent>
          <Menu>
            <MenuItem :title="contact.name" v-for="contact in contacts">
              <template #avatar>
                <UserCircleIcon class="size-7 text-gray-300"/>
              </template>
            </MenuItem>
          </Menu>
        </LayoutContent>
      </Layout>

    </LayoutSidebar>

    <LayoutHeader>
      <Toolbar mode="justify-between">
        <Button @click="onMenuBtnClick">
          <Bars3Icon class="size-8" />
        </Button>
        <Button>
          <UserCircleIcon class="size-8" />
        </Button>
      </Toolbar>
    </LayoutHeader>
    <LayoutContent class="p-1">
      <MessengerMessage name="Alexander" :message="message.message" :datetime="message.datetime" :mode="message.mode" v-for="message in messages">
        <template #icon>
          <UserCircleIcon class="text-gray-300 size-12"/>
        </template>
      </MessengerMessage>
    </LayoutContent>
    <LayoutFooter>
      <Toolbar>
        <Input/>
      </Toolbar>
    </LayoutFooter>
  </Layout>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { Bars3Icon, UserCircleIcon, UserIcon } from '@heroicons/vue/24/solid'
import Layout from '../components/layout/Layout.vue'
import Toolbar from '../components/Toolbar.vue'
import Menu from '../components/Menu.vue'
import MenuItem from '../components/MenuItem.vue'
import LayoutHeader from '../components/layout/LayoutHeader.vue'
import LayoutFooter from '../components/layout/LayoutFooter.vue'
import LayoutSidebar from '../components/layout/LayoutSidebar.vue'
import LayoutContent from '../components/layout/LayoutContent.vue'
import MessengerMessage from '../components/MessengerMessage.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'


function onMenuBtnClick() {
  sidebar.value = !sidebar.value
}


const messages: Ref<{mode: 'received' | 'sended', name: string, datetime: string, message: string}[]> = ref([
  {name:'Ann', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', datetime: '11:46', mode: 'received'},
  {name:'Ann', message: 'Nunc sed arcu hendrerit, auctor nunc vitae, commodo enim', datetime: '11:46', mode: 'received'},
  {name:'Alex', message: 'Curabitur et augue faucibus, malesuada sem eget, viverra ante', datetime: '11:46', mode: 'sended'},
  {name:'Alex', message: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae', datetime: '11:46', mode: 'sended'},
  {name:'Ann', message: 'Morbi lobortis risus a urna posuere, luctus mattis sapien condimentum', datetime: '11:46', mode: 'received'},
  {name:'Ann', message: 'Aenean condimentum tellus sed vestibulum tempus. Donec mattis, nulla eget ultrices porttitor, tellus ipsum porta est, vitae sodales nunc quam sed sem', datetime: '11:46', mode: 'received'},
  {name:'Alex', message: 'Pellentesque fringilla porttitor quam, quis egestas est faucibus nec', datetime: '11:46', mode: 'sended'},
  {name:'Alex', message: 'Curabitur finibus sed risus in semper', datetime: '11:46', mode: 'sended'},
  {name:'Ann', message: 'Quisque ultrices massa eget eleifend pulvinar', datetime: '11:46', mode: 'received'},
  {name:'Ann', message: 'Vestibulum non mi et turpis egestas viverra', datetime: '11:46', mode: 'received'},
  {name:'Alex', message: 'Fusce elementum magna in urna varius finibus', datetime: '11:46', mode: 'sended'},
  {name:'Alex', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', datetime: '11:46', mode: 'sended'},
  {name:'Ann', message: 'Donec sollicitudin metus augue, eu fermentum eros finibus sed', datetime: '11:46', mode: 'received'},
  {name:'Ann', message: 'Mauris faucibus magna eu elementum placerat', datetime: '11:46', mode: 'received'},
  {name:'Alex', message: 'Nulla suscipit tempus arcu, id fringilla ipsum tincidunt vitae', datetime: '11:46', mode: 'sended'},
  {name:'Alex', message: 'Quisque ut justo interdum, elementum risus at, cursus urna', datetime: '11:46', mode: 'sended'},
])

const contacts: Ref<{name: string}[]> = ref([
  {name:'Alexander'},
  {name:'Julia'},
  {name:'Chuck'},
  {name:'Bob'},
  {name:'Johne'},
  {name:'Tony'},
  {name:'Tim'},
  {name:'Brown'},
  {name:'Jack'},
  {name:'Alex'},
])

const sidebar = ref(true)

</script>
