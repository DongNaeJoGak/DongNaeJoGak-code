// src/components/NearbyIdeas/IdeaNearbyPanel.jsx
import React, { useState } from 'react';
import IdeaCard from './IdeaCard';
import { getDistanceKm } from '../../utils/distance';


const statuses = ['투표 중', '검토 중', '완료'];
const regions  = [
  '서울','부산','대구','대전','광주','인천',
  '경북','경남','제주','울산','경기',
  '충북','충남','전북','전남'
];

export default function IdeaNearbyPanel({
  ideas = [],         // API에서 받아오는 배열
  center,    // 2) 기준 좌표
  radiusKm = 1,                 // 3) 반경 (km)
  onIdeaClick,        // 클릭 시 아이디어ID를 인자로 받습니다.
}) {
  const [showFilter, setShowFilter]         = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRegions, setSelectedRegions]   = useState([]);

  const toggleStatus = status => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleRegion = region => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

    // 상태/지역 필터 적용
  const passStatusRegion = (idea => {
    const statusTextMap = {
      VOTING: '투표 중',
      REVIEWING: '검토 중',
      COMPLETED: '완료',
      null: '투표 중',
      undefined: '투표 중'
    };

    // statusKey를 사용하도록 수정
    const ideaStatusText = statusTextMap[idea.statusKey] || '투표 중';

    return (
      (selectedStatuses.length === 0 || selectedStatuses.includes(ideaStatusText)) &&
      (selectedRegions.length === 0 || selectedRegions.includes(idea.region))
    );
  });
  
  // 거리 필터 함수
  const passDistance = idea => {
    const dist = getDistanceKm(
      center.lat, center.lng,
      idea.latitude, idea.longitude
    );
    return dist <= radiusKm;
  }; 
  
  // 최종 필터링 및 거리 순 정렬
  const filteredIdeas = ideas
    .filter(passStatusRegion)
    .filter(idea => {
      // center가 정의되지 않았다면(=상세 선택 전) 거리 조건 없이 모두 통과
      if (!center) return true;
      return passDistance(idea);
    })
    .map(idea => {
      // 각 아이디어에 거리 정보 추가
      const distance = center ? getDistanceKm(
        center.lat, center.lng,
        idea.latitude, idea.longitude
      ) : 0;
      return { ...idea, distance };
    })
    .sort((a, b) => a.distance - b.distance); // 거리 가까운 순으로 정렬

  return (
    <div className="w-full h-full flex flex-col">
      {/* 헤더 + 필터 토글 */}
      <div className="p-6">
        <h2 className="heading2_b text-gray-800 ml-1 mt-10 tracking-tight">
          이 주변에<br/>제안된 아이디어
        </h2>
        <div className="mt-4 flex items-center justify-between relative pb-6">
          <p className="subtitle1_r ml-1 mt-8 mb-6 tracking-tighter">
            다른 시민들의 제안을 확인하고 투표해보세요!
          </p>
          <button
            onClick={() => setShowFilter(f => !f)}
            className="absolute right-0 bottom-0 p-2 rounded-full hover:bg-gray-100"
          >
            <img src="/icons/filter.svg" alt="필터" className="w-[35px] h-[35px]" />
          </button>
        </div>

        {/* 필터 패널 */}
        {showFilter && (
          <div className="mt-6 ml-1 space-y-6">
            {/* 상태 필터 */}
            <div>
              <div className="mini tag1_m mb-2">상태</div>
              <div className="flex flex-wrap">
                {statuses.map(status => {
                  const active = selectedStatuses.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className="w-[80px] h-[35px] ml-[-12px] mb-2 bg-no-repeat bg-center bg-contain"
                      style={{
                        backgroundImage: `url('/icons/${active ? 'off' : 'on'}.svg')`,
                        backgroundSize: '90% 90%' 
                      }}
                    >
                      
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 지역 필터 */}
            <div>
              <div className="mini tag1_m mb-2">지역</div>
              <div className="flex flex-wrap">
                {regions.map(region => {
                  const active = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className="w-[80px] h-[35px] ml-[-13px] mb-2 bg-no-repeat bg-center bg-contain"
                      style={{
                        backgroundImage: `url('/icons/${active ? 'off' : 'on'}.svg')`,
                        backgroundSize: '90% 90%' 
                      }}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 카드 리스트 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredIdeas.length === 0 ? (
          <p className="text-center text-gray-500">
            조건에 맞는 아이디어가 없습니다.
          </p>
        ) : (
          filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.ideaId}
              idea={{
                id:       idea.ideaId,
                title:    idea.title,
                status:   idea.statusKey, // statusKey로 변경!
                likes:    idea.likeNum,
                dislikes: idea.dislikeNum,
                imageUrl:    idea.imageUrl,
                region:   idea.region || '',    // 백엔드에 region 필드가 있다면 그걸 쓰세요
                distance: idea.distance         // 거리 정보 추가
              }}
              onClick={() => onIdeaClick(idea.ideaId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
