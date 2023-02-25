<template>
    <q-file ref="fileDom"
      v-model="jsonFile"
      label="Pick one file"
      filled
      style="max-width: 300px"
    />
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import { ref } from 'vue';
let fileDom  = ref();
let jsonFile = ref(null);
const todos = ref<Todo[]>([
    {
        id: 1,
        content: 'ct1'
    },
    {
        id: 2,
        content: 'ct2'
    },
    {
        id: 3,
        content: 'ct3'
    },
    {
        id: 4,
        content: 'ct4'
    },
    {
        id: 5,
        content: 'ct5'
    }
]);
const meta = ref<Meta>({
    totalCount: 1200
});
</script>
