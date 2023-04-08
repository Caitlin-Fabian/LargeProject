import React,{ useMemo } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../App.css";

const ucf = { lat: 28.60117044744501, lng: -81.20031305970772 }

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

const redIcon = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`;
const greenIcon = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`;

const markerIcon = (visited) => {
  let ret = { url: greenIcon, // URL of the custom icon
  scaledSize: new window.google.maps.Size(40, 40), // size of the icon
  origin: new window.google.maps.Point(0, 0), // origin of the icon
  anchor: new window.google.maps.Point(20, 40) // anchor point of the icon
  };  

  if(!visited){
    ret.url =  redIcon;
  }
  return ret;
}; 

export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAkCmoZ_FJ_ra6gJ-lJ2VToeO3mZNmqTJM",
  });

  if (!isLoaded) return <div>Loading...</div>
  return (
    <Map />
  );
}
//console.log(locations[0][0].lat);
function Map() {
  let locations = [
    [/*arboretum*/{ lat: 28.600904362555667, lng: -81.19679500000177 }, true],
    [/*library*/{ lat: 28.600582998057156, lng: -81.20146960470308 }, false],
    [/*gym*/{ lat:28.59617335594502, lng: -81.19928468705896 }, true],
    [/*cb1*/{ lat: 28.603733242308454, lng: -81.20054998037958 }, true],
    [/*student union*/{ lat: 28.60160681694149, lng: -81.20044675481425 }, false],
    [/*eng II*/{ lat: 28.601418424934305, lng: -81.19848337782615 }, true],
  ]
  const ucf = useMemo(() => ({ lat: 28.60117044744501, lng: -81.20031305970772 }), []);

  return(
    <>
      <div>
        <NavBar />
        <PageTitle />
        Journey
      </div>
      <GoogleMap
        zoom={17}
        center={ucf}
        options={{ mapId: "6a034a94ab148b12", disableDefaultUI: true, draggable: false }}
        clickableIcons={false}
        mapContainerClassName="map-container" >
          <Marker position={locations[0][0]} icon={markerIcon(locations[0][1])} />
          <Marker position={locations[1][0]} icon={markerIcon(locations[1][1])}/>
          <Marker position={locations[2][0]} icon={markerIcon(locations[2][1])}/>
          <Marker position={locations[3][0]} icon={markerIcon(locations[3][1])}/>
          <Marker position={locations[4][0]} icon={markerIcon(locations[4][1])}/>
          <Marker position = {locations[5][0]} icon={markerIcon(locations[5][1])}/>      
    </GoogleMap>
  </>
  );
};

