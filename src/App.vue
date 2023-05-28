<script setup>
import Header from "./components/Header.vue";
import Model from "./components/Model.vue";
import LeftSide from "./components/LeftSide.vue";
</script>

<template>
  <Header/>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <LeftSide/>
      </div>
      <div class="col-10">
        <Model/>
      </div>
    </div>
  </div>
</template>

<style>
html, body, #app{
  height: 100%;
}
</style>
