"use client"

//import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';

import axios from 'axios';

import {Meteor} from "./lib/definitions"
import Button from '@mui/material/Button';

interface ChildProps {
  //meteors: Meteor[];
  selectedRow: number;
  setSelectedRow: (row:number) => (void); //React.Dispatch<React.SetStateAction<number>>;
  setActiveMeteor : React.Dispatch<React.SetStateAction<Meteor | undefined>>;
}

let counter = -2;

function fillMeteorFromId(id:number, 
      setActiveMeteor: React.Dispatch<React.SetStateAction<Meteor | undefined>>,
      setSelectedRow: (row:number) => (void)) : void {
  // Call the NEO webservice to complement data
  console.log("Calling Enrichment API");
  axios.get(`https://neo-api-proxy.onrender.com/neo/${id}?enrich=true&impact=true`) // or external API
    .then((res) => 
      {
        //setData(res.data); 
        console.log(res.data);

        // normal data
        const name = res.data.name_limited ?? res.data.name;
        const diameter = res.data.estimated_diameter.kilometers.estimated_diameter_max;
        const neo = res.data.is_potentially_hazardous_asteroid;
        const identification_date = res.data.orbital_data.first_observation_date;

        // enrichment data
        const speed = res.data.impact.inputs_resolved.velocity_kms;
        const mass =  res.data.enrichment.mass_kg;
        const crater_size = res.data.impact.crater.final_diameter_km;
        const crater_depth = res.data.impact.crater.depth_km;
        const energy_tnt_mt = res.data.impact.energy.tnt_Mt;
        const tsunami = res.data.impact.ocean?.aux ?? 0.0;
        const seismic = res.data.impact.seismic.Mw;

        const auxMeteor : Meteor = {
          "meteor_id": Number(id),
          "name": name,
          "diameter_x": diameter ?? 1.0,
          "diameter_y": diameter ?? 1.0,
          "diameter_z": diameter ?? 1.0,
          "mass": mass ?? 1.0,
          "speed": speed ?? 1.0,
          "NEO": neo,
          "date": identification_date,
          "crater_size": crater_size ?? 0.0,
          "crater_depth": crater_depth ?? 0.0,
          "energy_tnt_mt": energy_tnt_mt ?? 0.0,
          "tsunami" : tsunami ?? 0.0,
          "seismic" : seismic ?? 0.0,
          "shape_id": 0
        };        
        console.log("Setting active meteor to: ", auxMeteor);
        setSelectedRow(counter);
        setActiveMeteor(auxMeteor);
        counter = counter-1;

      })
    .catch((err) => console.error(err));
}

