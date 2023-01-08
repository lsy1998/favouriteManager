<template>
  <div class="window-height row justify-start items-start content-start" id="container">
    <div class=" col-xl-2 col-md-4 col-xs-6 rounded-borders children" v-for="folder in favouriteData">
      <Folder v-if="folder.type === 'folder'" :title="folder.folderName" :data="folder.data"></Folder>
      <Link v-if="folder.type === 'link'" :title="folder.linkTitle">
      </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue';
import Folder from '../components/Folder.vue'
import Link from '../components/Link.vue'
import { item, dbItem } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore } from '../stores/myStore'
import { api } from 'boot/axios'
import _ from 'lodash'

const favouriteDataStore = useFavouriteDataStore();
const linkListStore = useLinkListStore();
let favouriteData = ref<item[]>([]);


favouriteDataStore.$subscribe((mutation, state) => {
  favouriteData.value = toRaw(state).favouriteData;
  let data: item[] = favouriteData.value;
  let folderData: item[] = [];
  let linkData: item[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "folder") {
      folderData.push(data[i]);
    }
    if (data[i].type == "link") {
      linkData.push(data[i]);
    }
  }
  favouriteData.value = folderData;
  linkListStore.$patch((state) => {
    state.linkList = linkData;
  })
})

api.get('/api/getFavouriteData')
  .then((response) => {
    let data = response.data.data


    favouriteData.value = getFavouriteData(data, 0);

    console.log(favouriteData)
  })
  .catch(() => {

  })

function getFavouriteData(data: dbItem[], parentFolderId: number): item[] {
  let data1: item[] = [];

  //对于当前目录下子文件夹
  let folderData: dbItem[] = data.map((i: dbItem): dbItem => {
    let tempItem: dbItem = {};
    if (i.PARENT_FOLDER_ID === parentFolderId) {
      tempItem = { "FOLDER_NAME": i.FOLDER_NAME, "FOLDER_ID": i.FOLDER_ID }
    }
    return tempItem
  })

  let sortData: dbItem[] = [];
  let uniqData: dbItem[] = _.uniqBy(folderData, 'FOLDER_NAME')
  uniqData = _.remove(uniqData, function (n: dbItem): boolean {
    return n != undefined;
  })

  sortData = _.sortBy(uniqData, function (item: dbItem): any {
    return item.FOLDER_NAME;
  });

  sortData = _.remove(sortData, function (n: dbItem) {
    return Object.keys(n).length != 0;
  })

  for (let i = 0; i < sortData.length; i++) {
    let tempData: item = {};
    tempData.type = 'folder';
    tempData.folderName = sortData[i].FOLDER_NAME;
    tempData.folderId = sortData[i].FOLDER_ID;

    let tempData1: item[] = [];
    if (tempData.folderId != undefined) {
      tempData1 = getFavouriteData(_.cloneDeep(data), tempData.folderId);
    }
    tempData.data = tempData1;
    data1.push(tempData);
  }

  //对于当前目录下链接
  for (let i = 0; i < data.length; i++) {
    if (data[i].FOLDER_ID === parentFolderId) {
      data1.push({ folderName: data[i].FOLDER_NAME, folderId: data[i].FOLDER_ID, linkId: data[i].LINK_ID, type: 'link', linkTitle: data[i].LINK_NAME, link: data[i].LINK_URL, parentFolderId: data[i].PARENT_FOLDER_ID, data: [] });
    }
  }
  return data1;
}

onMounted(() => {
  let data: item[] = favouriteData.value;
  let folderData: item[] = [];
  let linkData: item[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "folder") {
      folderData.push(data[i]);
    }
    if (data[i].type == "link") {
      linkData.push(data[i]);
    }
  }
  favouriteData.value = folderData;
  linkListStore.$patch((state) => {
    state.linkList = linkData;
  })
})
</script>
<style lang="scss" scoped>
#container {}

.children {
  height: 25em;
  margin-top: 50px;
  padding: 30px;
}
</style>
