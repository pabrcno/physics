import { Plane, Body, Vec3 } from "cannon";
import * as THREE from "three";

import { environmentMapTexture } from "./textures";
import { concrete } from "./physicsMaterials";
const position = [0, 0, 0];
const rotationAngle = -Math.PI * 0.5;
const floorShape = new Plane();
const phBody = new Body({
  mass: 0,
  position: new Vec3(...position),
  shape: floorShape,
  material: concrete,
});

phBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), rotationAngle);

const tdFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
tdFloor.receiveShadow = true;
tdFloor.rotation.x = rotationAngle;

export const floor = {
  tdFloor,
  phBody,
};
