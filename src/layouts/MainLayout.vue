<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-icon name="style" size="2em" />
          收藏夹管理
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Edge" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list bordered padding class="rounded-borders text-primary">
        <q-item clickable v-ripple :active="link === 'inbox'" @click="link = 'inbox'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section>重置数据</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item clickable v-ripple :active="link === 'settings'" @click="link = 'settings'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>设置</q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="link === 'help'" @click="link = 'help'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>帮助</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item v-for="item in linkListData">
          <q-item-section top @click="openLink(item.link as string)" class="cursor-pointer">
            <q-item-label lines="1">
              <span class="text-weight-medium text-primary">{{ item.linkTitle }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              {{ item.link }}
            </q-item-label>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn size="12px" flat dense round icon="more_vert" />
              <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable @click="deleteFavourite(item)">
                      <q-item-section>删除</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section @click="shareFavourite(item)">分享</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import * as models from '../models/myModel'
import { ref, onMounted, toRaw } from 'vue'
import { useLinkListStore, useSideBarStore } from '../stores/myStore'
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'boot/axios'

const linkListStore = useLinkListStore()
const sideBarStore = useSideBarStore()
const { linkList } = storeToRefs(linkListStore)
const { leftSideBar, rightSideBar } = storeToRefs(sideBarStore)
let leftDrawerOpen = ref(true)
let rightDrawerOpen = ref(true)
let linkListData = ref<models.item[]>([]);
let link = ref('inbox')

//监听store
linkListStore.$subscribe((mutation, state) => {
  linkListData.value = toRaw(state).linkList;
})
sideBarStore.$subscribe((mutation, state) => {
  leftDrawerOpen.value = toRaw(state).leftSideBar;
  rightDrawerOpen.value = toRaw(state).rightSideBar;
})

const data = ref([
  {
    title: "Edge",
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
  linkListData.value = linkList.value;
  leftDrawerOpen.value = leftSideBar.value;
  rightDrawerOpen.value = rightSideBar.value;
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

function openLink(link: string) {
  // window.location.href=link;
  window.open(link, '_blank');
}

function deleteFavourite(item: models.item) {

}

function shareFavourite(item: models.item) {
  Notify.setDefaults({
    position: 'top',
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })
  if (navigator.share) {
    navigator.share(
      {
        title: item.linkTitle,
        text: '来自一位帅哥的分享',
        url: item.link
      }
    ).then(() => {
      // Notify.create('分享成功')
    }).catch((error) => {
      Notify.create('分享失败')
    });
  } else {
    Notify.create('该浏览器不支持分享')
  }
}
</script>
<style lang="sass">
.my-menu-link
  color: white
  background:$primary
</style>
