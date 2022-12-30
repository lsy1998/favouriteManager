<template>
    <div class="fit row wrap justify-center border-radius-inherit bg-positive text-capitalize text-weight-medium cursor-pointer"
        @click="handleClick" id="outer">
        {{ props.title }}
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { item } from '../models/myModel'
import { useLinkListStore } from '../stores/myStore'
import { storeToRefs } from 'pinia'

interface Props {
    title: string;
    data: item[]
}

const props = defineProps<Props>();
// let data = ref<item[]>([]);
let data: Array<item> = [];
const store = useLinkListStore()
const { linkList } = storeToRefs(store)
const linkListData: Array<item> = linkList.value

onMounted(() => {

});

function handleClick() {
    console.log(linkListData);
    store.$patch((state) => {
        state.linkList=[];
    })
    data = props.data;
    for (let i = 0; i < data.length; i++) {
        if (data[i].type == "link") {
            store.$patch((state) => {
                state.linkList.push(data[i])
            })
        }
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
  