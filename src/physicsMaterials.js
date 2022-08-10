import { Material, ContactMaterial } from "cannon";

export const concrete = new Material("concrete");

export const rubber = new Material("rubber");

export const concreteRubberContactMaterial = new ContactMaterial(
  concrete,
  rubber,
  {
    friction: 0.2,
    restitution: 0.7,
  }
);
