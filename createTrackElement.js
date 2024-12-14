import * as THREE from "three";
const loader = new GLTFLoader();

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
let cd_count = 0;

const fontLoader = new FontLoader();
function createCD(scene, material, x, y, z, trackname) {
  loader.load("/models/cd.glb", (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.rotateY((Math.PI / 2) * 3);
        child.position.set(x, y, z);
        child.name = "cd" + cd_count;

        cd_count++;
        return cd_count;
      }
    });
    //add text
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry(trackname.slice(0, 32), {
        font: font,
        size: 0.05,
        height: 0.002,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.002,
        bevelSegments: 5,
      });

      const textMesh = new THREE.Mesh(textGeometry, material);
      textMesh.rotateY(Math.PI / 2);
      //  0, 0.5, -4

      //   0, 0.65, -4

      //   0, 0.8, -4

      textMesh.position.set(x + 0.25, y, z + 0.5); // Center the text
      textMesh.name = "text" + cd_count;
      scene.add(textMesh);
    });
  });
}
function chanagePositionPlay(name, scene) {
  const object = scene.getObjectByName("cd" + name);
  const text = scene.getObjectByName("text" + name);
  if (object && text) {
    object.position.x = 0.25;

    text.position.x = 0.5;
  } else {
    console.warn(`Object with name "${name}" not found.`);
  }
}
function controlerPosition(scene,percentage) {
  //  now 0.65z
  // to -0.65z
  const start = 0.65;
  const end = -0.65;
  

  const totalRange = start - end;

 
  const result = totalRange * (percentage / 100);

 
  const z = start - result;
  const controler = scene.getObjectByName("controler");
  controler.position.z = z;
  
}


function controlerSetPosition(scene,x,y){
  const controler = scene.getObjectByName("controler");
  controler.position.x =x;
  controler.position.y =y;
}

export { createCD, chanagePositionPlay ,controlerPosition,controlerSetPosition};
