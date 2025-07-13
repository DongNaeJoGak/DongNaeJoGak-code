// src/components/Suggestion/SuggestionContainer.jsx
import React, { useState } from 'react';
import SuggestionPanel from './SuggestionPanel';
import SuggestionForm from './SuggestionForm';
import PanelToggleButton from './PanelToggleButton';

export default function SuggestionContainer({ onPlaceSelect, selectedPlace }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(open => !open);

  return (
    <div className="relative h-full w-full">
      {/* 패널 토글 버튼 */}
      <PanelToggleButton isOpen={isOpen} onClick={toggle} />

      {/* 로그인 버튼 (토글 버튼 왼쪽, 항상 고정) */}
      <button
        type="button"
        onClick={() => {/* 추후 로그인 페이지로 이동 */}}
        className="absolute top-4 right-12 z-50 p-2 bg-white rounded shadow-md"
      >
        <img
          src="/login.svg"
          alt="로그인"
          className="w-6 h-6 object-contain"
        />
      </button>

      {/* 토글 상태에 따라 패널 또는 폼 */}
      {isOpen
        ? <SuggestionForm selectedPlace={selectedPlace} />
        : <SuggestionPanel onPlaceSelect={onPlaceSelect} />
      }
    </div>
  );
}
