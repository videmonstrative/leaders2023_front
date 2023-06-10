<template>
  <div id="canvas-container" style="height: 500px; width: 700px; border: 1px solid gray"></div>
</template>

<script setup>
import {
  BufferGeometry,
  Color,
  Curve,
  DoubleSide,
  Float32BufferAttribute,
  CircleGeometry,
  Group,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  Vector3,
  WireframeGeometry,
  WebGLRenderer,
  ExtrudeBufferGeometry,
  GridHelper
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {onMounted} from 'vue'
import {useStore} from "vuex";

const group = new Group()
const store = useStore()

const unsubscribe = store.subscribe((mutation, state) => {
  if (mutation.type === 'setWallPoint') {
    wallsGeometry(group)
  }
  if (mutation.type === 'clearProject') {
    wallsGeometry(group)
    addRiser(group)
  }
  if (mutation.type === 'addRiser') {
    addRiser(group)
  }
})

function addRiser(group) {

  store.state.activeProject.risers.forEach((riser) => {
    const geometry = new CircleGeometry(1, 32)
  //  geometry.translate(riser.x/9, 0, riser.y/-9)
  //  geometry.rotateX(Math.PI / 4)
    group.add(new Mesh(geometry, new MeshPhongMaterial({color: 0x00ff00})))
  })
}

function wallsGeometry(mesh) {
  const x = 0, y = 0;
  const shape = new Shape()
  if (store.state.activeProject) {
    store.state.activeProject.wallsPoints.forEach((point, index) => {
      if (index === 0) {
        shape.moveTo(point.x/10, point.y/10)
      } else {
        shape.lineTo(point.x/10, point.y/10)
      }
    })
  }
  const data = {
    segments: 4
  }
  const extrudeSettings = {
    steps: 1,
    depth: 50,
    bevelEnabled: false,
    curveSegments: 50,
  };
  const geometry = new ExtrudeBufferGeometry( shape, extrudeSettings );
  geometry.center();

  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();
  mesh.children[0].geometry = new WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;
}

onMounted(() => {
  init()
})

function init() {

  const canvasContainer = document.getElementById('canvas-container')
  const winWidth = canvasContainer.parentElement.clientWidth
  const winHeight = canvasContainer.parentElement.clientHeight

  const selectedGeometry = window.location.hash.substring(1);

  const scene = new Scene();
  scene.background = new Color(0xffffff);

  const gridHelper = new GridHelper(100, 100, 0xe5e5e5ff, 0xe5e5e5ff)
  scene.add(gridHelper)

 const camera = new PerspectiveCamera(75, winWidth/winHeight, 0.1, 600);
 // const camera = new OrthographicCamera(winWidth/-2, winWidth/2, winHeight/2, winHeight/-2, 1, 100)

   camera.position.x = 10;
   camera.position.y = 10;
   camera.position.z = 20;


  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(winWidth, winHeight)
  renderer.setClearColor(0xffffff)

  const orbit = new OrbitControls( camera, renderer.domElement );
  orbit.enableZoom = true;

  const lights = [];
  lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 200, 0 );
  lights[ 1 ].position.set( 100, 200, 100 );
  lights[ 2 ].position.set( - 100, - 200, - 100 );

  scene.add( lights[ 0 ] );
  scene.add( lights[ 1 ] );
  scene.add( lights[ 2 ] );



  const geometry = new BufferGeometry();
  geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) );

  const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
  const meshMaterial = new MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true } );

  group.add( new LineSegments( geometry, lineMaterial ) )
  group.add( new Mesh( geometry, meshMaterial ) )

  group.rotateX(1.5708)
  group.translateZ(-25)

  scene.add( group );

  window.addEventListener( 'resize', function () {
    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
  }, false );

  function render() {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
  }

  canvasContainer.appendChild(renderer.domElement);
  render();
}

</script>