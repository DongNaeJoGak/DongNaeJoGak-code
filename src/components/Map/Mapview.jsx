// src/components/Map/MapView.jsx
import React, { useState } from 'react';
import KakaoMap from './KakaoMap';
import LocationButton from './LocationButton';

const MapView = () => {
  const [clickedPosition, setClickedPosition] = useState(null);

  const handlePinClick = (position) => {
    setClickedPosition(position);
  };

  return (
    <div className="w-full h-full">
      <LocationButton/>
      <KakaoMap onMapClick={handlePinClick} />
      
      {/* <p className="text-center text-gray-500 mt-4">
        {clickedPosition
          ? `📍 위도: ${clickedPosition.lat}, 경도: ${clickedPosition.lng}`
          : '지도를 클릭해 위치를 선택하세요'}
      </p> */}
    </div>
  );
};

export default MapView;
