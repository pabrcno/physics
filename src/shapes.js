import { Sphere, Body, Vec3, Box } from "cannon";
import * as THREE from "three";
import { rubber } from "./physicsMaterials";
import { environmentMapTexture } from "./textures";

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.2) {
    hitSound.volume = impactStrength * 0.1;
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// position array number
// radius number
// world CANNON.World object
// scene THREE.Scene object
export const createSphere = (position, radius, world, scene) => {
  const dimensions = [radius, 32, 32];

  const shape = new Sphere(...dimensions);

  const body = new Body({
    mass: 1,
    position: new Vec3(...position),
    shape,
    material: rubber,
  });

  const mesh = new THREE.Mesh(sphereGeometry, material);

  mesh.scale.set(radius, radius, radius);

  mesh.castShadow = true;
  mesh.position.set(...position);

  world.addBody(body);
  scene.add(mesh);

  body.addEventListener("collide", playHitSound);

  return {
    mesh,
    body,
  };
};

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

export const createCube = (position, size, world, scene) => {
  const dimensions = [size, size, size];
  const shape = new Box(new Vec3(...dimensions.map((d) => d * 0.5)));
  const body = new Body({
    mass: 1,
    position: new Vec3(...position),
    shape,
    material: rubber,
  });

  const mesh = new THREE.Mesh(cubeGeometry, material);
  mesh.scale.set(...dimensions);
  mesh.castShadow = true;
  mesh.position.set(...position);

  world.addBody(body);
  scene.add(mesh);

  body.addEventListener("collide", playHitSound);

  return {
    mesh,
    body,
  };
};
