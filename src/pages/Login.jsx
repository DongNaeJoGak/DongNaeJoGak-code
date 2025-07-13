import React, { useEffect } from 'react';
import GoogleLogin from '../assets/GoogleLogin.svg';
import NaverLogin from '../assets/NaverLogin.svg';
import axios from 'axios';


const Login = ({ setGetToken, setUserInfo }) => {
  const iconStyle = {
    width: 'auto',
    height: '60px',
  };

  const loginButtonStyle = {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // ✅ 백엔드에서 state 처리하므로 단순히 이동만 하면 됨
  const handleNaverLoginClick = () => {
    //const state = Math.random().toString(36).substring(2);
    //localStorage.setItem('naver_oauth_state', state);
  
    window.location.href = `https://dongnaejogak.kro.kr/oauth2/authorize/naver`;
    //?state=${state}
  };
  

  const handleGoogleLoginClick = () => {

  };
  

  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center">
      {/* 상단 좌측 로고 */}
      <div className="absolute top-4 left-4">
        <img src="/DNZG.png" alt="DNZG Logo" className="w-20 h-auto" />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col items-start justify-center flex-1 px-4 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-7 text-left">로그인</h1>
        <p className="text-xs text-gray-900 text-left mb-7">
          로그인하고 더 많은 공공디자인 제안에 참여해보세요!
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button onClick={handleGoogleLoginClick} style={loginButtonStyle}>
            <img src={GoogleLogin} alt="구글 로그인" style={iconStyle} />
          </button>
          <button onClick={handleNaverLoginClick} style={loginButtonStyle}>
            <img src={NaverLogin} alt="네이버 로그인" style={iconStyle} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;