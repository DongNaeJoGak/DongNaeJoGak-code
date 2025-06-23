// src/components/Map/KakaoMap.jsx
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import SmallGreenMarker from '../../assets/SmallGreenMarker.svg';

const KakaoMap = ({ onMapClick, selectedPlace, currentLocation }) => {
  const [mapCenter, setMapCenter] = useState({
    lat: 35.1795543,
    lng: 129.0756416,
  });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMapCenter(userPos);
          setMarkerPosition(userPos);
          setIsLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setIsLoading(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      setMarkerPosition({
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      });
      setMapCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng }); // 선택된 장소로 지도 중심 이동
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
      setMarkerPosition({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
    }
  }, [currentLocation]);

  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const newPosition = {
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    };
    setMarkerPosition(newPosition);
    // 지도 클릭 시에도 onMapClick을 통해 selectedPlace 형식에 맞게 데이터 전달
    if (onMapClick) {
      onMapClick({
        y: newPosition.lat.toString(),
        x: newPosition.lng.toString(),
        place_name: "선택한 위치",
        road_address_name: "",
        address_name: ""
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        center={mapCenter}
        style={{ width: "100%", height: "100%" }}
        level={3}
        onClick={handleMapClick}
      >
        {!isLoading && (
          <MapMarker
            position={markerPosition}
            image={{
              src: SmallGreenMarker,
              size: {
                width: 80,
                height: 54,
              },
              options:{
                offset: {
                  x:35,
                  y:69
                },
              }
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default KakaoMap;
