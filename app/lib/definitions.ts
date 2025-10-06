export type Meteor = {
  meteor_id: number;
  name: string;
  diameter_x: number;  // in km
  diameter_y: number;  // in km
  diameter_z: number;  // in km
  mass: number;  // in kg
  speed: number;  // in km/s
  NEO: boolean;
  date: string;  // identification date
  crater_size: number;  // in km - /impact/crater/final_diameter_km
  crater_depth: number; // in km - /impact/creater/depth_km
  energy_tnt_mt: number; // in Mt - /impact/energy/tnt_Mt
  tsunami : number; // wave hight in mt - /impact/ocean/?
  seismic : number; // Momentum Magnitude in Mw - /impact/seismic/Mw 
  shape_id?: number;
};

/*
export type ReferenceObjectType = {
  name: string;
  url: string;
  pos: [number,number,number];
};
*/

export type ShapeType = {
  name: string;
  url: string;
  pos: [number,number,number];
  scale: [number,number,number];
  rot: [number,number,number];
};