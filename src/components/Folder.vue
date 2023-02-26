<template>
  <div
    class="fit row wrap justify-center border-radius-inherit bg-positive text-capitalize text-weight-medium cursor-pointer"
    @click="handleClick" id="outer">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { item } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore, useSideBarStore } from '../stores/myStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

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
const sideBarStore = useSideBarStore();
const { linkList } = storeToRefs(store)
const linkListData: Array<item> = linkList.value

onMounted(() => {

});

function handleClick() {
  let folderFlag = false;
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
    router.push('/page1')
    favouriteDataStore.$patch((state) => {
      state.favouriteData = data
    })
  }
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
</style>
