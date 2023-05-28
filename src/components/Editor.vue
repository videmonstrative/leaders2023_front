<script setup>

import {reactive} from "vue";

const data = reactive([
  {title: 'Первый расчет', result: [{item: 'A-1', material: '101', score: 0.8}, {item: '1-2', material: '500', score: 0.8}]},
  {title: 'Первый расчет', result: [{item: 'A-1', material: '101', score: 0.8}, {item: '1-2', material: '500', score: 0.8}, {item: '2-3', material: '101', score: 0.8}]},
])

</script>

<template>
  <div style="height: 20px"></div>
  <div v-for="res in data">
    <h6>{{ res.title }}</h6>
    <div style="padding-bottom: 10px">
      <input type="submit" class="btn btn-success btn-sm" value="Выгрузить в Excel">
    </div>
    <table class="table table-bordered" style="width: 50%">
      <thead>
      <tr>
        <th scope="col">Граф</th>
        <th scope="col">Материал</th>
        <th scope="col">Вероятность</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in res.result">
        <td>{{ row.item }}</td>
        <td>{{ row.material }}</td>
        <td>{{ row.score }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>