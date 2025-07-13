// src/components/Map/MapView.jsx
import React, { useState } from 'react';
import KakaoMap from './KakaoMap';
import LocationButton from './LocationButton';

const MapView = ({
  showGreenMarker,
  showYellowMarker,
  selectedPlace,
  onPublicDesignClick,
  onPublicDesignSuggestionClick,
  onSearchNearCurrentLocationClick,
  submittedDesign
}) => {
  const [clickedPosition, setClickedPosition] = useState(null);

  const handlePinClick = (position) => {
    setClickedPosition(position);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LocationButton
        onPublicDesignClick={onPublicDesignClick}
        onPublicDesignSuggestionClick={onPublicDesignSuggestionClick}
        onSearchNearCurrentLocationClick={onSearchNearCurrentLocationClick}
        selectedPlace={selectedPlace}
      />
      <KakaoMap
        onMapClick={handlePinClick}
        showGreenMarker={showGreenMarker}
        showYellowMarker={showYellowMarker}
        selectedPlace={selectedPlace}
        submittedDesign={submittedDesign}
      />
    </div>
  );
};

export default MapView;
