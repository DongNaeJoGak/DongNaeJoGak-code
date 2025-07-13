// src/components/Suggestion/SuggestionPanel.jsx
import React from 'react';
import SearchInput from './SearchInput';
import illustration from '../../../public/illustration.png';

const SuggestionPanel = ({ onPlaceSelect }) => {
  return (    
    <div className="flex flex-col p-4 sm:p-6 h-full w-full">
      {/* 제목 */}
      <h2 className="heading1_b leading-tight mt-22 ml-1 tracking-tight break-keep text-left">
        공공디자인<br />
        아이디어 제안하기
      </h2>

      {/* 서브타이틀 */}
      <p className="subtitle1_r text-gray-600 mt-10 leading-snug ml-1 tracking-tight break-keep text-left">
        아이디어 제안을 통해<br />
        더욱 안전한 도시를 만들어보아요!
      </p>

      {/* 아이디어 등록 폼 */}
      <div className="mb-4">
        <h3 className="title1_b mt-16 ml-1 tracking-tight">아이디어 등록</h3>
        <SearchInput onPlaceSelect={onPlaceSelect} />
      </div>

      {/* 하단 일러스트 */}
      <div className="mt-auto mx-auto">
        <img
          src={illustration}
          alt="일러스트"
          className="w-full max-w-[383px] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default SuggestionPanel;
