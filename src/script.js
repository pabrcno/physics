import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON from "cannon";
import { createSphere, createCube } from "./shapes.js";
import { floor } from "./floor.js";
import { concreteRubberContactMaterial } from "./physicsMaterials";
/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Physics

const world = new CANNON.World();

world.gravity.set(0, -9.82, 0);
// broadphase is the way to detect collisions
// by default, it's a bounding box algorithm
// but we can use a more performant algorithm
world.broadphase = new CANNON.SAPBroadphase(world);
// when an object is still sleep stops triggering collision events
// if it is moved it will start triggering collision events again
world.allowSleep = true;
// contact material is a relation between two materials
// it defines the ways of the collision
world.addContactMaterial(concreteRubberContactMaterial);

// the floor is an infinite plane
world.addBody(floor.phBody);

/**
 * Floor
 */
scene.add(floor.tdFloor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//  objects

let objects = [];

document.addEventListener("click", () => {
  objects.push(
    createSphere(
      [Math.random() - 0.5, Math.random() * 5, Math.random()],
      Math.random() * 0.5,
      world,
      scene
    )
  );
});

document.addEventListener("keypress", () => {
  objects.push(
    createCube(
      [Math.random() - 0.5, Math.random() * 5, Math.random()],
      Math.random() * 0.5,
      world,
      scene
    )
  );
});

/**
 * Animate
 */

const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const delta = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, delta, 3);
  objects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
