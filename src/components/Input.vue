<template>
  <div>
  <!-- <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label> -->
      <div class="flex">
        <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <UserCircleIcon class="size-5"/>
        </span>
        <input type="text" id="website-admin" class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="elonmusk">
      </div>
  </div>
</template>


<script lang="ts" setup>
import { Bars3Icon, UserCircleIcon, UserIcon } from '@heroicons/vue/24/solid'
</script>