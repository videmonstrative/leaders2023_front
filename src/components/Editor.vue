<script setup>

import {reactive} from "vue";
import {useStore} from "vuex";

const data = reactive([
  {title: 'Первый расчет', result: [{item: 'A-1', material: '101', score: 0.8}, {item: '1-2', material: '500', score: 0.8}]},
  {title: 'Первый расчет', result: [{item: 'A-1', material: '101', score: 0.8}, {item: '1-2', material: '500', score: 0.8}, {item: '2-3', material: '101', score: 0.8}]},
])

const store = useStore()

</script>

<template>
  <div style="height: 20px"></div>
  <div v-if="store.state.activeProject && store.state.activeProject.response"  v-for="calc in store.state.activeProject.response.calculation">
    <h6>{{ calc.algo.name }}</h6>
    <div style="padding-bottom: 10px">
      <a href="/excel/Проект_трассы_v1.xlsx" class="btn btn-success btn-sm">Выгрузить в Excel</a>
    </div>
    <table class="table table-bordered" style="width: 50%">
      <thead>
      <tr>
        <th scope="col">Граф</th>
        <th scope="col">Материал</th>
        <th scope="col">Оценка</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in calc.result">
        <td>{{ row.graph }}</td>
        <td>{{ row.material }}</td>
        <td>{{ calc.score }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>