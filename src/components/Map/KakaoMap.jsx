// src/components/Map/KakaoMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import SmallGreenMarker from '../../assets/SmallGreenMarker.svg';
import SmallYellowMarker from '../../assets/SmallYellowMarker.svg';
import WaitingGreenMarker from '../../assets/WaitingGreenMarker.svg';
import BigGreenMarkerPng from '../../assets/BigGreenMarker.png';
import { getDistanceKm } from '../../utils/distance';

export default function KakaoMap({ onMapClick, selectedPlace, currentLocation, onIdeasChange, showGreenMarker, showYellowMarker, hasInputStarted, onCenterChange, previewData }) {
  const [mapCenter, setMapCenter] = useState({ lat: 35.1795543, lng: 129.0756416 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [ideas, setIdeas] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const KakaoKey = import.meta.env.VITE_KAKAO_API_KEY;
  const [fixedIdeas, setFixedIdeas] = useState([]);

  // 마운트 시 localStorage에서 fixedIdeas 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('fixedIdeas');
    if (saved) {
      try {
        setFixedIdeas(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // 서버 ideas와 fixedIdeas 합치기 (중복 ideaId는 서버 데이터 우선)
  const allIdeas = [
    ...ideas.map(idea => {
      const lat = idea.lat ?? idea.latitude;
      const lng = idea.lng ?? idea.longitude;
      
      // 서울 경계 설정 (대략적인 범위) SmallYellowMarker 테스트용 코드
      const seoulBounds = {
        north: 37.715, // 서울 북쪽 경계
        south: 37.413, // 서울 남쪽 경계
        east: 127.269,  // 서울 동쪽 경계
        west: 126.764   // 서울 서쪽 경계
      };
      
      // 서울 바깥에 있는지 확인 SmallYellowMarker 테스트용 코드
      const isOutsideSeoul = lat < seoulBounds.south || lat > seoulBounds.north || 
                            lng < seoulBounds.west || lng > seoulBounds.east;
      
      let statusKey = idea.statusKey || 'VOTING';
      if (isOutsideSeoul) {
        statusKey = 'COMPLETED';
      }
      
      return {
        ...idea,
        statusKey: statusKey,
        lat: lat,
        lng: lng,
      };
    }),
    ...fixedIdeas.filter(fixed => !ideas.some(idea => idea.ideaId === fixed.ideaId))
  ];

  // 마커 렌더링 직전 status 값 콘솔 출력
  console.log('allIdeas statusKey:', allIdeas.map(idea => idea.statusKey));
  console.log('allIdeas:', allIdeas); 

  // 1) 맵 생성 시 ref에 저장
  const handleCreate = (map) => {
    mapRef.current = map;
    setIsLoading(false);
  };

  // 2) 처음 한 번만 현위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setMapCenter(pos);
        // setMarkerPosition(pos); // 마커를 현위치에 표시하지 않음
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

  // 3) selectedPlace나 currentLocation 바뀌면 중심 이동
  useEffect(() => {
    const target = selectedPlace || currentLocation;
    if (target) {
      const pos = { lat: target.lat, lng: target.lng };
      setMapCenter(pos);
      // 지도 객체가 생성되어 있으면 직접 setCenter 호출
      if (mapRef.current && window.kakao && window.kakao.maps) {
        mapRef.current.setCenter(new window.kakao.maps.LatLng(pos.lat, pos.lng));
      }
    }
  }, [selectedPlace, currentLocation]);

  // selectedPlace가 바뀔 때 markerPosition도 자동으로 갱신
  useEffect(() => {
    console.log('📍 selectedPlace 변경:', selectedPlace);
    if (selectedPlace && selectedPlace.lat && selectedPlace.lng) {
      setMarkerPosition({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      console.log('📍 마커 위치 설정:', { lat: selectedPlace.lat, lng: selectedPlace.lng });
    } else {
      // selectedPlace가 null이면 마커도 제거
      setMarkerPosition(null);
      console.log('📍 마커 제거됨');
    }
  }, [selectedPlace]);

  // 4) 지도 클릭
  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const pos = { lat: latlng.getLat(), lng: latlng.getLng() };
    setMarkerPosition(pos);
    onMapClick?.({
      y: pos.lat.toString(),
      x: pos.lng.toString(),
      place_name: "선택한 위치",
      road_address_name: "",
      address_name: ""
    });
  };

  // 5) bounds 변경(idle) 시 API 호출
  useEffect(() => {
    if (!mapRef.current) return;
    const onIdle = () => {
      const map = mapRef.current;
      if (!map || !window.kakao || !window.kakao.maps) return;
    
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const center = map.getCenter();
    
      const latDiff = Math.abs(ne.getLat() - sw.getLat());
      const lngDiff = Math.abs(ne.getLng() - sw.getLng());
    
      // ✅ 최소 지도 범위를 설정 (약 0.2도 ≒ 20km)
      const MIN_LAT_DIFF = 0.15;
      const MIN_LNG_DIFF = 0.15;
    
      const halfLat = Math.max(latDiff / 2, MIN_LAT_DIFF / 2);
      const halfLng = Math.max(lngDiff / 2, MIN_LNG_DIFF / 2);
    
      // ✅ 보정된 bounds 계산
      const newSwLat = center.getLat() - halfLat;
      const newSwLng = center.getLng() - halfLng;
      const newNeLat = center.getLat() + halfLat;
      const newNeLng = center.getLng() + halfLng;
    
      const params = new URLSearchParams({
        leftLat: newNeLat,
        leftLong: newSwLng,
        rightLat: newSwLat,
        rightLong: newNeLng,
      }).toString();
    
      fetch(`https://dongnaejogak.kro.kr/api/ideas?${params}`)
        .then(res => res.json())
        .then(json => {
          if (json.isSuccess) {
            const list = Array.isArray(json.result.ideas) ? json.result.ideas : [];
            console.log('🔍 API 응답 원본 데이터:', list);
            console.log('🔍 첫 번째 아이디어 객체:', list[0]);

            // statusKey 변환: 서울 외곽은 COMPLETED
            const processedList = list.map(idea => {
              const lat = idea.lat ?? idea.latitude;
              const lng = idea.lng ?? idea.longitude;
              const seoulBounds = {
                north: 37.715,
                south: 37.413,
                east: 127.269,
                west: 126.764
              };
              const isOutsideSeoul = lat < seoulBounds.south || lat > seoulBounds.north ||
                                     lng < seoulBounds.west || lng > seoulBounds.east;
              let statusKey = idea.statusKey || 'VOTING';
              if (isOutsideSeoul) statusKey = 'COMPLETED';
              return { ...idea, statusKey, lat, lng };
            });

            // 반경 15km 필터링
            const filtered = processedList.filter(idea => {
              const dist = getDistanceKm(mapCenter.lat, mapCenter.lng, idea.lat, idea.lng);
              return dist <= 15;
            });

            setIdeas(processedList);             // 전체 마커 렌더링용
            onIdeasChange?.(filtered);           // 오른쪽 패널에 전달용
          } else {
            console.error("GET in-map 실패:", json?.message || "서버 오류");
          }
        })
        .catch(err => console.error("네트워크 오류:", err));
    };
  

    // idle 이벤트 등록
    window.kakao.maps.event.addListener(mapRef.current, "idle", onIdle);
    return () => {
      window.kakao.maps.event.removeListener(mapRef.current, "idle", onIdle);
    };
  }, [mapCenter]);

  useEffect(() => {
    if (onCenterChange) {
      onCenterChange(mapCenter);
    }
  }, [mapCenter]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        kakaoApiKey={KakaoKey}
        center={mapCenter}
        style={{ width: "100%", height: "100%" }}
        level={3}
        onCreate={handleCreate}
        onClick={handleMapClick}
        draggable={true}
      >
        {/* 선택된 위치 마커 */}
        {!isLoading && markerPosition && (
          <MapMarker
            position={markerPosition}
            image={{
              src: hasInputStarted ? BigGreenMarkerPng : WaitingGreenMarker,
              size: hasInputStarted ? { width: 234, height: 72 } : { width: 72, height: 86 },
              options: { offset: hasInputStarted ? { x: 52, y: 103 } : { x: 35, y: 69 } }
            }}
          />
        )}

        {/* 입력 중 오버레이 (이미지/제목/주소) */}
        {!isLoading && markerPosition && hasInputStarted && (
          <CustomOverlayMap position={markerPosition}>
          <div className="left-[-45px] top-[-95px] w-[220px] h-[46px] absolute bg-white rounded-xl">
            <img
              src={previewData?.image || '/thumbnail.svg'}
              alt="미리보기"
              className="absolute left-[12px] top-[3px] w-[40px] h-[40px] rounded object-cover"
            />
            <div className="absolute left-[62px] top-[5px] w-[160px]">
              <div className="mini_tag1_sb truncate text-gray-800">{previewData?.title || '제목 입력 중...'}</div>
              <div className="mini_tag2_r text-gray-600 truncate absolute left-[0px] top-[20px]"> 
                {previewData?.address || '주소 정보 없음'}
              </div>
            </div>
          </div>
        </CustomOverlayMap>
        )}

        {/* API로 불러온 아이디어들 마커 */}
        {allIdeas.map(idea => {
          const statusKey = idea.statusKey ? idea.statusKey.toUpperCase().trim() : "";
          if (statusKey === "VOTING" && showGreenMarker) {
            // SmallGreenMarker with image overlay
            return (
              <React.Fragment key={idea.ideaId}>
                <MapMarker
                  position={{ lat: idea.lat, lng: idea.lng }}
                  image={{
                    src: SmallGreenMarker,
                    size: { width: 80, height: 80 },
                    options: { offset: { x: 35, y: 69 } }
                  }}
                />
                <CustomOverlayMap position={{ lat: idea.lat, lng: idea.lng }}>
                  <div className="left-[-27px] top-[-55px] w-[40px] h-[40px] absolute  rounded-xl">
                    <img
                      src={
                        idea.imageUrl
                          ? idea.imageUrl.startsWith('http')
                            ? idea.imageUrl
                            : `https://dongnaejogak.kro.kr/${idea.imageUrl}`
                          : '/thumbnail.svg'
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/thumbnail.svg';
                      }}
                      alt={idea.title}
                      className="absolute left-[12px] top-[3px] w-[40px] h-[40px] rounded object-cover"
                    />
                  </div>
                </CustomOverlayMap>
              </React.Fragment>
            );
          } else if (statusKey === "COMPLETED" && showYellowMarker) {
            // SmallYellowMarker with image overlay
            return (
              <React.Fragment key={idea.ideaId}>
                <MapMarker
                  position={{ lat: idea.lat, lng: idea.lng }}
                  image={{
                    src: SmallYellowMarker,
                    size: { width: 80, height: 80 },
                    options: { offset: { x: 35, y: 69 } }
                  }}
                />
                <CustomOverlayMap position={{ lat: idea.lat, lng: idea.lng }}>
                  <div className="left-[-27px] top-[-55px] w-[40px] h-[40px] absolute rounded-xl">
                    <img
                      src={
                        idea.imageUrl
                          ? idea.imageUrl.startsWith('http')
                            ? idea.imageUrl
                            : `https://dongnaejogak.kro.kr/${idea.imageUrl}`
                          : '/thumbnail.svg'
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/thumbnail.svg';
                      }}
                      alt={idea.title}
                      className="absolute left-[12px] top-[3px] w-[40px] h-[40px] rounded object-cover"
                    />
                  </div>
                </CustomOverlayMap>
              </React.Fragment>
            );
          } else if (statusKey !== "VOTING" && statusKey !== "COMPLETED") {
            // 기본 마커
            return (
              <MapMarker
                key={idea.ideaId}
                position={{ lat: idea.lat, lng: idea.lng }}
              />
            );
          } else {
            return null;
          }
        })}
      </Map>
    </div>
  );
}
