import { FormEvent, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField'

import {Meteor} from "./lib/definitions"

import { useRouter } from 'next/navigation';
import { meteorShapes } from './lib/data';


interface ChildProps {
  meteors: Meteor[];
  selectedRow: number;
  //setSelectedRow: (row:number) => (void); //React.Dispatch<React.SetStateAction<number>>;
  activeMeteor: Meteor | undefined;
  setActiveMeteor : React.Dispatch<React.SetStateAction<Meteor | undefined>>;
}

export default function MeteorForm({meteors, selectedRow/*, setSelectedRow*/, activeMeteor, setActiveMeteor} : ChildProps) {
  const [error, setError] = useState<string | null>(null);

  const [prevSel, setPrevSel] = useState(-1);
  const [nameChanged, setNameChanged] = useState(false);
  const [selRefreshFlag,setSelRefreshFlag] = useState(false);

  const [name, setName] = useState<string|undefined>(activeMeteor?.name ?? "");
  const [diameterX, setDiameterX] = useState<string|undefined>(activeMeteor?.diameter_x.toString() ?? "");
  const [diameterY, setDiameterY] = useState<string|undefined>(activeMeteor?.diameter_y.toString() ?? "");
  const [diameterZ, setDiameterZ] = useState<string|undefined>(activeMeteor?.diameter_z.toString() ?? "");
  const [mass, setMass] = useState<string|undefined>(activeMeteor?.mass.toExponential().toString() ?? "");
  const [speed, setSpeed] = useState<string|undefined>(activeMeteor?.speed.toString() ?? "");
  const [meteorShape, setMeteorShape] = useState(0);


  const router = useRouter();

  console.log(`sel: ${selectedRow}  prevSel: ${prevSel} activeMeteor: ${activeMeteor}`);

  if(selectedRow!=prevSel) {
    if(activeMeteor != null) {
      setName(activeMeteor.name);
      setDiameterX(activeMeteor.diameter_x.toString());
      setDiameterY(activeMeteor.diameter_y.toString());
      setDiameterZ(activeMeteor.diameter_z.toString());
      setMass(activeMeteor.mass.toExponential(3).toString());
      setSpeed(activeMeteor.speed.toPrecision(4));
      setNameChanged(false);
      setPrevSel(selectedRow);
      //setSelRefreshFlag(true);
    }
  }

  console.log(`Sel: ${selectedRow}  name: ${name}`);

  useEffect(() => {

    if (activeMeteor && (!selRefreshFlag)) {
      //checkNameChanged();
      //setSelRefreshFlag(true);
    }

  },[name,diameterX,diameterY,diameterZ,mass])
  

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = `?data=${encodeURIComponent(JSON.stringify(activeMeteor))}`;

    router.push(`/impactSelection${query}`); 

/*
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Submission failed');
      const data = await response.json();
      console.log('Success:', data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
*/  
    }

  function checkNameChanged() {
    if(!nameChanged) {
      setNameChanged(true);
      setName(name + " (MOD)");
    }
    const auxMeteor : Meteor = {
      "meteor_id": 0,
      "name": name?.trim() ?? "NO NAME",
      "diameter_x": Number(diameterX) ?? 1.0,
      "diameter_y": Number(diameterY) ?? 1.0,
      "diameter_z": Number(diameterZ) ?? 1.0,
      "mass": Number(mass) ?? 1.0,
      "speed": Number(speed) ?? 1.0,
      "NEO": true,
      "date": "2025-09-23",
      "crater_size": activeMeteor?.crater_size ?? 0.0,
      "crater_depth": activeMeteor?.crater_depth ?? 0.0,
      "energy_tnt_mt": activeMeteor?.energy_tnt_mt ?? 0.0,
      "tsunami": activeMeteor?.tsunami ?? 0.0,
      "seismic": activeMeteor?.seismic ?? 0.0,
      "shape_id": Number(meteorShape)
    };
    console.log("Setting active meteor (in Form) to: ", auxMeteor);
    setActiveMeteor(auxMeteor);
  }


  function handleUpdateClick() {
    // Check if sizes are not too different
    const ratio_x = (diameterX && diameterZ) ? Number(diameterX)/Number(diameterZ) : 1.0;
    const ratio_y = (diameterY && diameterZ) ? Number(diameterY)/Number(diameterZ) : 1.0;

    if(ratio_x < 0.1 || ratio_x > 10.0 || ratio_y < 0.1 || ratio_y > 10.0) {
      setError("Sizes are too different. Maximum diffrence is 10x");
      return;
    }
    else {
      setError(null);
    }
    setSelRefreshFlag(false);
    setName(name + " "); //Just to trigger the event
    checkNameChanged();
  }

  return (
    <form className="m-5 space-y-2" onSubmit={handleSubmit}>
      <h1 className='text-2xl font-bold'>Meteor Data</h1>
      <table>
        <tbody>
        <tr>
          <td>
            <table className="m-4 table-auto border-separate border-spacing-1">
              <tbody>
                <tr>
                  <td className="p-1">Name:</td>
                  <td>
                    <TextField id="name" title="name" name="name" variant="standard" 
                      value={name} onChange={e => {setName(e.target.value); setNameChanged(true); /*setSelRefreshFlag(false);*/}}/>
                  </td>
                </tr>
                <tr>
                  <td className="p-1 pr-3">Size X (Km): </td>
                  <td>
                    <TextField id="diameter_x" title="diameter_x" name="diameter_x" variant="standard" 
                      value={diameterX} onChange={e => {setDiameterX(e.target.value); /*setSelRefreshFlag(false);*//* checkNameChanged();*/}}/>
                  </td>
                </tr>
                <tr>
                  <td className="p-1">Size Y (Km): </td>
                  <td>
                    <TextField id="diameter_y" title="diameter_y" name="diameter_y" variant="standard" 
                      value={diameterY} onChange={e => {setDiameterY(e.target.value); /*setSelRefreshFlag(false);*//*checkNameChanged();*/}}/>
                  </td>
                </tr>
                <tr>
                  <td className="p-1">Size Z (Km): </td>
                  <td>
                    <TextField id="diameter_z" title="diameter_z" name="diameter_z" variant="standard" 
                      value={diameterZ} onChange={e => {setDiameterZ(e.target.value); /*setSelRefreshFlag(false);*//*checkNameChanged();*/}}/>
                  </td>
                </tr>
                <tr>
                  <td className="p-1">Mass (Kg): </td>
                  <td>
                    <TextField id="mass" title="mass" name="mass" variant="standard" 
                      value={mass} onChange={e => {setMass(e.target.value); /*setSelRefreshFlag(false);*//*checkNameChanged();*/}}/>
                  </td>
                </tr>
                <tr>
                  <td className="p-1">Speed (Km/s): </td>
                  <td>
                    <TextField id="speed" title="speed" name="speed" variant="standard" 
                      value={speed} onChange={e => {setSpeed(e.target.value); /*setSelRefreshFlag(false);*//*checkNameChanged();*/}}/>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td className="pl-20 align-top">
            <table>
              <tbody>
                <tr>
                  <td>Meteor Shape</td>
                  <td>
                    <Select
                      value={meteorShape}
                      onChange={(e) => setMeteorShape(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 200 }}
                    >
                    <MenuItem value="" disabled>
                      Selecione uma opção
                    </MenuItem>
                    {meteorShapes.map((item, index) => (
                      <MenuItem key={index} value={index}>{item.name}</MenuItem>
                    ))}

                  </Select>

                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        </tbody>
      </table>  
      <div className="flex flex-col sm:flex-row justify-between gap-2 p-4">
        <Button variant='contained' onClick={handleUpdateClick} >Update Visualization</Button>

        <Button variant='contained' className='' type="submit" >Continue</Button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
