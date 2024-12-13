import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ButtonMaterial, customMaterial } from './matirial';
import { createCD } from './createTrackElement';
import { addTrack, Next, Play, Prev } from './track';

const canvas = document.querySelector('#canvas');


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//   OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);



const material = new THREE.MeshStandardMaterial();
const loader = new GLTFLoader();


loader.load('/models/player.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Error loading player model:', error);
});
 
// Load screen model
loader.load('/models/screen.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = customMaterial;
      child.castShadow = true;
      child.rotateZ(Math.PI / 2);
      child.rotateY(Math.PI / 2);

      child.position.set(0.2, 2.4, 0); // Set initial position (x, y, z)
    }
  });
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Error loading screen model:', error);
});


loader.load('/models/controler.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.name= "controler";
      child.material = material;
      child.rotateY(Math.PI / 2 * 3);
      child.position.set(0.2, 0.45, 0.65)
    }
  })
})

//Buttons 

// prev button> 
loader.load('/models/prev.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {

      // child.rotateY(Math.PI / 2 * 3);
      child.position.set(0.3, 1, 0.5)
    }
  })
})
// prev button> 
loader.load('/models/play.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {

      // child.rotateY(Math.PI / 2 * 3);
      child.position.set(0.3, 1, 0)
    }
  })
})
// prev button> 
loader.load('/models/next.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {

      // child.rotateY(Math.PI / 2 * 3);
      child.position.set(0.3, 1, -0.5)
    }
  })
})


// add playlist bucket
loader.load('/models/playlist.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {

      child.rotateY(Math.PI / 2 * 3);
      child.position.set(0, 1, -4)
    }
  })
})

//cd dum y


// createText(scene,material)

// play  codinates 
// createCD(scene, material, 0.1, 1.3, 0, "track.name");



// Set camera position
camera.position.x = 5;

// Add a light source for better visibility of materials
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);


// Add lights to the scene

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(5, 10, 7.5);
directionalLight2.castShadow = false;
scene.add(directionalLight2);



 

// Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
canvas.addEventListener('click', onClick, false);

function onClick(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


  raycaster.setFromCamera(mouse, camera);


  const intersects = raycaster.intersectObjects(scene.children); // Check against the cube

  if (intersects.length > 0) {

    const clickedObject = intersects[0].object;
    const objectName = clickedObject.name;
    console.log(objectName)

    if (objectName == "play") {
      //play fuc
      Play(scene)
        
    }
    if (objectName == "next") {
      //play fuc
      Next(scene)
    }
    if (objectName == "prev") {
      //play fuc
      Prev(scene)
    }
    if (objectName == "playlist") {
      // const tracks = [];
      const data = addTrack(scene, material);
      console.log(data)
    }
    if (objectName == "controler") {
      
      
    }


  }
}




// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls and render the scene
  controls.update();
  renderer.render(scene, camera);
  renderer.setClearColor(new THREE.Color(0x87CEEB), 1);
}

// Start the animation loop
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
