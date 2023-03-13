<template>
  <!-- <q-card
    class="fit row wrap justify-center border-radius-inherit bg-green-8 text-capitalize text-weight-medium cursor-pointer folder-style">
    <q-card-section>
      {{ props.title }}
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat round color="red" icon="favorite" />
      <q-btn flat round color="teal" icon="bookmark" />
      <q-btn flat round color="primary" icon="share" />
    </q-card-actions>
  </q-card> -->
  <q-card class="my-card fit folder-style">
    <q-card-section class="bg-primary text-white cursor-pointer folder-card-section" @click="handleClick">
      <div class="text-h6">{{ props.title }}</div>
      <div class="text-subtitle2">by John Doe</div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="folder-card-action">
      <q-btn flat round color="red" icon="favorite" />
      <q-btn flat round color="teal" icon="send" @click="pushNotification"></q-btn>
      <q-btn flat round color="primary" icon="share" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { item } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore, useSideBarStore, useBreadcrumbsStore } from '../stores/myStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { pushNotifications } from 'electron';

interface Props {
  title: string | undefined;
  data: item[] | undefined
}

const props = defineProps<Props>();
// let data = ref<item[]>([]);
let data: Array<item> = [];
let router = useRouter();
const store = useLinkListStore();
const favouriteDataStore = useFavouriteDataStore();
const breadcrumbsStore = useBreadcrumbsStore();
const sideBarStore = useSideBarStore();
const { linkList } = storeToRefs(store)
const linkListData: Array<item> = linkList.value

onMounted(() => {

});

function handleClick() {
  let folderFlag = false;
  // 添加一个面包屑
  breadcrumbsStore.$patch((state) => {
    state.breadcrumbs.push({
      folderName: props.title,
      data: props.data,
    });
  })
  store.$patch((state) => {
    state.linkList = [];
  })
  // 默认右边栏关闭
  sideBarStore.$patch((state) => {
    state.rightSideBar = false;
  })
  let emptyData: item[] = [];
  data = toRaw(props.data) as item[];
  console.log('data :>> ', data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "link") {
      //如果收藏夹下有链接就用右边栏显示链接
      sideBarStore.$patch((state) => {
        state.rightSideBar = true;
      })
      store.$patch((state) => {
        state.linkList.push(data[i])
      })
    }
    if (data[i].type == "folder") {
      folderFlag = true;
    }
  }

  if (folderFlag) {
    // router.push('/page1')
    favouriteDataStore.$patch((state) => {
      state.favouriteData = data
    })
  }
}

function pushNotification() {
  Notification.requestPermission((res) => {
    if (res !== 'granted') return
    let notice = new Notification("title", {
      body: 'body',
      tag: '111',
      icon: 'https://foruda.gitee.com/avatar/1676993386051995312/1867919_longsiyu_1599210190.png!avatar200',
      image: 'https://foruda.gitee.com/avatar/1676993386051995312/1867919_longsiyu_1599210190.png!avatar200',
      renotify: false,
      requireInteraction: true,
      silent: false,
    })
    notice.onshow = function () {
      console.log('show')
      setTimeout(notice.close.bind(notice), 5000)
    }
    notice.onclick = function () {
      console.log('click')
    }
    notice.onclose = function () {
      console.log('close')
    }
    notice.onerror = function () {
      console.log('error')
    }
  })

}



</script>

<style lang="scss" scoped>
#outer {
  font-size: 2em;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
  padding: 10px;
}

.folder-style {
  color: white;
  height: 100%;
}

.folder-card-section {
  height: 80%;
}

.folder-card-action {
  height: 20%;
}
</style>
