import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadFilesGLTF(filePaths, scene, interactive_objects){
  filePaths.forEach(file => {
    loader.loadAsync(file)
      .then(gltf =>{
        gltf.scene.children.forEach(c=>console.log('loaded: ' + c.name))
        gltf.scene.children.forEach(c=> {if (c.name in interactive_objects) c.children.forEach(cc=> cc.material.color.set(0xffef87))})
        scene.add(...gltf.scene.children)
      })
      .catch(err => console.log( err ))
  })
}
