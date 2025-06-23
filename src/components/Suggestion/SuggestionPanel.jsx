// SuggestionPanel.jsx
import React from 'react';
import illustration from '../../../public/illustration.png';
import SearchInput from './SearchInput';

const SuggestionPanel = ({ onPlaceSelect }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">공공디자인 아이디어 제안하기</h2>
      <p className="text-gray-600 mb-6">
        아이디어 제안을 통해 더욱 안전한 도시를 만들어보아요!
      </p>

      <div className="mb-10">
        <label className="block font-semibold mb-1">아이디어 등록</label>
        <SearchInput onPlaceSelect={onPlaceSelect} />
      </div>

      <div className="mt-80">
        <img
          src={illustration}
          alt="일러스트"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default SuggestionPanel;