'use client'; // if using Next.js App Router

import React , { useRef, useEffect, useState, useMemo}  from 'react';
import { Canvas, useFrame , useThree} from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, use } from '@react-three/drei';
import { Matrix4, Cartesian3, HeadingPitchRoll, Vector3} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BoxHelper, Box3, Object3D,  } from 'three';
import { referenceObjects, referenceBases, meteorShapes} from './lib/data'


const deepClone = (source) => {
  const clone = source.clone(true); // deep clone

  clone.traverse((node) => {
    if (node.isMesh) {
      node.material = node.material.clone();
      node.geometry = node.geometry.clone();
    }
  });

  return clone;
};




function Model({ url, scale, position, rotation }) {
  //useGLTF.clear(url);
  let { scene, nodes, materials, rock } = useGLTF(url)
  const [originalScene, setOriginalScene] = useState(deepClone(scene));

//  const {scene} = useThree();
//  const loader = new GLTFLoader();
  //loader.gltf.scene.clear();
//  loader.load(url, (gltf) => {
    //scene.clear();
    //scene.add(gltf.scene);
//  });



  const modelRef = useRef<Object3D>(null);
  const boxRef = useRef<BoxHelper | null>(null);


  const scaledScene = useMemo(() => {
    console.log('GLTF Nodes:', nodes);
    console.log('GLTF Materials:', materials);
    console.log('GLTF Scene:', scene);
    
    console.log('scale:', scale);

    console.log("scene", scene);
    console.log("originalScene", originalScene);


    const cloneScene = scene.clone();
    const scaleFactor = 1.0;
    cloneScene.scale.set(scale[0]*scaleFactor,scale[1]*scaleFactor,scale[2]*scaleFactor); // Scale x2
    cloneScene.rotation.set(rotation[0],rotation[1],rotation[2]);
    cloneScene.position.set(position[0],position[1],position[2]);  
    return cloneScene;
   }, [scene]);



  useEffect(() => {
    
    if (modelRef.current) {
      const box = new BoxHelper(modelRef.current, 0xff0000);
      boxRef.current = box;
      modelRef.current.add(box);
    }

    //useGLTF.clear(url);
    //let { scene, nodes, materials, rock } = useGLTF(url)

//    const loader = new Loader();
//    loader.load(url, (gltf) => {
//      setModel(gltf.scene);
//    })
/*
    console.log('GLTF Nodes:', nodes);
    console.log('GLTF Materials:', materials);
    console.log('GLTF Scene:', scene);
    
    console.log('scale:', scale);

    console.log("scene", scene);
    console.log("originalScene", originalScene);
*/
    
   //scene.clear();
/*     scene.traverse((child) => {
      if (child.isMesh) {
        scene.remove(child);
        child.geometry.dispose();
        child.material.dispose();
      }
    })
 */
    //originalScene.parent = scene.parent;
/*    originalScene.traverse((child) => {
      if (child.isMesh) {
        scene.add(child);
      }
    })
*/
    
//    scene = deepClone(originalScene);
    //scene.children[0] = originalScene.children[0];
/*
    const scaleMatrix = new Matrix4().makeScale(scale[0],scale[1],scale[2])
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.applyMatrix4(scaleMatrix);
        child.geometry.computeBoundingBox();
        child.geometry.computeBoundingSphere();
      }
    })
  */
  }, [scene])


  return <primitive object={scaledScene} />
}

function Box() {
  const meshRef = useRef();
  
    useFrame((state, delta) => {
        if (meshRef.current) {
            //meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            //meshRef.current.rotation.z += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1,2,3]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
}

function multiplyVectors(a, b) {
  if (a.length !== b.length) throw new Error("Vectors must be the same length");
  return a.map((val, i) => val * b[i]);
}

export default function ThreeScene({key,activeMeteor}) {
  const group2 = useRef();

  const [refBase, serRefBase] = useState(0);
  const [refObject, setRefObject] = useState(0);


  useEffect(() => {
    console.log('Active Meteor:', activeMeteor);

    if (activeMeteor) {
      // Choose right base and reference object based on meteor diameter
      const meteorDiameter = activeMeteor.diameter_x;

      if (meteorDiameter < 0.5) {
        setRefObject(0);
        serRefBase(0);
      }
      else if (meteorDiameter < 5.0) {
        setRefObject(3);
        serRefBase(1);
      }
      else {
        setRefObject(4);
        serRefBase(2);
      }
    }



  }, [activeMeteor])

  const camFactor = 7;

  return (
    <Canvas gl={{ preserveDrawingBuffer: true }}
        style={{ background: 'black' }}
        className='border border-red-800 m-0 '> 
      {activeMeteor && (<PerspectiveCamera makeDefault position={[0, activeMeteor.diameter_x*camFactor, activeMeteor.diameter_x*camFactor]} far={100000} fov={80} zoom={1} />)}
      {activeMeteor && (<ambientLight intensity={0.8}/>)}
      {activeMeteor && (<pointLight intensity={50.0*(activeMeteor.diameter_x*activeMeteor.diameter_x)*camFactor} position={[activeMeteor.diameter_x*camFactor, activeMeteor.diameter_x*camFactor, activeMeteor.diameter_x*camFactor]} />)}
      {activeMeteor && (<pointLight intensity={50.0*(activeMeteor.diameter_x*activeMeteor.diameter_x)*camFactor} position={[-activeMeteor.diameter_x*camFactor, -activeMeteor.diameter_x*camFactor, -activeMeteor.diameter_x*camFactor]} />)}
      {activeMeteor && (
        <Model url={meteorShapes[activeMeteor.shape_id ?? 0].url}
          position= {[0.0,0.9+(activeMeteor.diameter_y-1.25)*0.75,0.0]}  
          rotation = {[0.0,0.0,0.0]}
          scale= {multiplyVectors([activeMeteor.diameter_x*0.55,
            activeMeteor.diameter_y*0.55,
            activeMeteor.diameter_z*0.55],
            meteorShapes[activeMeteor.shape_id ?? 0].scale)
          } 
        />)}
                
      {activeMeteor && (
        <Model //Reference Base
          url={referenceBases[refBase].url} 
          position={referenceBases[refBase].pos}
          rotation={referenceBases[refBase].rot}
          scale={referenceBases[refBase].scale}
        />)}
        
      {activeMeteor && (
        <Model //Reference Object
          url={referenceObjects[refObject].url} 
          position={referenceObjects[refObject].pos}
          rotation={referenceObjects[refObject].rot}
          scale={referenceObjects[refObject].scale}
        />)}
      
      <OrbitControls />
    </Canvas>
  );
}


//style={{ height: '900px', width: '90%'}}

/*
      <group ref={group2} 
        position={referenceObjects[2].pos} 
        rotation={referenceObjects[2].rot} 
        scale={referenceObjects[2].scale}>
      </group>

*/