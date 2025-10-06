"use client";

import { Viewer, Entity, EllipseGraphics } from "resium";
import { BingMapsImageryProvider, BingMapsStyle, Cartesian3, Color, Ion, ProviderViewModel} from "cesium";
import { useEffect, useRef } from "react";
import { ScreenSpaceEventHandler, ScreenSpaceEventType, Cartographic, Math as CesiumMath } from "cesium";
import * as Cesium from "cesium";
import { Meteor } from "@/lib/definitions";

declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}

(window as Window).CESIUM_BASE_URL = "/cesium";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjA5ZDlkNS0yNjQ0LTQwOGUtYTAyMS1kNGNjNmE5Y2I2YzciLCJpZCI6MzQ2NzQ0LCJpYXQiOjE3NTk0NTUwNjJ9.FabdNEg2OQjpkugdHBK-ofyQ09YkzjTnhQxPWF7hL5s";//process.env.NEXT_PUBLIC_CESIUM_TOKEN;

interface ChildProps {
  selectedPoint: [number,number] | undefined;
  meteor: Meteor;
  showCrater: boolean;
  setSelectedPoint: (coords: [number,number] | undefined) => (void); //React.Dispatch<React.SetStateAction<number>>;
}


export default function CesiumViewer({selectedPoint, setSelectedPoint, meteor, showCrater} : ChildProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRefHack = useRef<{ cesiumElement?: Cesium.Viewer }>(null);
    const viewerRef = useRef<Cesium.Viewer>(null);

    const viewer = viewerRefHack.current?.cesiumElement;

    useEffect(() => {
    const timer = setTimeout(() => {
        const viewer = viewerRefHack.current?.cesiumElement;
        console.log("viewerRef",viewerRef);
        console.log("viewerRef.current",viewerRef.current);
        console.log("viewerRef.current.cesiumElement",viewerRefHack.current?.cesiumElement);
        console.log("containerRef",containerRef);

        if (viewer) {
            const canvas = viewer.cesiumWidget.canvas;
            console.log("canvas.width",canvas.width);
            console.log("containerRef.current.clientWidth",containerRef.current?.clientWidth);
            console.log("containerRef.current.clientHeight",containerRef.current?.clientHeight);
            const cesiumElement = viewer;
            //const dropDown = cesiumElement.baseLayerPicker._dropPanel;
            const dropDown = (cesiumElement.baseLayerPicker as unknown as { _dropPanel: HTMLElement })._dropPanel;

            console.log("cesiumElement.baselayerPicker",cesiumElement.baseLayerPicker);
            console.log("dropPanel",dropDown);

            //cesiumElement.baseLayerPicker._container.style.display="none";
            dropDown.style.display = "none";
            const parentWidth = containerRef.current?.clientWidth;
            const parentHeight = containerRef.current?.clientHeight;
            //canvas.resize();
            canvas.width = parentWidth ?? 400;
            //canvas.style.width = "800";
            canvas.height = parentWidth ?? 400;
            //canvas.style.height = "700";
            viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[1];
            
            // Click Handler
            const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((click : { position: Cesium.Cartesian2 }) => {
                const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

                if (cartesian) {
                    const cartographic = Cartographic.fromCartesian(cartesian);
                    const latitude = CesiumMath.toDegrees(cartographic.latitude);
                    const longitude = CesiumMath.toDegrees(cartographic.longitude);

                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    setSelectedPoint([latitude,longitude]);
                } else {
                    console.log("Clicked outside the globe.");
                }
            } , ScreenSpaceEventType.LEFT_CLICK);
        }
        else {
            console.warn("Not ready yet");
        }
    }, 100); // Delay to allow mount

    return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showCrater && selectedPoint) {
            console.log("showCrater useEffect started...");
            const camera = viewerRefHack.current?.cesiumElement?.camera;
            const entities = viewerRefHack.current?.cesiumElement?.entities;
            console.log("camera: ", camera);

            camera?.flyTo({
                destination: Cartesian3.fromDegrees(selectedPoint[1] , selectedPoint[0], 500000), // São Paulo
                orientation: {
                    heading: CesiumMath.toRadians(0),
                    pitch: CesiumMath.toRadians(-90),
                    roll: 0,
                },
            });

/*
            entities?.add({
                position: Cartesian3.fromDegrees(selectedPoint[1] , selectedPoint[0]),
                ellipse: {
                semiMajorAxis: 100.0,
                semiMinorAxis: 100.0,
                material: Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Color.BLACK,
                height: 0,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                },
            });
*/
        }    
    }), [showCrater];

  return (
    <div ref={containerRef}
        /*
        style={{
            border: "2px solid red", 
            width: "100vw",
            height: "100vh",
            //position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}*/
    >
        <Viewer ref={viewerRefHack}
            /*style={{
                border: "2px solid red", 
                width: "100vw",
                height: "100vh",
                //position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                overflow: "hidden",
            }}
            */    
            shouldAnimate={true}
            timeline={false}
            animation={false}
            baseLayerPicker={true}
            fullscreenButton={false}
            vrButton={false}
            geocoder={true}
            homeButton={false}
            sceneModePicker={false}
            navigationHelpButton={false}
            infoBox={false}
            selectionIndicator={false}
/*            imageryProviderViewModels={[

                new ProviderViewModel({
                    name: 'Bing Aerial',
                    iconUrl: 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Widgets/Images/ImageryProviders/bingAerial.png',
                    tooltip: 'Bing Maps aerial imagery',
                    creationFunction: () =>
                        new BingMapsImageryProvider({
                            //url:'https://dev.virtualearth.net',
                            key: 'YOUR_BING_MAPS_API_KEY',
                            mapStyle: BingMapsStyle.AERIAL_WITH_LABELS
                        })
                })
            ]}
*/
        >
{/*        <Entity
            name="Brasilia"
            position={Cartesian3.fromDegrees(-44.921822, -15.826691, 1000000)}
            point={{ pixelSize: 10, color: Color.BLUE }}
        />
*/}
        {selectedPoint && (!showCrater) && (<Entity
            name="Circle"
            position={Cartesian3.fromDegrees(selectedPoint[1] , selectedPoint[0], 1000)}
            point={{ pixelSize: 10, color: Color.YELLOW }}
        />)
        }

        {showCrater && selectedPoint && (
            <div>
                
                <Entity
                    position={Cartesian3.fromDegrees(selectedPoint[1] , selectedPoint[0], 1000)}>
                <EllipseGraphics
                    semiMajorAxis = {meteor.crater_size* 1000.0 / 2.0}
                    semiMinorAxis = {meteor.crater_size* 1000.0 / 2.0}
                    material =  {Color.RED.withAlpha(0.5)}
                    outline = {true}
                    outlineColor = {Color.BLACK}
                    height = {0}
                    heightReference = {Cesium.HeightReference.CLAMP_TO_GROUND}
                />
                </Entity>
            </div>
        )} 
        
        </Viewer>
    </div>
  );

}

//<p>Boom point={selectedPoint} craterSize={meteor.crater_size} km</p>
