import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchInput = ({ onPlaceSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        fetchPlaces(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchPlaces = async (keyword) => {
    try {
      const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
      const res = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        params: { query: keyword },
        headers: {
          Authorization: `KakaoAK ${apiKey}`
        },
      });
      setResults(res.data.documents);
    } catch (err) {
      console.error('장소 검색 실패:', err);
    }
  };

  const handleClick = (place) => {
    console.log('✅ 선택된 장소:', place);
    onPlaceSelect(place); // 부모에 전달
    setQuery(place.place_name); // input에 선택된 장소 표시
    setResults([]); // 리스트 닫기
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="장소 입력"
        className="w-full body1_r border-b-[1.7px] py-1 focus:outline-none body1_r mt-6 ml-1 tracking-tight"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-white border shadow w-full mt-1 max-h-60 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.id}
              onClick={() => handleClick(place)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium flex items-center">
               <img
                 src="/vector.svg"
                 alt=""
                 className="w-4 h-4 mr-2 object-contain"
               />
               {place.place_name}
             </div>
              <div className="text-sm text-gray-500">{place.road_address_name || place.address_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
