<template>
    <div class="window-height row  justify-start items-start content-start" id="container">
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
        <div class=" col-xl-4 col-md-6 col-xs-12 offset-1 rounded-borders children"></div>
      


    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
</script>
<style lang="scss" scoped>
#container{
    border:1px solid black;
}
.children{
    width: 20em;
    height: 25em;
    border:1px solid red;
    margin-top: 50px;
}
</style>
  