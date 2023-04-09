import React,{ useMemo, useState } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../App.css";
import monsters from "../components/monsters";

const ucf = { lat: 28.60117044744501, lng: -81.20031305970772 }

const redIcon = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`;
const greenIcon = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`;


export default function App() {
  const [userMonsterList, setMonsterList] = useState([]);
  const [ran, setRan] = useState(false);
  const [icons, setIcons] = useState ([]);

  const markerIcon = (visited) => {
    let ret = { url: redIcon, // URL of the custom icon
    scaledSize: new window.google.maps.Size(40, 40), // size of the icon
    origin: new window.google.maps.Point(0, 0), // origin of the icon
    anchor: new window.google.maps.Point(20, 40) // anchor point of the icon
    };  
  
    if(visited){
      ret.url =  greenIcon;
    }
    return ret;
  }; 
  
  const createIcons = async () => {
  
    let locations = [];
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    console.log(userId);
    await getUserMonsters(userId);
    if(userMonsterList)
    for(let x=0;x<monsters.length;x++){
      let icon = markerIcon(userMonsterList.includes(monsters[x].id));
      console.log(icon.url);
      locations.push({
        key:monsters[x].id,
        position: monsters[x].pos,
        icon : icon
      });
      
    }
    setIcons(locations);
  }
  
  const getUserMonsters = async (userId) => {
    if(userMonsterList.length === 0 && !ran){
      setRan(true);
      console.log("hi!")
      var bp = require('../components/Path.js');
      var storage = require('../tokenStorage.js');
      var obj = {
          userId: userId,
          jwtToken: storage.retrieveToken(),
      };
      var js = JSON.stringify(obj);
      try {
          const response = await fetch(bp.buildPath('api/getUserInfo'), {
              method: 'POST',
              body: js,
              headers: { 'Content-Type': 'application/json' },
          });
          var res = JSON.parse(await response.text());
          //console.log(res.monsters);
          setMonsterList(res.monsters);
      } catch(e){
        return -1;
      }
    }
  }

  if(icons.length === 0){
    createIcons();
  }
  const ucf = useMemo(() => ({ lat: 28.60117044744501, lng: -81.20031305970772 }), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY ,
  });
  if (!isLoaded) return <div>Loading...</div>
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
        options={{ mapId: process.env.REACT_APP_MAPS_ID_KEY, disableDefaultUI: true, draggable: false }}
        clickableIcons={false}
        mapContainerClassName="map-container" >
          {icons.map(marker => (
              <Marker key={marker.key} position={marker.position} icon={marker.icon} />
          ))}    
    </GoogleMap>
  </>
  );
}

