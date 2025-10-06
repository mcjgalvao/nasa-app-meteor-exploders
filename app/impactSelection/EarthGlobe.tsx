"use client";


import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Meteor } from "@/lib/definitions";

//import CesiumViewer from "./CesiumViewer";

interface ChildProps {
  selectedPoint: [number,number] | undefined;
  setSelectedPoint: (coords: [number,number] | undefined) => (void); //React.Dispatch<React.SetStateAction<number>>;
  meteor: Meteor;
  showCrater: boolean;
}

const CesiumViewer = dynamic(() => import("./CesiumViewer").then(mod => mod.default), {
  ssr: false,
});

export default function EarthGlobe({selectedPoint, setSelectedPoint, meteor, showCrater} : ChildProps) {
  useEffect(() => {
    // Optional: configure Cesium settings here
  }, []);

  return (
    <CesiumViewer selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} meteor={meteor} showCrater={showCrater}/>

  );
}

