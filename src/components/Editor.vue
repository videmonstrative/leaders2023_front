<script setup>
import Two from 'https://cdn.skypack.dev/two.js@latest'
import {onMounted} from "vue";



onMounted(() => {
  // Создание холста Two.js
  var elem = document.getElementById('drawArea');
  var params = { width: 800, height: 600 };
  var two = new Two(params).appendTo(elem);

// Размеры сетки
  var gridSize = 10;
  var gridColor = 'red';

// Переменные для хранения начальной и конечной точек линии
  var startPoint, endPoint;
  var line;

// Создание привязочной сетки
  var grid = two.makeGroup();
  grid.stroke = 'blue';
  grid.linewidth = 1;

  for (var x = gridSize; x < params.width; x += gridSize) {
    var verticalLine = two.makeLine(x, 0, x, params.height);
    grid.add(verticalLine);
  }

  for (var y = gridSize; y < params.height; y += gridSize) {
    var horizontalLine = two.makeLine(0, y, params.width, y);
    grid.add(horizontalLine);
  }

// Обработчик события нажатия кнопки мыши
  function onMouseDown(event) {
    // Получение координат клика
    var x = Math.floor((event.clientX - elem.getBoundingClientRect().left) / gridSize) * gridSize;
    var y = Math.floor((event.clientY - elem.getBoundingClientRect().top) / gridSize) * gridSize;

    // Создание начальной точки линии
    startPoint = new Two.Vector(x, y);

    // Создание новой линии
    line = two.makeLine(startPoint.x, startPoint.y, startPoint.x, startPoint.y);
    line.stroke = 'black';
    line.linewidth = 5;
  }

// Обработчик события перемещения мыши
  function onMouseMove(event) {
    // Проверка, существует ли начальная точка линии
    if (startPoint) {
      // Получение текущих координат мыши
      var x = Math.floor((event.clientX - elem.getBoundingClientRect().left) / gridSize) * gridSize;
      var y = Math.floor((event.clientY - elem.getBoundingClientRect().top) / gridSize) * gridSize;

      // Обновление конечной точки линии
      endPoint = new Two.Vector(x, y);

      // Обновление позиции и размера линии
      line.vertices[1].set(endPoint.x, endPoint.y);
    }
  }

// Обработчик события отпускания кнопки мыши
  function onMouseUp(event) {
    // Очистка переменных
    startPoint = null;
    endPoint = null;
  }

// Привязка обработчиков событий к холсту
  elem.addEventListener('mousedown', onMouseDown);
  elem.addEventListener('mousemove', onMouseMove);
  elem.addEventListener('mouseup', onMouseUp);

// Запуск анимации Two.js
  function animate() {
    two.update();
    requestAnimationFrame(animate);
  }
  animate();

})
</script>

<template>
  <div id="drawArea" style="border: 1px solid gray; width: 800px; height: 600px"></div>
</template>

<style scoped>

</style>