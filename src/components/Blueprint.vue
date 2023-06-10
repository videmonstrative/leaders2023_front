<script setup>
import Konva from 'konva'
import {onMounted, reactive, ref} from 'vue'
import axios from 'axios'
import {useStore} from "vuex";

const store = useStore()

const dataRequest = reactive({
  center: null,
})

const dataResponse = ref({})

const width = window.innerWidth;
const height = window.innerHeight;
const gridSize = 14; // Ширина сетки в пикселях
const pointSize = 14; // Размер точки
const strokeWidth = 14;

const activeTool = ref('wall')
let isDrawing = false;
let linePoints = [];
let draggablePoints = [];
let center = null
let drops = {}

const layer = new Konva.Layer();

function drawAnchorGrid() {
  for (let x = 0; x <= width; x += gridSize) {
    layer.add(new Konva.Line({
      stroke: 'lightgray',
      points: [x, 0, x, height],
      strokeWidth: 1,
      opacity: 0.5,
      listening: false
    }));
  }
  for (let y = 0; y <= height; y += gridSize) {
    layer.add(new Konva.Line({
      stroke: 'lightgray',
      points: [0, y, width, y],
      strokeWidth: 1,
      opacity: 0.5,
      listening: false
    }));
  }
}

function setTool(name) {
  activeTool.value = name
}

function cleanCanvas() {
  dataRequest.center = null
  linePoints= []
  draggablePoints= []
  layer.destroyChildren()
  layer.clear()
  store.dispatch('clearProject')
  drawAnchorGrid()
}

onMounted(() => {
  init()
  document.getElementById('btn-wall').addEventListener('click', function () {setTool('wall')}, false);
  document.getElementById('btn-riser').addEventListener('click', function () {setTool('riser')}, false);
  document.getElementById('btn-drop').addEventListener('click', function () {setTool('drop')}, false);
  document.getElementById('btn-center').addEventListener('click', function () {setTool('center')}, false);
})

function addCenter(x, y) {

  const group = new Konva.Group({
    x: x - gridSize,
    y: y - gridSize,
    draggable: true,
    dragBoundFunc: function(pos) {
      const newX = Math.floor(pos.x / gridSize) * gridSize + gridSize / 2;
      const newY = Math.floor(pos.y / gridSize) * gridSize + gridSize / 2;
      dataRequest.center = [newX, newY]
      return {
        x: newX,
        y: newY
      };
    }
  });

  const circle = new Konva.Circle({
    x: gridSize*2,
    y: gridSize*2,
    width: gridSize*3,
    height: gridSize*3,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2
  })

  const triangle1 = new Konva.RegularPolygon({
    x: gridSize*2,
    y: -1 * gridSize,
    sides: 3,
    radius: gridSize*1,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    rotation: 180,
  })

  const triangle2 = new Konva.RegularPolygon({
    x: gridSize*5,
    y: gridSize*2,
    sides: 3,
    radius: gridSize*1,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    rotation: 30,
  })

  const triangle3 = new Konva.RegularPolygon({
    x: gridSize*2,
    y: gridSize*5,
    sides: 3,
    radius: gridSize*1,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
  })

  const triangle4 = new Konva.RegularPolygon({
    x: -1 * gridSize,
    y: gridSize*2,
    sides: 3,
    radius: gridSize*1,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    rotation: 90,
  })

  group.add(circle)
  group.add(triangle1)
  group.add(triangle2)
  group.add(triangle3)
  group.add(triangle4)
  layer.add(group)
}

function drawDrop(x, y) {
  const drop = new Konva.Rect({
    x: x,
    y: y,
    width: pointSize,
    height: pointSize,
    fill: 'red',
    draggable: true,
    dragBoundFunc: function(pos) {
      // Ограничиваем перемещение точек только по горизонтали и вертикали
      const newX = Math.floor(pos.x / gridSize) * gridSize + gridSize / 2;
      const newY = Math.floor(pos.y / gridSize) * gridSize + gridSize / 2;
      return {
        x: newX,
        y: newY
      };
    }
  })
  drops[drop._id] = drop
  store.dispatch('addDrop', {x: x - pointSize / 2, y: y - pointSize / 2})
  layer.add(drop)
  return drop._id
}

