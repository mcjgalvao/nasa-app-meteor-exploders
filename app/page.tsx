'use client';

import Image from "next/image";
import dynamic from "next/dynamic";
import MeteorTable from "./MeteorTable";
import {useState} from 'react';

import Button from "@mui/material/Button";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {meteors} from "./lib/placeholder-data"
import MeteorForm from "./MeteorForm";
import { Meteor } from "./lib/definitions";

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: true });


export default function Home() {

  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [activeMeteor, setActiveMeteor] = useState<Meteor>();
  const [showVideo, setShowVideo] = useState(false);
  
  const mySetSelectedRow = (newValue :number) => {
    setSelectedRow(newValue);
    const meteor = meteors.find(meteor => meteor.meteor_id == selectedRow);
    setActiveMeteor(meteor);
  }

  function handleHelpClick() {
    setShowVideo(true);
  }

  return (
      <main className="flex flex-col gap-[10px] row-start-1 items-center sm:items-start border border-green-900 h-screen">
        <div>
          <Button onClick={handleHelpClick} endIcon={<HelpOutlineIcon />}>Video Help</Button>
        </div>
        <div>
          {showVideo && (<div><video
            src="/video/video_1.mp4"
            autoPlay
            //muted
            loop
            controls
            className="fixed top-0 left-0 w-100 h-80 object-cover z-50 bg-black/80"
          />
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 left-4 z-50 bg-white px-3 py-1 rounded"
          >
            Close
          </button></div>)}

          <div>
            <div className="inline-block justify-items-center w-[45vw] p-5">
              <h1 className="text-4xl font-bold p-2">Select an asteroid</h1>
              <MeteorTable selectedRow={selectedRow} 
                          setSelectedRow={mySetSelectedRow} setActiveMeteor={setActiveMeteor}/>
            </div>
            <div id="three-div" className="inline-block bordedr border-blue-900 pt-4 pl-10 w-[53vw] h-[60vh] align-top grid-rows-[1fr_auto] ">
              <ThreeScene key={activeMeteor?.meteor_id} activeMeteor={activeMeteor}/>
              <MeteorForm meteors={meteors} selectedRow={selectedRow} /*setSelectedRow={mySetSelectedRow} */
                          activeMeteor={activeMeteor} setActiveMeteor={setActiveMeteor} 
                          />
            </div>
          </div>
        </div>
      </main>
  );
}
