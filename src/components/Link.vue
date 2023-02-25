<template>
    <div class="fit row wrap justify-center border-radius-inherit bg-light-blue text-capitalize text-weight-medium cursor-pointer"
        id="outer">
        {{ props.title }}
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
    title: string|undefined;
}
const props = defineProps<Props>();

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