function drawRiser(x, y) {
  const group = new Konva.Group({
    x: x - gridSize,
    y: y - gridSize,
    draggable: true,
  });

  const box = new Konva.Rect({
    width: gridSize*4,
    height: gridSize*4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    dragBoundFunc: function(pos) {
      // Ограничиваем перемещение точек только по горизонтали и вертикали
      const newX = Math.floor(pos.x / gridSize) * gridSize + gridSize / 2
      const newY = Math.floor(pos.y / gridSize) * gridSize + gridSize / 2
      return {
        x: newX,
        y: newY
      };
    }
  })
  const circle = new Konva.Circle({
    x: gridSize*2,
    y: gridSize*2,
    width: gridSize*3,
    height: gridSize*3,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2
  })

  group.add(box)
  group.add(circle)
  layer.add(group)

  store.dispatch('addRiser', {x: x, y: y})
}

function init() {

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  stage.add(layer);

  drawAnchorGrid()

  stage.batchDraw();

  stage.on('mousedown touchstart', function(e) {
    if (!actions[activeTool.value]) {
      return
    }
    actions[activeTool.value]['mousedown'](e)
  });

  stage.on('mouseup touchend', function(e) {
    if (!actions[activeTool.value]) {
      return
    }
    actions[activeTool.value]['mouseup'](e)
  });

  const actions = {
    wall: {
      mousedown: function (e) {
        if (e.target === stage) {
          var pos = getGridSnappedPosition(stage.getPointerPosition());
          linePoints.push(pos.x, pos.y);
          isDrawing = true;

          var point = new Konva.Rect({
            x: pos.x - pointSize / 2,
            y: pos.y - pointSize / 2,
            width: pointSize,
            height: pointSize,
            fill: 'green',
            draggable: true,
            dragBoundFunc: function(pos) {
              // Ограничиваем перемещение точек только по горизонтали и вертикали
              var newX = Math.floor(pos.x / gridSize) * gridSize + gridSize / 2;
              var newY = Math.floor(pos.y / gridSize) * gridSize + gridSize / 2;
              return {
                x: newX,
                y: newY
              };
            }
          });

          point.on('mousedown touchstart', function(e) {
            point.moveToTop();
            stage.batchDraw();
          });

          draggablePoints.push(point);
          layer.add(point);
          layer.batchDraw();
        }
      },
      mouseup: function (e) {
        if (!isDrawing) return;
        var pos = getGridSnappedPosition(stage.getPointerPosition());
        var lastIndex = linePoints.length - 1;
        linePoints[lastIndex] = pos.x;
        linePoints[lastIndex + 1] = pos.y;
        store.dispatch('setWallPoint', pos)
        updateLinePoints();
        isDrawing = false;
      },
    },
    riser: {
      mousedown: function (e) {
        if (e.target !== stage) {
          return
        }
        const pos = getGridSnappedPosition(stage.getPointerPosition());
        drawRiser(pos.x, pos.y)
      },
      mouseup: function (e) {
        //
      },
    },
    drop: {
      mousedown: function (e) {
        if (e.target !== stage) {
          return
        }
        const pos = getGridSnappedPosition(stage.getPointerPosition())
        drawDrop(pos.x - pointSize / 2, pos.y - pointSize / 2)
      },
      mouseup: function (e) {
        //
      },
    },
    center: {
      mousedown: function (e) {
        if (e.target !== stage) {
          return
        }
        const pos = getGridSnappedPosition(stage.getPointerPosition());
        dataRequest.center = [pos.x, pos.y]
        addCenter(pos.x, pos.y)
      },
      mouseup: function (e) {
        //
      },
    }
  }

  function getGridSnappedPosition(position) {
    var snappedX = Math.floor(position.x / gridSize) * gridSize + gridSize / 2;
    var snappedY = Math.floor(position.y / gridSize) * gridSize + gridSize / 2;
    return { x: snappedX, y: snappedY };
  }

  function drawLine() {
    layer.destroyChildren(); // Очищаем слой перед перерисовкой

    drawAnchorGrid()

    if (dataRequest.center) {
      addCenter(dataRequest.center[0], dataRequest.center[1])
    }

    store.state.activeProject.risers.forEach(function (pos) {
      drawRiser(pos[0], pos[1])
    })

    const line = new Konva.Line({
      stroke: 'blue',
      strokeWidth: strokeWidth,
      points: linePoints
    });

    layer.add(line);
    draggablePoints.forEach(function(point) {
      layer.add(point);
    });

    // Добавляем длину возле каждой линии
    var lineLengths = calculateLineLengths();
    lineLengths.forEach(function(length, index) {
      var startPoint = draggablePoints[index].position();
      var endPoint = draggablePoints[index + 1].position();

      var text = new Konva.Text({
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2,
        text: length.toFixed(2),
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'black'
      });

      layer.add(text);
    });

    stage.batchDraw();
  }

  function updateLinePoints() {
    linePoints = [];
    draggablePoints.forEach(function(point) {
      linePoints.push(point.x() + pointSize / 2, point.y() + pointSize / 2);
    });
    drawLine();
  }

  function calculateLineLengths() {
    var lineLengths = [];
    for (var i = 0; i < draggablePoints.length - 1; i++) {
      var startPoint = draggablePoints[i].position();
      var endPoint = draggablePoints[i + 1].position();

      var length = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      lineLengths.push(length);
    }
    return lineLengths;
  }
}

