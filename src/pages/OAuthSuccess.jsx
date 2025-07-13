import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      axios.get(`https://dongnaejogak.kro.kr/api/oauth2/login/NAVER`, {
        params: { code, state },
        //withCredentials: true,
      })
        .then((res) => {
          console.log('✅ 로그인 응답:', res.data);

          const { accessToken, refreshToken } = res.data.result;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          

          // 사용자 정보 요청
          axios.get('https://dongnaejogak.kro.kr/api/members/info', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((userRes) => {
            const username = userRes.data?.result?.username;
            if (username) {
              console.log('사용자 이름:', username);
          
              // ✅ 사용자 이름 저장
              localStorage.setItem('userName', username);
              
              // localStorage 변경 이벤트 발생 (다른 탭용)
              window.dispatchEvent(new StorageEvent('storage', {
                key: 'userName',
                newValue: username,
                url: window.location.href
              }));
              
              // 같은 탭에서의 변경 감지용 커스텀 이벤트
              window.dispatchEvent(new CustomEvent('userLoginChange'));
            } else {
              console.log('사용자 이름 정보를 찾을 수 없습니다.');
            }
          
            // ✅ 사용자 정보 저장 후 홈으로 이동
            navigate('/');
          })
          .catch((err) => {
            console.error('사용자 정보 요청 실패:', err);
            alert('사용자 정보를 불러오지 못했습니다.');
            navigate('/');
          });
        })
        .catch((err) => {
          console.error('❌ 로그인 요청 실패:', err);
          if (err.response) {
            console.error('📦 백엔드 응답:', err.response.data);
          }
          alert('로그인 실패. 홈으로 이동합니다.');
          navigate('/');
        });
    } else {
      console.error('❌ code 또는 state 없음');
      alert('로그인 실패. 홈으로 이동합니다.');
      navigate('/');
    }
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuthSuccess;
