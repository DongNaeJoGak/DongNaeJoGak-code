//Home.jsx
// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import KakaoMap from '../components/Map/KakaoMap';
import MapView from '../components/Map/Mapview';
import SuggestionPanel from '../components/Suggestion/SuggestionPanel';
import SuggestionForm from '../components/Suggestion/SuggestionForm';
import IdeaNearbyPanel from '../components/NearbyIdeas/IdeaNearbyPanel';
import IdeaDetailPanel from '../components/NearbyIdeas/IdeaDetailPanel';
import PanelToggleButton from '../components/Suggestion/PanelToggleButton';
import LocationButton from '../components/Map/LocationButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDistanceKm } from '../utils/distance';

const Home = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 35.1795543, lng: 129.0756416 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showGreenMarker, setShowGreenMarker] = useState(false);
  const [showYellowMarker, setShowYellowMarker] = useState(false);
  const [submittedDesign, setSubmittedDesign] = useState(null);
  const [submittedIdeas, setSubmittedIdeas] = useState([]);
  const [hasInputStarted, setHasInputStarted] = useState(false);
  const [nearbyIdeas, setNearbyIdeas] = useState([]);
  const [ideaNearbyList, setIdeaNearbyList] = useState([]);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState({ lat: 35.1795543, lng: 129.0756416 });
  const [previewData, setPreviewData] = useState({ image: null, title: '', address: '' });

  // 현재 위치 가져오기
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setCurrentLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => {}
    );
  }, []);

  // 로그인 상태 확인 (userName 가져오기)
  useEffect(() => {
    const checkUserLogin = () => {
      const name = localStorage.getItem('userName');
      if (name) {
        setMe({ name });
      } else {
        setMe(null);
      }
    };

    // 초기 로그인 상태 확인
    checkUserLogin();

    // localStorage 변경 감지
    const handleStorageChange = (e) => {
      if (e.key === 'userName') {
        checkUserLogin();
      }
    };

    // storage 이벤트 리스너 추가
    window.addEventListener('storage', handleStorageChange);
    
    // 같은 탭에서의 localStorage 변경도 감지하기 위한 커스텀 이벤트
    window.addEventListener('userLoginChange', checkUserLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoginChange', checkUserLogin);
    };
  }, []);

  // 아이디어 목록 불러오기
  useEffect(() => {

    const fetchIdeas = async () => {
      try {
        // 예시: currentLocation을 중심으로 임시 범위 지정 (실제 구현에서는 지도 bounds 사용 권장)
        const delta = 0.01;
        const leftLat = currentLocation.lat + delta;
        const leftLong = currentLocation.lng - delta;
        const rightLat = currentLocation.lat - delta;
        const rightLong = currentLocation.lng + delta;

        const res = await axios.get(
          'https://dongnaejogak.kro.kr/api/ideas',
          {
            params: {
              leftLat,
              leftLong,
              rightLat,
              rightLong,
            }
          }
        );
        if (res.data && res.data.result && res.data.result.ideas) {
          setSubmittedIdeas(res.data.result.ideas);
        }
      } catch (err) {
        console.error('아이디어 목록 불러오기 실패:', err);
      }
    };
    fetchIdeas();
  }, [currentLocation]);

  const handleMapClick = ({ y, x, place_name, road_address_name, address_name }) => {
    const lat = parseFloat(y);
    const lng = parseFloat(x);
    setSelectedPlace({
      lat,
      lng,
      y: y || lat,
      x: x || lng,
      place_name: place_name || "선택한 위치",
      road_address_name,
      address_name,
    });
    setIsFormOpen(true);
  };

  const handlePlaceSelect = (place) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    const newPlace = {
      ...place,
      lat,
      lng,
      y: place.y || lat,
      x: place.x || lng,
    };
    setCurrentLocation({ lat, lng });
    setSelectedPlace(newPlace);
    setIsFormOpen(true);
  };

  const handleDesignSubmit = (data) => {
    const place = {
      ...selectedPlace,
      lat: selectedPlace.lat || Number(selectedPlace.y),
      lng: selectedPlace.lng || Number(selectedPlace.x),
    };
    const newIdea = { ...data, place };
    setSubmittedIdeas(prev => [...prev, newIdea]);
    setSelectedPlace(null);
    setIsFormOpen(false);
  };

  const handleActionWithAlert = (action) => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setSelectedPlace(null);
      action();
    } else {
      action();
    }
  };

  const handlePublicDesignClick = () => {
    setShowYellowMarker(prev => !prev);
  };
  const handlePublicDesignSuggestionClick = () => {
    setShowGreenMarker(prev => !prev);
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
          setMapCenter(newLocation); // 추가
          setSelectedPlace(null);
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

  const handleChangePlace = () => {
    if (window.confirm('장소를 바꾸시겠습니까?')) {
      setIsFormOpen(false);
      setHasInputStarted(false);
      setSelectedPlace(null);
      setPreviewData({ image: null, title: '', address: '' });
    }
  };

  const handleInputChange = (hasInput) => {
    setHasInputStarted(hasInput);
  };

  const handleLogout = () => {
    localStorage.clear();
    setMe(null);
    
    // 로그아웃 이벤트 발생
    window.dispatchEvent(new CustomEvent('userLoginChange'));
    
    navigate('/');
  };

  const logoutStyle = {
    width: '60px',
    height: '30px',
  };

    const logoutButtonStyle = {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  };

  const logoutButtonHoverStyle = {
    background: '#EDEDED',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  };


  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 왼쪽 패널 */}
      <div className={`absolute top-0 left-0 bg-white shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-all duration-300 overflow-hidden w-[486px] ${isPanelCollapsed ? 'h-[80px] rounded-4xl' : 'h-full rounded-none'}`}>
        <img
          src="/DNZG.png"
          alt="DNZG Logo"
          className="absolute top-4 left-4 w-[72px] h-[45px] z-20"
        />

        {/* 로그인/사용자 표시 */}
        {me ? (
  <div className="relative group">
    <p className="mini_tag1_sb absolute top-7 left-85 leading-snug tracking-tight break-keep text-left z-30 bg-white cursor-pointer">
      {me.name}님
    </p>
    <button
    type="button"
    onClick={handleLogout}
    className="absolute top-5 right-18 z-25 p-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-[80px] h-[40px]"
  >
    <img
      src="/logout.svg"
      alt="로그아웃"
      className="w-full h-full object-contain absolute top-10 right-0.5 group-hover:hidden"
    />
    <img
      src="/logoutHoverEffect.svg"
      alt="로그아웃 hover"
      className="w-full h-full object-contain absolute top-10 right-0.5 hidden group-hover:block"
    />
  </button>
  </div>
) : (
  <button
    type="button"
    onClick={() => navigate('/login')}
    className="absolute top-5 right-18 z-20 p-2 bg-white group w-[80px] h-[40px]"
  >
    <img
      src="/login.svg"
      alt="로그인"
      className="w-full h-full object-contain absolute top-0 left-0 group-hover:hidden"
    />
    <img
      src="/loginHoverEffect.svg"
      alt="로그인 hover"
      className="w-full h-full object-contain absolute top-0 left-0 hidden group-hover:block"
    />
  </button>
)}


        <PanelToggleButton
          isOpen={!isPanelCollapsed}
          onClick={() => setIsPanelCollapsed(prev => !prev)}
        />
        {!isPanelCollapsed && (
          isFormOpen
            ? <SuggestionForm selectedPlace={selectedPlace} onClose={() => { setIsFormOpen(false); setHasInputStarted(false); setSelectedPlace(null); setPreviewData({ image: null, title: '', address: '' }); }} onChangePlace={handleChangePlace} onInputChange={handleInputChange} onPreviewChange={setPreviewData} />
            : <SuggestionPanel onPlaceSelect={handlePlaceSelect} />
        )}
      </div>

      {/* 카카오맵 */}
      <div className="absolute inset-0 z-0">
        <KakaoMap
          onMapClick={handleMapClick}
          selectedPlace={selectedPlace}
          currentLocation={currentLocation}
          onIdeasChange={setSubmittedIdeas}
          showGreenMarker={showGreenMarker}
          showYellowMarker={showYellowMarker}
          hasInputStarted={hasInputStarted}
          onCenterChange={setMapCenter}
          previewData={previewData}
        />
        <LocationButton
          onSearchNearCurrentLocationClick={handleSearchNearCurrentLocation}
          onPublicDesignClick={handlePublicDesignClick}
          onPublicDesignSuggestionClick={handlePublicDesignSuggestionClick}
          selectedPlace={selectedPlace}
          isRightCollapsed={isRightCollapsed}
          isFormOpen={isFormOpen}
        />
      </div>

      {/* 오른쪽 패널 */}
      {!isRightCollapsed && (
        <div className="absolute top-0 right-0 h-full w-[434px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-transform duration-300 overflow-auto">
          <button
            onClick={() => setIsRightCollapsed(true)}
            className="absolute top-7 right-4 z-20 p-2 transition-transform active:scale-95"
          >
            <img src="/icons/toggle-open.svg" alt="접기" className="w-[45px] h-[45px]" />
          </button>
          <IdeaNearbyPanel
            ideas={submittedIdeas}
            center={mapCenter}
            radiusKm={15}
            onIdeaClick={ideaId => {
              const idea = submittedIdeas.find(i => i.ideaId === ideaId);
              console.log('🔍 찾은 idea 객체:', idea);
              console.log('🔍 submittedIdeas 배열:', submittedIdeas);
              setSelectedIdea(idea);
            }}
          />
        </div>
      )}
      {isRightCollapsed && (
        <button
          onClick={() => setIsRightCollapsed(false)}
          className="absolute top-4 right-1 z-20 p-2 transition-transform active:scale-95"
        >
          <img src="/icons/toggle.svg" alt="열기" className="w-[70px] h-[70px]" />
        </button>
      )}

      {/* 아이디어 상세 패널 */}
      {selectedIdea && (
        <IdeaDetailPanel idea={selectedIdea} onClose={() => setSelectedIdea(null)} isOpen className="absolute inset-0 z-30" />
      )}
    </div>
  );
};

export default Home;
