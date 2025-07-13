// src/components/Suggestion/PanelToggleButton.jsx
import React from 'react';
// svg 파일을 URL로 불러옵니다.


const PanelToggleButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-50 w-12 h-12 p-0 flex items-center justify-center bg-transparent
      hover:bg-transparent
      active:bg-transparent
      focus:bg-transparent
      outline-none
      shadow-none
      border-none"
    >
      <img
        src={isOpen ? '/icons/toggle-open.png' : '/icons/toggle-close.png'}
        alt={isOpen ? '닫기' : '열기'}
        // 1) 패딩을 1로 줄이고
        // 2) 이미지에 block + width/height 지정으로
        //    버튼 내부를 꽉 채우게 합니다
        className="block w-[34px] h-[24px] object-contatin"
      />
    </button>
  );
};

export default PanelToggleButton;
