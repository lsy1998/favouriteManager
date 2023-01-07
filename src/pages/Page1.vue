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
    response.data

    let data = response.data.data
    let folderData: dbItem[] = data.map((i: dbItem): dbItem => {
      let tempItem: dbItem = {};
      if (i.PARENT_FOLDER_ID === 0) {
        tempItem = { "FOLDER_NAME": i.FOLDER_NAME, "FOLDER_ID": i.FOLDER_ID }
      }
      return tempItem
    })

    let uniqData: dbItem[] = _.uniqBy(folderData, 'FOLDER_NAME')
    uniqData = _.remove(uniqData, function (n: dbItem): boolean {
      return n != undefined;
    })

    let sortData: dbItem[] = _.sortBy(uniqData, function (item: dbItem): any {
      return item.FOLDER_NAME;
    });

    console.log(sortData);
    let data1: item[]=[];
    for (let i = 0; i < sortData.length; i++) {
      let tempData: item = {};
      let partData: dbItem[];
      tempData.type = 'folder';
      tempData.folderName = sortData[i].FOLDER_NAME;
      tempData.folderId = sortData[i].FOLDER_ID;

      tempData.data = _.remove(_.cloneDeep(data), (item: dbItem) => {
          if (sortData[i].FOLDER_NAME != undefined) {
            if (item.FOLDER_NAME == sortData[i].FOLDER_NAME) {
              return true;
            }
          }
        }).map((item:dbItem):item=>{
          return {folderName:item.FOLDER_NAME,folderId:item.FOLDER_ID,linkId:item.LINK_ID,type:'link',linkTitle:item.LINK_NAME,link:item.LINK_URL}
        })
      data1.push(tempData);
      favouriteData.value=data1;
    }
  })
  .catch(() => {

  })

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
#container {
  border: 1px solid black;
}

.children {
  height: 25em;
  margin-top: 50px;
  padding: 30px;
}
</style>
