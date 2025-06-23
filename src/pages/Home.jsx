import React, { useState } from 'react';
//import illustration from '../../../public/illustration.png';
import SearchInput from '../components/Suggestion/SearchInput';
import KakaoMap from '../components/Map/KakaoMap';
import LocationButton from '../components/Map/LocationButton';

const Home = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    setSelectedPlace({
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      name: place.place_name,
      address: place.road_address_name || place.address_name
    });
    setCurrentLocation(null); // 장소 검색 시 현위치 초기화
  };

  const handleSearchNearCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setSelectedPlace(null); // 현위치 검색 시 선택된 장소 초기화
        },
        (err) => {
          console.error("Error getting current location:", err.message);
          alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        }
      );
    } else {
      alert("현재 위치 기능을 사용할 수 없습니다.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
  {/* 왼쪽 사이드바 */}
  <div className="w-1/4 min-w-[320px] max-w-[400px] bg-white shadow-lg flex-shrink-0">
    <div className="h-full p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">공공디자인 아이디어 제안하기</h2>
      <p className="text-gray-600 mb-8">
        아이디어 제안을 통해 더욱 안전한 도시를 만들어보아요!
      </p>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">아이디어 등록</label>
        <SearchInput onPlaceSelect={handlePlaceSelect} />
      </div>
    </div>
  </div>

  {/* 지도 영역 */}
  <div className="flex-1 min-w-0 h-screen relative">
    <KakaoMap 
      onMapClick={handlePlaceSelect} 
      selectedPlace={selectedPlace}
      currentLocation={currentLocation} // 현재 위치 정보를 KakaoMap으로 전달
    />
    <LocationButton onSearchNearCurrentLocationClick={handleSearchNearCurrentLocation} />
  </div>
</div>
  );
};

export default Home;