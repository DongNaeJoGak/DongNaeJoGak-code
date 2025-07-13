import React, { useState, useEffect } from 'react';
import PanelToggleButton from './PanelToggleButton';



const SuggestionForm = ({ selectedPlace, onClose, onInputChange, onPreviewChange }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // 미리보기용
  const [selectedImageFile, setSelectedImageFile] = useState(null); // 전송용
  const [error, setError] = useState(''); // 에러 메시지를 위한 상태

  const location = selectedPlace?.place_name || '';

  useEffect(() => {
    if (onPreviewChange && selectedPlace) {
      onPreviewChange({
        image: imagePreview || '/thumbnail.svg', // 기본 썸네일 설정
        title,
        address: selectedPlace?.road_address_name || selectedPlace?.address_name || ''
      });
    }
  }, [imagePreview, title, selectedPlace, onPreviewChange]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // 실제 전송용
      setImagePreview(URL.createObjectURL(file)); // 미리보기용
      // 입력 상태 변경 알림
      if (onInputChange) {
        onInputChange(title.trim().length > 0 || description.trim().length > 0);
      }
      // 즉시 미리보기 업데이트 (업로드된 이미지 사용)
      if (onPreviewChange) {
        onPreviewChange({
          image: URL.createObjectURL(file), // 업로드된 이미지로 교체
          title,
          address: selectedPlace?.road_address_name || selectedPlace?.address_name || ''
        });
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim() || !description.trim()) {
      setError('제목과 설명을 모두 입력해 주세요.');
      return;
    }
  
    // 비로그인 사용자도 아이디어 제출 가능하도록 로그인 체크 제거
    const accessToken = localStorage.getItem('accessToken');
  
    const latitude = selectedPlace?.lat || parseFloat(selectedPlace?.y) || 0;
    const longitude = selectedPlace?.lng || parseFloat(selectedPlace?.x) || 0;
  
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      setError('유효한 위치 정보가 없습니다. 지도에서 위치를 다시 선택해주세요.');
      return;
    }
  
    const payload = {
      title,
      content: description,
      latitude,
      longitude,
      roadAddressName: selectedPlace?.road_address_name || '',
      addressName: selectedPlace?.address_name || '',
    };
  
    const formData = new FormData();
    // 이미지가 있을 때만 추가
    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  
        try {
      console.log('📤 전송할 데이터:', {
        hasImage: !!selectedImageFile,
        title,
        content: description,
        latitude,
        longitude
      });

      const headers = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch('https://dongnaejogak.kro.kr/api/ideas', {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('📩 서버 응답 상태:', res.status, res.statusText);

      const result = await res.json();
      console.log('📩 서버 응답 데이터:', result);

      if (res.ok && result.isSuccess) {
        alert(`✅ 아이디어가 등록되었습니다! ID: ${result.result.ideaId}`);
        
        // localStorage에 저장
        const fixedIdeas = JSON.parse(localStorage.getItem('fixedIdeas') || '[]');
        fixedIdeas.push({
          ideaId: result.result.ideaId,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
          status: 'VOTING'
        });
        localStorage.setItem('fixedIdeas', JSON.stringify(fixedIdeas));
        
        // 폼 닫기 (마커 상태도 함께 초기화됨)
        if (onClose) onClose();
      } else {
        console.error('❌ 서버 에러 응답:', result);
        alert(`❌ 등록에 실패했습니다: ${result.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('🚨 네트워크/서버 오류:', err);
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
  


  return (
    <div className="w-[486px] h-screen p-6 bg-white shadow-md flex flex-col">
      {/* 상단 타이틀 */}
      <h2 className="heading1_b leading-tight mt-22 ml-1 tracking-tight">
        공공디자인<br />아이디어 제안하기
      </h2>
      <p className="subtitle1_r text-gray-600 mt-10 leading-snug ml-1 tracking-tight">
        아이디어 제안을 통해<br />
        더욱 안전한 도시를 만들어보아요!
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 mt-16"
      >
        {/* 장소 입력 */}
        <div className="mb-6">
          <h3 className="title1_b ml-1 tracking-tight mb-6">아이디어 등록</h3>
          <div className="flex items-center justify-between border-b-[1.7px] border-[#002B45] py-1">
            <div className="flex items-center">
              <img
                src="/vector.svg"
                alt=""
                className="w-5 h-5 mr-2 object-contain"
              />
              <span className="body1_r text-[#5B6670] tracking-tight">
                {location}
              </span>
            </div>
            <span className="body2_r text-gray-500 ml-4">
              {selectedPlace?.road_address_name || selectedPlace?.address_name}
            </span>
          </div>
        </div>

         {/* 이미지 업로드 */}
        <div className="border-b border-gray-300 bg-[#F5F5F5] h-48 mb-4 flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="업로드된 스케치"
              className="h-full object-contain w-full"
            />
          ) : (
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
            >
              <img
                src="/image.svg"
                alt="스케치 아이콘"
                className="w-12 h-12 opacity-50 mb-2"
              />
              <span className="body1_r text-[#999999]">이미지 혹은 스케치 추가</span>
            </label>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* 제목 입력 (조금 더 줄임) */}
        <input
          type="text"
          placeholder="제목 입력"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(''); // 입력 시 에러 메시지 즉시 제거
            // 입력 상태 변경 알림
            if (onInputChange) {
              onInputChange(e.target.value.trim().length > 0 || description.trim().length > 0);
            }
            // 즉시 미리보기 업데이트
            if (onPreviewChange) {
              onPreviewChange({
                image: imagePreview || '/thumbnail.svg', // 기본 썸네일 설정
                title: e.target.value,
                address: selectedPlace?.road_address_name || selectedPlace?.address_name || ''
              });
            }
          }}
          className="body1_sb focus:outline-none py-0.5 subtitle2_r border-none mb-4"
        />

        {/* 설명 입력 (늘려서 flex-1로 화면에 꽉 차게) */}
        <div className="relative flex-1 bg-[#F5F5F5] border-b-2 border-gray-500 mb-6">
          <textarea
            placeholder="설명 입력"
            maxLength={200}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(''); // 입력 시 에러 메시지 즉시 제거
              // 입력 상태 변경 알림
              if (onInputChange) {
                onInputChange(title.trim().length > 0 || e.target.value.trim().length > 0);
              }
              // 즉시 미리보기 업데이트
              if (onPreviewChange) {
                onPreviewChange({
                  image: imagePreview || '/thumbnail.svg', // 기본 썸네일 설정
                  title,
                  address: selectedPlace?.road_address_name || selectedPlace?.address_name || ''
                });
              }
            }}
            className="body2_r w-full h-full p-3 resize-none focus:outline-none border-none"
          />
          <div className="absolute bottom-2 right-3 text-gray-400 text-sm">
            {description.length}/200
          </div>
        </div>

        {/* 제출 버튼을 맨 아래로 고정 */}
        {error && (
          <div className="mb-4 text-red-500 text-sm font-semibold text-center">{error}</div>
        )}
        <button
          type="submit"
          className="
            mt-auto body1_sb w-full py-3
            bg-white text-black border-2 border-solid border-black
            rounded-md transition
            focus:outline-none
            hover:bg-gray-100 active:scale-[0.98]
          "
        >
          제출하기
        </button>

      </form>
    </div>
  );
};

export default SuggestionForm;
