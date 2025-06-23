// SuggestionForm.jsx
import React, { useState } from 'react';

const SuggestionForm = ({ selectedPlace }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const location = selectedPlace?.place_name || '';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ location, title, description, image });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">공공디자인 아이디어 제안하기</h2>
      <p className="mb-6 text-gray-600">아이디어 제안을 통해 더욱 안전한 도시를 만들어보아요!</p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* 장소 입력 */}
        <div>
          <label className="font-semibold">선택한 장소</label>
          <input
            type="text"
            value={location}
            readOnly
            className="w-full border-b border-gray-400 py-1 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="border border-gray-300 h-40 flex items-center justify-center">
          {image ? (
            <img src={image} alt="업로드된 이미지" className="h-full object-contain" />
          ) : (
            <label htmlFor="imageUpload" className="text-gray-400 cursor-pointer">
              이미지 혹은 스케치 추가
            </label>
          )}
          <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <input
          type="text"
          placeholder="제목 입력"
          className="border-b border-gray-300 focus:outline-none py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="설명 입력"
          maxLength={200}
          rows={4}
          className="border border-gray-300 p-2 resize-none focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="text-right text-gray-400 text-sm">{description.length}/200</div>

        <button
          type="submit"
          className="w-full py-2 border border-black rounded-md font-semibold hover:bg-black hover:text-white transition"
        >
          제출하기
        </button>
      </form>
    </div>
  );
};

export default SuggestionForm;
