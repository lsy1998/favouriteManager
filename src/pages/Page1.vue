<template>
    <div class="window-height row justify-start items-start content-start" id="container">
        <div class=" col-xl-2 col-md-4 col-xs-6 rounded-borders children" v-for="folder in folders">
            <Folder v-if="folder.type === 'folder'" :title="folder.folderName" :data="folder.data"></Folder>
            <Link v-if="folder.type === 'link'" :title="folder.linkTitle">
            </Link>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import Folder from '../components/Folder.vue'
import Link from '../components/Link.vue'
import { item } from '../models/myModel'
import { useLinkListStore } from '../stores/myStore'

let folders = ref<item[]>([]);
folders.value = [
    {
        type: "folder",
        folderName: "folder1",
        data: [
            {
                type: "link",
                linkTitle: "linkTitle1",
                link: "link1",
            }, {
                type: "folder",
                folderName: "folder1-1",
                data: [{
                    type: "link",
                    linkTitle: "linkTitle1-1",
                    link: "link1-1",
                }],
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
  