function calculate() {
  axios.post('/api/calc', dataRequest).then((res) => {
    store.state.activeProject.response = res.data
  })
}

function showCalculation(calc) {
  const linePoints = [777, 77, 371, 77, 371, 147, 273, 147, 273, 399, 777, 399]
  const line = new Konva.Line({
    stroke: 'red',
    strokeWidth: 10,
    points: linePoints
  })
  layer.add(line)
}

</script>

<template>
  <div class="row">
    <div class="col-lg-9">
      <div class="row" style="padding: 5px">
        <div class="col-lg-9">
          <input type="button" class="btn btn-sm btn-outline-secondary" @click="cleanCanvas" value="Очистить" />
          <input type="button" class="btn btn-sm" :class="activeTool==='wall' ? 'btn-primary' : 'btn-outline-secondary'" id="btn-wall" value="Стена" />
          <input type="button" class="btn btn-sm" :class="activeTool==='riser' ? 'btn-primary' : 'btn-outline-secondary'" id="btn-riser" value="Стояк" />
          <input type="button" class="btn btn-sm" :class="activeTool==='drop' ? 'btn-primary' : 'btn-outline-secondary'" id="btn-drop" value="Сливы" />
          <input type="button" class="btn btn-sm" :class="activeTool==='center' ? 'btn-primary' : 'btn-outline-secondary'" id="btn-center" value="Центр" />
        </div>
        <div class="col-lg-3">
          <span class="btn btn-success btn-sm btn-file">
              Загрузить <input type="file">
          </span>
          <input type="button" class="btn btn-danger btn-sm" @click="calculate" value="Рассчитать" />
        </div>
      </div>
      <div id="container" style="border: 1px solid #d3d3d3; overflow: hidden; height: 500px"></div>
      <div v-if="store.state.activeProject && store.state.activeProject.response">
        <table class="table">
          <tr>
            <th>Алгоритм</th>
            <th>Оценка</th>
            <th></th>
          </tr>
          <tr v-for="calc in store.state.activeProject.response.calculation">
            <td>{{ calc.algo.name }}</td>
            <td>{{ calc.score }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="showCalculation(calc)">Показать</button>
            </td>
          </tr>
        </table>
      </div>
      <div class="row">
        <div class="col-lg-12">
          Стояки
          <table class="table">
            <tr>
              <th>#</th>
              <th>X</th>
              <th>Y</th>
              <th>Высота</th>
            </tr>
            <tr v-if="store.state.activeProject" v-for="riser in store.state.activeProject.risers">
              <td>{{ riser.id }}</td>
              <td>{{ riser.x }}</td>
              <td>{{ riser.y }}</td>
              <td><input v-model="riser.z" type="number" class="form-control form-control-sm" style="width: 100px"></td>
            </tr>
          </table>
          Сливы
          <table class="table">
            <tr>
              <th>#</th>
              <th>X</th>
              <th>Y</th>
              <th>Высота</th>
            </tr>
            <tr v-if="store.state.activeProject" v-for="drop in store.state.activeProject.drops">
              <td>{{ drop.id }}</td>
              <td>{{ drop.x }}</td>
              <td>{{ drop.y }}</td>
              <td><input v-model="drop.z" type="number" class="form-control form-control-sm" style="width: 100px"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <div style="margin-top: 10px">
        <h6>Request</h6>
        <pre class="pre-json">{{ JSON.stringify(store.state.activeProject, undefined, 2) }}</pre>
      </div>
      <div>
        <h6>Response</h6>
        <pre v-if="store.state.activeProject" class="pre-json">{{JSON.stringify(store.state.activeProject.response, undefined, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pre-json {
  border: 1px solid gray;
  padding: 10px;
  height: 350px;
  font-size: 12px;
}
</style>

<style>
.btn-file {
  position: relative;
  overflow: hidden;
}
.btn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  cursor: inherit;
  display: block;
}
</style>
