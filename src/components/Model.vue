<script setup>

import Viewer3D from "./Viewer3D.vue";
import Blueprint from "./Blueprint.vue";
import Editor from "./Editor.vue";
</script>

<template>

  <ul class="nav nav-tabs" id="myTab" role="tablist" style="margin-top: 10px">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Визуализация</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">План-схема</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Расчет</button>
    </li>
  </ul>

  <div class="tab-content">
    <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
      <Viewer3D/>
    </div>
    <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
      <Blueprint/>
    </div>
    <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab" tabindex="0">
      <Editor/>
    </div>
  </div>
</template>

<style scoped>

</style>