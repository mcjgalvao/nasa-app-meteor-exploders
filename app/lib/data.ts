import { ShapeType } from "./definitions";

export const meteorShapes: ShapeType[] = [
    {name: "Meteor 1", url: "./3d/meteor.glb", pos: [0.0,-5.0,0.0], scale: [1.0,1.0,1.0], rot:[0.0,0.0,0.0]},
    {name: "Meteor 2", url: "./3d/meteor2.glb", pos: [0.0,0.0,0.0], scale: [0.45,0.45,0.45], rot:[0.0,0.0,0.0]},
    {name: "Meteor 3", url: "./3d/asteroide_1.glb", pos: [0.0,0.0,0.0], scale: [0.12,0.12,0.12], rot:[0.0,0.0,0.0]},
    {name: "Meteor 4", url: "./3d/asteroide_2.glb", pos: [0.0,0.0,-20.0], scale: [0.16,0.16,0.16], rot:[0.0,0.0,0.0]},
    {name: "Meteor 5", url: "./3d/asteroide_3.glb", pos: [0.0,0.0,0.0], scale: [0.07,0.07,0.07], rot:[0.0,0.0,0.0]},
    {name: "Meteor 6", url: "./3d/asteroide_4.glb", pos: [0.0,0.0,0.0], scale: [0.15,0.15,0.15], rot:[0.0,0.0,0.0]},
    {name: "Meteor 7", url: "./3d/asteroide_5.glb", pos: [0.0,0.0,0.0], scale: [0.55,0.55,0.55], rot:[0.0,0.0,0.0]},
];

export const referenceBases : ShapeType[] = [
    {name: "Soccer Field", url: "./3d/soccer-field.glb", pos: [0.0,-0.05,0.0], scale: [0.075,0.075,0.075], rot:[0.0,0.0,0.0]},
    {name: "Manhattan", url: "./3d/manhattan.glb", pos: [0.0,0.0,0.0], scale: [1.0,1.0,1.0], rot:[0.0,0.0,0.0]},
    {name: "Texas", url: "./3d/texas.glb", pos: [0.0,-7.2,0.0], scale: [150.0,150.0,150.0], rot:[0.0,0.0,0.0]},
];

export const referenceObjects : ShapeType[] = [
    {name: "Camel", url: "./3d/camel.glb", pos: [0.0,-0.05,0.0], scale: [0.002,0.002,0.002], rot:[-Math.PI/10.0,-Math.PI/2.0,-Math.PI/10.0]},
    {name: "Onbius", url: "./3d/onibus.glb", pos: [2.0,0.0,0.0], scale: [1.0,1.0,1.0], rot:[0.0,0.0,0.0]},
    {name: "XangaiTower", url: "./3d/torre-xangai.glb", pos: [2.0,0.0,0.0], scale: [1.0,1.0,1.0], rot:[0.0,0.0,0.0]},
    {name: "EL", url: "./3d/EL.glb", pos: [1.0,0.12,0.0], scale: [0.3,0.3,0.3], rot:[0.0,0.0,0.0]},
    {name: "Everest", url: "./3d/everest.glb", pos: [10.0,2.25,9.0], scale: [14.0,14.0,14.0], rot:[0.0,0.0,0.0]},
    {name: "Person", url: "./3d/person.glb", pos: [0.0,0.0,0.0], scale: [1.0,1.0,1.0], rot:[0.0,0.0,0.0]},
];

// x, altura, (comprimento de manhattan + pos->el))

/*
    central park: 4km x 800m
    Escala: 1 unidade virtual = 100m

          scale= {multiplyVectors([activeMeteor.diameter_x/activeMeteor.diameter_z*0.55,
            activeMeteor.diameter_y/activeMeteor.diameter_z*0.55,
            activeMeteor.diameter_z/activeMeteor.diameter_z*0.55],
            meteorShapes[activeMeteor.shape_id ?? 0].scale)
          } 


*/
