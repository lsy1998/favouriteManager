<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>

    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <div v-for="item in linkListData">{{ item.linkTitle }}</div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import * as model from '../models/myModel'
import { ref, onMounted,toRaw } from 'vue'
import { useLinkListStore } from '../stores/myStore'
import { storeToRefs } from 'pinia'

const store = useLinkListStore()
const { linkList } = storeToRefs(store)
const leftDrawerOpen = ref(true)
const rightDrawerOpen = ref(true)

let linkListData = ref<model.item[]>([]);

//监听store
store.$subscribe((mutation, state) => {
  linkListData.value = toRaw(state).linkList;
})

const data = ref([
  {
    title: "page1",
    data: [
      {
        folderName: "folder1",
        data: [
          {
            linkTitle: "linkTitle1",
            link: "link1",
          }
        ]
      }
    ],
  },
  {
    title: "page2",
    data: [
      {
        folderName: "folder2",
        data: [
          {
            linkTitle: "linkTitle2",
            link: "link2",
          }
        ]
      }
    ],
  },
  {
    title: "page3",
    data: [
      {
        folderName: "folder3",
        data: [
          {
            linkTitle: "linkTitle3",
            link: "link3",
          }
        ]
      }
    ],
  },


])
onMounted(() => {
  //toRaw获取proxy原始值
  linkListData = toRaw(linkList);
  toggleLeftDrawer();
  toggleRightDrawer();
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}


</script>