import React from 'react';
import ProfileImg from '../assets/ProfileImg.svg';
import Edit from '../assets/Edit.svg';

const MyPage = () => {
  const iconStyle = {
    width: 'auto',
    height: '120px',
  };
  const editIconStyle = {
    width: 'auto',
    height: '30px',
  };

  const profileImgButtonStyle = {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleProfileImgClick = () => {
    console.log('ProfileImg clicked');
  };

  const handleEditClick = () => {
    console.log('Edit button Clicked');
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center px-4">
      {/* 상단 좌측 로고 */}
      <div className="absolute top-4 left-4">
        <img src="/DNZG.png" alt="DNZG Logo" className="w-20 h-auto" />
      </div>

      {/* 전체 콘텐츠 wrapper */}
      <div className="pt-48 px-4 w-full max-w-md text-[1.2rem]">
        {/* 프로필 영역 */}
        <div className="flex mb-8 gap-6 items-start">
          {/* 프로필 이미지 */}
          <button onClick={handleProfileImgClick} style={profileImgButtonStyle}>
            <img src={ProfileImg} alt="프로필 이미지" style={iconStyle} />
          </button>

          {/* 텍스트 부분 */}
      <div className="flex flex-col justify-center space-y-2">
        <h2 className="text-2xl font-bold">Nickname</h2>
        <p className="text-base text-gray-600">아직 소개글이 없어요.</p>
        <button onClick={handleEditClick} style={profileImgButtonStyle} className="self-start">
          <img src={Edit} alt="수정하기" style={editIconStyle} className="block" />
        </button>
      </div>

        </div>

        {/* 나의 제안 아이디어 */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-xl">나의 제안 아이디어</h3>
          <input type="text" placeholder="제목" className="border w-full rounded px-4 py-3 mb-3 text-base" />
          <input type="text" placeholder="제목" className="border w-full rounded px-4 py-3 text-base" />
        </div>

        {/* 최근에 추천한 아이디어 */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-xl">최근에 추천한 아이디어</h3>
          <input type="text" placeholder="제목" className="border w-full rounded px-4 py-3 mb-3 text-base" />
          <input type="text" placeholder="제목" className="border w-full rounded px-4 py-3 text-base" />
        </div>

        {/* 나의 댓글 */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-xl">나의 댓글</h3>
          <input type="text" placeholder="내용" className="border w-full rounded px-4 py-3 mb-3 text-base" />
          <input type="text" placeholder="내용" className="border w-full rounded px-4 py-3 text-base" />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
