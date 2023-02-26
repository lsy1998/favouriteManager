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
import { item, edgeBookmark, dbFMDItem } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore, useSideBarStore } from '../stores/myStore'
import { api } from 'boot/axios'
import * as _ from 'lodash'
import ErrorNotFound from './ErrorNotFound.vue';
import dbHelper from '../../src/utils/indexedDB/db'
import { Notify } from 'quasar'
import { createLogger } from 'vite'

const favouriteDataStore = useFavouriteDataStore();
const linkListStore = useLinkListStore();
const sideBarStore = useSideBarStore();
let favouriteData = ref<item[]>([]);
let showFileInput = ref<boolean>(false);
let jsonFile = ref(null);
let helper = dbHelper();

onMounted(() => {
  let folderData: item[] = [];
  let linkData: item[] = [];

  favouriteData.value = folderData;
  linkListStore.$patch((state) => {
    state.linkList = linkData;
  })
  helper.getCount('favouriteMasterData').then((count: any) => {
    if (count == 0) {
      showFileInput.value = true;
    } else {
      return helper.getList('favouriteMasterData');
    }
  }).then((bookmarkList: any) => {
    favouriteData.value = getBookmarkData(bookmarkList, '0')
  })
  for (let i = 0; i < favouriteData.value.length; i++) {
    if (favouriteData.value[i].type == "folder") {
      folderData.push(favouriteData.value[i]);
    }
    if (favouriteData.value[i].type == "link") {
      linkData.push(favouriteData.value[i]);
    }
  }
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

//处理数据库返回的数据，使其符合供加载的数据的结构
function getBookmarkData(data: dbFMDItem[], parentFolderId: string): item[] {
  let data1: item[] = [];
  let folderData: dbFMDItem[] = [];
  for (let i in data) {
    if (data[i].parentFolderId === parentFolderId) {
      folderData.push(data[i])
    }
  }

  for (let i in folderData) {
    if (folderData[i].folderId != undefined) {
      //对于当前目录下子文件夹
      let tempData: item = {};
      tempData.type = 'folder';
      tempData.folderName = folderData[i].folderName;
      tempData.folderId = folderData[i].folderId;

      let tempData1: item[] = [];
      if (tempData.folderId != undefined) {
        tempData1 = getBookmarkData(_.cloneDeep(data), tempData.folderId);
      }
      tempData.data = tempData1;
      data1.push(tempData);
    } else {
      //对于当前目录下链接
      data1.push({ folderName: folderData[i].folderName, folderId: '', linkId: folderData[i].linkId, type: 'link', linkTitle: folderData[i].linkName, link: folderData[i].linkUrl, parentFolderId: folderData[i].parentFolderId, data: [] });
    }
  }
  return data1;
}

function readFile() {
  let file = jsonFile.value;
  if (file != null) {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
      let bookmarks = JSON.parse(reader.result as string);
      let edgeBookmark: edgeBookmark[] = [];
      // 主收藏夹
      edgeBookmark.push(bookmarks.roots.bookmark_bar)
      // 其他收藏夹
      edgeBookmark.push(bookmarks.roots.other)
      // 其他端同步过来的文件夹
      edgeBookmark.push(bookmarks.roots.synced)
      // 整理数据
      let bookmarksData: dbFMDItem[] = getLink(edgeBookmark, '');
      for (let i in bookmarksData) {
        bookmarksData[i]['id'] = parseInt(i);
        helper.addModel('favouriteMasterData', bookmarksData[i]);
      }
    }
  } else {
    Notify.create({
      message: '请先选择文件',
      color: 'red',
      position: 'bottom'
    })
  }
}

function getLink(data: edgeBookmark[], parentFolderId: string): dbFMDItem[] {
  let bookmarksDate: dbFMDItem[] = [];
  if (data.length > 0) {
    for (let x of data) {
      let folder: dbFMDItem = {};
      folder['folderName'] = x['name'];
      folder['folderId'] = x['id'];
      folder['parentFolderId'] = parentFolderId;
      folder['folderAddDate'] = new Date((parseInt(x['date_added'] as string) / 1000000 - 11644473600) * 1000).toString();
      folder['folderModifiedDate'] = new Date((parseInt(x['date_modified'] as string) / 1000000 - 11644473600) * 1000).toString();

      if (parentFolderId == '') {
        folder['parentFolderId'] = '0';
      } else {
        folder['parentFolderId'] = parentFolderId;
      }
      bookmarksDate.push(Object.assign({}, folder));
      if (x['children'] != undefined) {
        for (let y of x['children']) {
          if (y['children'] != undefined && y['children'].length > 0) {
            bookmarksDate.push(...getLink([y], x['id'] as string));
          } else {
            let link: dbFMDItem = {};
            link['folderName'] = x['name'];
            link['parentFolderId'] = x['id'];
            link['linkName'] = y['name'];
            link['linkAddDate'] = new Date((parseInt(y['date_added'] as string) / 1000000 - 11644473600) * 1000).toString();
            link['linkModifiedDate'] = '';
            link['linkId'] = y['id'];
            link['linkUrl'] = y['url'];
            bookmarksDate.push(Object.assign({}, link));
          }
        }
      }
    }
  }
  return bookmarksDate;
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
