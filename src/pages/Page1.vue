<template>
    <div class="window-height row justify-start items-start content-start" id="container">
        <div class=" col-xl-2 col-md-4 col-xs-6 rounded-borders children" v-for="folder in folders">
            <Folder v-if="folder.type==='folder'" :title="folder.folderName"></Folder>
            <Link v-if="folder.type==='link'" :title="folder.linkTitle"></Link>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import Folder from '../components/Folder.vue'
import Link from '../components/Link.vue'

interface linkItem{
    linkTitle:string,
    link:string,
}

interface item{
    type?:string,
    folderName?:string,
    linkTitle?:string,
    link?:string,
    data?:linkItem[]
}

let folders = ref<item[]>([]);
folders.value = [
    {
        type: "folder",
        folderName: "folder1",
        data: [
            {
                linkTitle: "linkTitle1",
                link: "link1",
            }
        ]
    },
    {
        type: "folder",
        folderName: "folder2",
        data: [
            {
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
  