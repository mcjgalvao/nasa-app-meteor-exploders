"use client";

import { useEffect } from "react";

import { BarChart } from '@mui/x-charts';

import { Meteor } from "@/lib/definitions";


interface ChildProps {
  meteor: Meteor;
  showCrater: boolean;
}

function auxDebugHTML(str: string, maxLength: number) : string{
    const lines = [];
    let ret: string = "";
    for (let i = 0; i < str.length; i += maxLength) {
        lines.push(str.slice(i, i + maxLength));
    }

    lines.forEach(line => {
        ret += line + "<br/>";
    });
    return ret;
}

export default function ImpactResults({meteor, showCrater} : ChildProps) {
  const DEBUG = false;

  useEffect(() => {
    // Optional: configure Cesium settings here
  }, []);

  return (
    
        <div>
            <svg width="0" height="0">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="green" />
                <stop offset="100%" stopColor="red" />
                </linearGradient>
            </defs>
            </svg>
            <h1 className="text-4xl">{meteor.name} Impact Results</h1>

            <h2 className="text-2xl pt-10">Crater Size (Maximum size in km)</h2>
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number(meteor.crater_size.toPrecision(4))] }]}
                yAxis={[{ data: ['km'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 100}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                }}
            />
            <h2 className="text-2xl pt-10">Crater Depth (in km)</h2>
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number(meteor.crater_depth?.toPrecision(4)) ?? 0.0] }]}
                yAxis={[{ data: ['km'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 5}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                }}
            />
            <h2 className="text-2xl">Energy (TNT Mt and TSAR Bombs equivalency)</h2> 
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number(meteor.energy_tnt_mt.toPrecision(5))] }]}
                yAxis={[{ data: ['Mt'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 20000000}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                    
                    
                }}
            />
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number((meteor.energy_tnt_mt / 50.0).toPrecision(5))] }]}
                yAxis={[{ data: ['Tsar Bombs'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 500000}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                    
                    
                }}
            />
            <h2 className="text-2xl">Tsunami (Waves maximum height)</h2>
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number(meteor.tsunami.toPrecision(3))] }]}
                yAxis={[{ data: ['mt'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 100}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                    
                    
                }}
            />
            <h2 className="text-2xl">Seismic (Momentum Magnitude)</h2>
            <BarChart
                width={500}
                height={100}
                layout="horizontal"
                series={[{ data: [Number(meteor.seismic.toPrecision(3))] }]}
                yAxis={[{ data: ['Mw'],  scaleType: 'band' }]}
                xAxis={[{min: 0, max: 20}]}
                barLabel={"value"}
                slotProps={{
                    bar: {
                        style: {
                            fill: 'url(#gradient)', // Reference to SVG gradient
                        },
                    },
                    barLabel: {
                        style: {
                            fill: 'white',     
                            fontWeight: 'bold',
                            fontSize: 14,
                        },
                    },
                    
                    
                }}
            />
            {DEBUG && 
                <div>
                    {auxDebugHTML(JSON.stringify(meteor),30)}
                </div>
            }
        </div>
  );
}
/*
        <div>
            <pre>{JSON.stringify(meteor)}</pre>
        </div>
*/