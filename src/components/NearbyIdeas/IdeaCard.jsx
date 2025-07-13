// src/components/NearbyIdeas/IdeaCard.jsx
import React from 'react';
import classNames from 'classnames';

const statusIconMap = {
  'VOTING': '/icons/in-vote.svg',
  'REVIEWING': '/icons/under-review.svg',
  'COMPLETED'  : '/icons/completed.svg',
};

const statusLabelMap = {
  VOTING: '투표 중',
  REVIEWING: '검토 중',
  COMPLETED: '완료',
};

export default function IdeaCard({ idea, onClick }) {
  console.log('status 확인:', idea.status); // ✅ 이거   console.log('🟡 idea.status:', idea.status); // 콘솔 확인

  // statusKey: idea.status 가 없으면 'VOTING' 으로
  const statusKey = statusIconMap[idea.status] ? idea.status : 'VOTING';

  const iconSrc = statusIconMap[statusKey];
  const iconAlt = statusLabelMap[statusKey];

  console.log('🟡 statusKey:', statusKey)

  return (
    <div
      onClick={onClick}
      className="relative w-full h-[247px] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* 배경 이미지 */}
      <img
        src={
          idea.imageUrl
            ? idea.imageUrl.startsWith('http')
              ? idea.imageUrl
              : `https://dongnaejogak.kro.kr/${idea.imageUrl}`
            : '/example.png'
        }
        onError={(e) => {
          e.target.onerror = null; // 무한루프 방지
          e.target.src = '/example.png';
        }}
        alt={idea.title}
        className="w-full h-full object-cover"
      />


      {/* 상태 아이콘 */}

       <img
        src={iconSrc}
        alt={iconAlt}
        className="absolute top-2 right-0 z-10 w-[130px] h-[39px] object-contain"
      />



      {/* 제목 */}
      <div className="absolute bottom-5 left-4.5 z-10 text-white title1_sb drop-shadow">
        {idea.title}
      </div>

      {/* 좋아요/싫어요 아이콘과 카운트 */}
      <div className="absolute bottom-5 right-6 z-10 flex items-center space-x-4 text-white drop-shadow text-sm">
        <div className="flex items-center gap-1">
          <img src="/good.svg" alt="좋아요" className="w-6 h-6" />
          <span>{idea.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/bad.svg" alt="싫어요" className="w-6 h-6" />
          <span>{idea.dislikes}</span>
        </div>
      </div>
    </div>
  );
}
