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

      textMesh.position.set(x+0.25, y, z + 0.5); // Center the text
      scene.add(textMesh);
     
    });
  });
}

export { createCD };