export default function MeteorTable({/*meteors,*/ selectedRow, setSelectedRow, setActiveMeteor} : ChildProps) {
  
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [pageNum, setPageNum] = useState(1);

    const toggleRow = (rowElm: HTMLTableRowElement,id:number) => {
        setSelectedRow(id);
        const matches = rowElm.cells[2].textContent.match(/[\d.]+/g); // extracts all numbers

        let first : number = 1;
        let second : number = 1;
        let third : number = 1;
        if (matches && matches.length >= 3) {
          const [afirst, asecond, athird] = matches.map(Number);
          first = afirst;
          second = asecond;
          third = athird;
        }

        // Call the NEO webservice to complement data
        console.log("Calling Enrichment API");
        axios.get(`https://neo-api-proxy.onrender.com/neo/${id}?enrich=true&impact=true`) // or external API
          .then((res) => 
            {
              //setData(res.data); 
              console.log(res.data);

              const speed = res.data.impact.inputs_resolved.velocity_kms;
              const mass =  res.data.enrichment.mass_kg;
              const crater_size = res.data.impact.crater.final_diameter_km;
              const crater_depth = res.data.impact.crater.depth_km;
              const energy_tnt_mt = res.data.impact.energy.tnt_Mt;
              const tsunami = res.data.impact.ocean?.aux ?? 0.0;
              const seismic = res.data.impact.seismic.Mw;

              const auxMeteor : Meteor = {
                "meteor_id": Number(id),
                "name": rowElm.cells[1].textContent.trim() ?? "NO NAME",
                "diameter_x": first ?? 1.0,
                "diameter_y": second ?? 1.0,
                "diameter_z": third ?? 1.0,
                "mass": mass ?? 1.0,
                "speed": speed ?? 1.0,
                "NEO": Boolean(rowElm.cells[4].textContent),
                "date": rowElm.cells[5].textContent,
                "crater_size": crater_size ?? 0.0,
                "crater_depth": crater_depth ?? 0.0,
                "energy_tnt_mt": energy_tnt_mt ?? 0.0,
                "tsunami" : tsunami ?? 0.0,
                "seismic" : seismic ?? 0.0,
                "shape_id": 0
              };        
              console.log("Setting active meteor to: ", auxMeteor);
              setActiveMeteor(auxMeteor);
            })
          .catch((err) => console.error(err));


    }

    function handlePrevClick() {
      if (pageNum==1)
        return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = data && (data as unknown as {links : {prev : string}}).links.prev;
      axios.get(url) // or external API
        .then((res) => {setData(res.data); console.log(res.data); setPageNum(pageNum-1);})
        .catch((err) => console.error(err));
    }

    function handleNextClick() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = data && (data as unknown as {links : {next : string}}).links.next;
      axios.get(url) // or external API
        .then((res) => {setData(res.data); console.log(res.data); setPageNum(pageNum+1);})
        .catch((err) => console.error(err));
    }

    function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter') {
        console.log("Enter was pressed:: ",search);
        fillMeteorFromId(Number(search),setActiveMeteor,setSelectedRow);
      }  
    }

    useEffect(() => {
      console.log("Calling API");
      axios.get('https://neo-api-proxy.onrender.com/neo/browse?page=0&size=20&mitigations=false&enrich=false') // or external API
        .then((res) => {setData(res.data); console.log(res.data);})
        .catch((err) => console.error(err));
    }, []);
  
    return (
    <div>
      <table><tbody><tr>
        <td>
          <TextField id="search_meteor" title="search" name="search" variant="standard" className=""
                          value={search} placeholder="Hit Enter to Search..." 
                          onChange={e => setSearch(e.target.value)}
                          onKeyDown={handleKeyDown}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
          />
        </td>
        <td className="pl-10"><Button variant='contained' onClick={handlePrevClick} >Prev</Button></td>
        <td className="pl-10">{pageNum}</td>
        <td className="pl-10"><Button variant='contained' onClick={handleNextClick} >Next</Button></td>
      </tr></tbody></table>
      <div className="h-[90vh] overflow-auto b-10">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Sizes(km)</TableCell>
                <TableCell align="right">Mass(kg)</TableCell>
                <TableCell align="right">N.E.O.</TableCell>
                <TableCell align="right">Identification Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && (data as unknown as {near_earth_objects : Array<any>}).near_earth_objects 
                  &&((data as unknown as {near_earth_objects : Array<any>}).near_earth_objects as Array<any>).map((meteor) => (
                <TableRow
                  key={meteor.id}
                  hover
                  sx={{ 
                        '&:hover': {
                            backgroundColor: '#f500f5',
                        },
                        '&:hover .MuiTableCell-root': {
                            backgroundColor: meteor.id === selectedRow ? '#8080ff' : '#eeeeff',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#9999ff', // your custom color
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: '#ffff00', // optional: hover color for selected row
                        },
                        '&:last-child td, &:last-child th': { border: 0 }, 
                    }}
                  selected = {meteor.id === selectedRow}
                  onClick={(e) => toggleRow(e.currentTarget, meteor.id)}
                >
                    <TableCell component="th" scope="row">
                        {meteor.id}
                    </TableCell>
                    <TableCell align="right">
                        {meteor.name_limited ? meteor.name_limited : meteor.name}
                    </TableCell>
                    <TableCell align="right">{"[" + Number(meteor.estimated_diameter.kilometers.estimated_diameter_max).toPrecision(3) 
                                + " x " + Number(meteor.estimated_diameter.kilometers.estimated_diameter_max).toPrecision(3) 
                                + " x " +  Number(meteor.estimated_diameter.kilometers.estimated_diameter_max).toPrecision(3) + "]"}
                    </TableCell>
                    <TableCell align="right">{meteor.mass}</TableCell>
                    <TableCell align="right">{meteor.is_potentially_harzadous_asteroid ? "YES" : "NO"}</TableCell>
                    <TableCell align="right">{meteor.orbital_data.first_observation_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  </div>  
  );
}

/*
              {meteors.filter(meteor => new RegExp(`${search}`,"i").test(meteor.name)).map((meteor) => (
                <TableRow
                  key={meteor.meteor_id}
                  hover
                  sx={{ 
                        '&:hover': {
                            backgroundColor: '#f500f5',
                        },
                        '&:hover .MuiTableCell-root': {
                            backgroundColor: meteor.meteor_id === selectedRow ? '#8080ff' : '#eeeeff',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#9999ff', // your custom color
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: '#ffff00', // optional: hover color for selected row
                        },
                        '&:last-child td, &:last-child th': { border: 0 }, 
                    }}
                  selected = {meteor.meteor_id === selectedRow}
                  onClick={() => toggleRow(meteor.meteor_id)}
                >
                    <TableCell component="th" scope="row">
                        {meteor.meteor_id}
                    </TableCell>
                    <TableCell align="right">
                        {meteor.name}
                    </TableCell>
                    <TableCell align="right">{"[" + meteor.diameter_x 
                                + " x " + meteor.diameter_y 
                                + " x " +  meteor.diameter_z + "]"}
                    </TableCell>
                    <TableCell align="right">{meteor.mass.toExponential(2)}</TableCell>
                    <TableCell align="right">{meteor.NEO ? "YES" : "NO"}</TableCell>
                    <TableCell align="right">{meteor.date}</TableCell>
                </TableRow>
              ))}*/