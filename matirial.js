import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Load textures
const textureLoader = new THREE.TextureLoader();
// textureLoader.load("texture2.webp", (texture) => {
//   material.map = texture;
//   material.needsUpdate = true;
// });

const customTexture = textureLoader.load("default.jfif");

const customMaterial = new THREE.MeshStandardMaterial({
  map: customTexture,
  roughness: 0.5,
  metalness: 0.5,
  emissive: 0x000000,
  side: THREE.BackSide,
});

const ButtonMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000, // Black color
  roughness: 0.5,
  metalness: 0.5,
});

 
function setImage(imgData) {
  if (imgData) {
    const img = new Image();
    img.src = imgData; 
    img.onload = () => {
      
      textureLoader.load(img.src, (newTexture) => {
        customMaterial.map = newTexture;
        customMaterial.needsUpdate = true;
      });
    };
    img.onerror = () => {
      console.error("Failed to load image.");
    };
  } else {
    console.warn("No cover art available.");
  }
}

export { customMaterial, ButtonMaterial, setImage };
