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
import { item } from '../models/myModel'
import { useLinkListStore, useFavouriteDataStore } from '../stores/myStore'
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
// let folders = ref<item[]>([]);
favouriteData.value = [
    {
        type: "folder",
        folderName: "folder1",
        data: [
            {
                type: "link",
                linkTitle: "linkTitle1",
                link: "link1",
            },
            {
                type: "link",
                linkTitle: "linkTitle2",
                link: "link2",
            }, {
                type: "folder",
                folderName: "folder1-1",
                data: [{
                    type: "link",
                    linkTitle: "linkTitle1-1",
                    link: "link1-1",
                }, {
                    type: "link",
                    linkTitle: "linkTitle1-2",
                    link: "link1-2",
                }
                ],
            }
        ]
    },
    {
        type: "folder",
        folderName: "folder2",
        data: [
            {
                type: "link",
                linkTitle: "linkTitle2",
                link: "link2",
            }
        ]
    },
    {
        type: "folder",
        folderName: "folder3",
        data: [
            {
                type: "link",
                linkTitle: "linkTitle3",
                link: "link3",
            }
        ]
    },
    {
        type: "link",
        linkTitle: "linkTitle4",
        link: "link4",
    },
    {
        type: "link",
        linkTitle: "linkTitle6",
        link: "link6",
    },
    {
        type: "folder",
        folderName: "folder4",
        data: [
            {
                type: "link",
                linkTitle: "linkTitle4",
                link: "link4",
            }
        ]
    },
];
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
  