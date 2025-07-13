import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import OAuthSuccess from './pages/OAuthSuccess'
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';

// import reactLogo from './assets/react.svg'



function App() {

  const [userInfo, setUserInfo] = useState(null);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home userInfo={userInfo} />} />
      <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
{/*      
   
      
      <Route path="/login/oauth2/code/naver" element={<OAuthSuccess />} />
      
*/}   <Route path="/login/oauth2/code/naver" element={<OAuthSuccess setUserInfo={setUserInfo} />} />
      <Route path="/login/naver/success" element={<OAuthSuccess />} />
      <Route path="/login/success" element={<OAuthSuccess setUserInfo={setUserInfo} />} />
      <Route path="/mypage" element={<MyPage userInfo={userInfo} />} />
      </Routes>
    </Router>
  );
}

export default App;