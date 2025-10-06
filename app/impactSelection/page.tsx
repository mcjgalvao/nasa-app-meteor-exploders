'use client';

import {useEffect, useState} from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button';
import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

import EarthGlobe from "./EarthGlobe";
import ImpactResults from "./ImpactResults";

import { Meteor } from "@/lib/definitions";


export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuxHome/>
    </Suspense>  
  );
}

function AuxHome() {
  const [selectedPoint, setSelectedPoint] = useState<[number ,number] | undefined>();
  const [showVideo, setShowVideo] = useState(false);
  const [showCrater, setShowCrater] = useState(false);
  const [activeMeteor, setActiveMeteor] = useState<Meteor>();
  
  const searchParams = useSearchParams();
  const raw = searchParams.get('data');
  const meteor = raw ? JSON.parse(raw) : null;
  
  useEffect(() => {
    console.log("selectedPoint: ", selectedPoint);  
    console.log("meteor", activeMeteor);
  }), [selectedPoint];
  
  function handleLaunchClick() {
    setShowCrater(true);
  }

  function handleHelpClick() {
    setShowVideo(true);
  }


  return (
    <Suspense fallback={<div>Loading...</div>}>
      {meteor && (<main className="flex flex-col gap-[10px] row-start-1 items-center sm:items-start border border-green-900 h-screen">
        <div>
            <div>
              <Button className="absolute" onClick={handleHelpClick} endIcon={<HelpOutlineIcon />}>Video Help</Button>
            </div>
          {showVideo && (<div><video
              src="/video/video_2.mp4"
              autoPlay
              //muted
              loop
              controls
              className="fixed top-0 left-0 w-140 h-260 object-cover z-50 bg-black/80"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 left-4 z-50 bg-white px-3 py-1 rounded"
            >
              Close
            </button></div>)}
          <div>
            <div id="three-div" className="inline-block bordedr border-blue-900 pt-4 pl-10 w-[53vw] h-[40vh] align-top grid-rows-[1fr_auto] ">
              <h1 className="text-4xl font-bold pb-2 text-center">Select impact point</h1>
              <EarthGlobe selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} 
                          meteor={meteor} showCrater={showCrater}/>
              <center>
                <Button sx={{ fontSize: '2rem', backgroundColor: 'red'}} size="large" 
                    variant='contained' onClick={handleLaunchClick} >Launch!!!
                </Button>
              </center>
            </div>
            <div className="inline-block justify-items-center w-[45vw] p-5">
              {showCrater && <ImpactResults meteor={meteor} showCrater={showCrater}
  /*              {
                  meteor_id: 0,
                  name: "2021RN16",
                  diameter_x: 9.5,
                  diameter_y: 9.5,
                  diameter_z: 9.5,
                  mass: 1167192.31,
                  speed: 120.3,
                  NEO: true,
                  date: "2025-09-23"
                }} */
                  />
              }
            </div>          
          </div>
        </div>
      </main>)}
    </Suspense>
  );

}