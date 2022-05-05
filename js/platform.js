import * as THREE from 'three';
import { loadFilesGLTF } from './loader.js';

// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import main_objects from './../public/info.json'

const DEFAULT_TITLE = 'Selecione uma estrutura'

const object_files = [
  'objects/cols.glb',
  'objects/tirantes_externos_internos.glb',
  'objects/detalhes_inferiores.glb',
  'objects/detalhes_superiores.glb'
]

const viewport = document.getElementById('viewport');
const {scene, camera, renderer, controls} = init();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

var intersected_group = null;
var previous_color;

window.addEventListener("dblclick", onPointerClick );
window.addEventListener(
  "resize",
  () => {
    resize(viewport.offsetWidth, viewport.offsetHeight);
  },
  true
);

window.requestAnimationFrame(render);

animate();

renderTitle(DEFAULT_TITLE)

var span = document.getElementById("close");

span.onclick = closeImageModal;

// ######### PAGE RENDERING

function closeImageModal() { 
  const imageModal = document.getElementById("myModal");
  imageModal.style.display = "none";
  if(intersected_group) renderImageGallery(intersected_group.name);
}

function renderCaptions(captions){

  captions = Object.keys(captions).map((c)=>{
    captions[c].name = c;
    return captions[c];
  })
  // captions = Object.entries(captions).map((k,v)=>v['name']=k)
  const template = document.getElementById('captionsTemplate').innerHTML;
  const rendered = Mustache.render(template, {captions});
  document.getElementById('renderBodyTarget').innerHTML = rendered;
}

function renderImageGallery(structureGalleryName) {
  renderTitle(main_objects[structureGalleryName].humanName)

  const structure = main_objects[structureGalleryName]
  if(!structure) return;

  const bodyTarget = document.getElementById('renderBodyTarget')

  if(structure.images.length === 0){
    bodyTarget.innerHTML = Mustache.render('<p class="text-gray-600 p-2" >No momento não foram encontradas imagens para esta estrutura.</p>');
    return;
  }

  const galleryView = {
    images: structure.images,
    structureName: structureGalleryName,
    url: function (){
      return `img/${structureGalleryName}/${this.name}`
    }
  }

  const template = document.getElementById('galleryTemplate').innerHTML;
  const rendered = Mustache.render(template, galleryView);
  bodyTarget.innerHTML = rendered;

  const imgs = document.querySelectorAll('#renderBodyTarget img');
  imgs.forEach(img => {
    img.addEventListener('click', function() {
      const imgName = img.getAttribute('data-name')
      const structureName = img.getAttribute('data-structurename')
      const target = main_objects[structureName].images.find(x=>x.name === imgName)
      const captions = target.segments

      renderTitle(main_objects[structureName].humanName + ' - Legenda:')
      renderCaptions(captions)

      const modalImg = document.getElementById("fullimg");
      const modal = document.getElementById("myModal");
      modalImg.src = img.src;
      modal.style.display = 'block';
    });
  });
}

function clearRenderedBody(structureGalleryName) {
  document.getElementById('renderBodyTarget').innerHTML = '';
}

function renderTitle(title) {
  var template = document.getElementById('titleTemplate').innerHTML;
  var rendered = Mustache.render(template, {title});
  document.getElementById('renderTitleTarget').innerHTML = rendered;
}

// ######### THREE.JS 3D FUNCTIONS #########
function init(){
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  const renderer = new THREE.WebGLRenderer({antialias: true});
  const controls = new OrbitControls( camera, renderer.domElement );

  camera.position.set(-50,20,50);
  controls.update()


  loadFilesGLTF(object_files, scene, main_objects);


  // const axesHelper = new THREE.AxesHelper( 10 );
  // scene.add( axesHelper );

  renderer.setSize( window.innerWidth, window.innerHeight );
  // document.body.appendChild( renderer.domElement );
  viewport.appendChild( renderer.domElement );

  const light = new THREE.AmbientLight( 0x404040, 0.6 ); // soft white light
  scene.add( light );

  const dirLight = new THREE.DirectionalLight( 0xcccccc, 1.5 );
  const dirLight2 = new THREE.DirectionalLight( 0xededed, 0.8 );
  dirLight.position.set( 10, 10, 20 );
  dirLight2.position.set( -15, -15, -10 );
  scene.add( dirLight );
  scene.add( dirLight2 );

  renderer.outputEncoding = THREE.sRGBEncoding;

  return {scene, camera, renderer, controls}
}

function onPointerClick( event ) {
  if (intersected_group && intersected_group.children) {
    intersected_group.children.forEach(c=>{c.material.color = previous_color})
  }
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera( pointer, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true );

  if (intersects.length > 0){
    if(!(intersects[0].object.parent.name in main_objects)) return;

    intersected_group = intersects[0].object.parent

    previous_color = intersects[0].object.material.color.clone()

    intersected_group.children.forEach(c=>c.material.color.set(0xff681c))

    console.log("Selected: " + intersected_group.name)

    renderImageGallery(intersected_group.name);

  } else {
    intersected_group = null;
    clearRenderedBody();
    renderTitle(DEFAULT_TITLE);
    closeImageModal();
  }

}

function animate() {
  requestAnimationFrame( animate );
  // controls.update();
  render()
}

function render() {
	renderer.render( scene, camera );
}

function resize(width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  controls.update();
  render();
}