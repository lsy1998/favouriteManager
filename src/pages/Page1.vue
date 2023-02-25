<template>
  <div class="relative-position window-height" v-if="showFileInput">
    <q-file dense class="absolute-center vertical-middle" input-style="width:300px" clearable color="orange" standout
      bottom-slots v-model="jsonFile" label="选择edge浏览器bookmark文件" counter>
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:append>
        <q-icon name="favorite" />
      </template>
      <template v-slot:hint>
        例如："C:\Users\lsy\AppData\Local\Microsoft\Edge\User Data\Default\Bookmarks"
      </template>
      <template v-slot:after>
        <q-btn @click="readFile">确定</q-btn>
      </template>
    </q-file>
  </div>
  <div class=" row justify-start items-start content-start" id="container">
    <div class=" col-xl-2 col-md-4 col-xs-6 rounded-borders children" v-for="folder in favouriteData">
      <Folder v-if="folder.type === 'folder'" :title="folder.folderName" :data="folder.data"></Folder>
      <Link v-if="folder.type === 'link'" :title="folder.linkTitle">
      </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue'
import Folder from '../components/Folder.vue'
import Link from '../components/Link.vue'
import { item, dbItem } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore } from '../stores/myStore'
import { api } from 'boot/axios'
import * as _ from 'lodash'
import ErrorNotFound from './ErrorNotFound.vue';
import dbHelper from '../../src/utils/indexedDB/db'
import { Notify } from 'quasar'

let helper = dbHelper();
console.log(helper)

const favouriteDataStore = useFavouriteDataStore();
const linkListStore = useLinkListStore();
let favouriteData = ref<item[]>([]);
let showFileInput = ref<boolean>(false);
let jsonFile = ref(null);
let fileDom = ref();

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
  helper.getCount('favouriteMasterData').then((count: any) => {
    if (count == 0) {
      showFileInput.value = true;
    }
  })
  console.log(fileDom)

})

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

// api.get('/api/getFavouriteData')
//   .then((response) => {
//     let data = response.data.data
//     favouriteData.value = getFavouriteData(data, 0);
//     console.log(favouriteData)
//   })
//   .catch(() => {

//   })


//处理数据库返回的数据，使其符合供加载的数据的结构
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

function readFile() {
  console.log(jsonFile.value)
  let file = jsonFile.value;
  if (file != null) {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
      let bookmarks = JSON.parse(reader.result as string);
      console.log(bookmarks);
    }
  } else {
    Notify.create({
      message: '请先选择文件',
      color: 'red',
      position: 'bottom'
    })
  }
}

</script>
<style lang="scss" scoped>
#container {}

.children {
  height: 25em;
  margin-top: 50px;
  padding: 30px;
}
</style>
