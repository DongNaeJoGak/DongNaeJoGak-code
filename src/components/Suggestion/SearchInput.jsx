// src/components/Suggestion/SearchInput.jsx
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
    console.log('현재 API KEY:', apiKey); // ✅ 콘솔에서 제대로 찍히는지 확인
    if (!apiKey) {
      console.error('Kakao API key가 설정되지 않았습니다.');
      return;
    }

    const res = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
      params: { query: keyword },
      headers: {
          Authorization: `KakaoAK ${apiKey}`  // ✅ 공백도 중요
      },
    });
    setResults(res.data.documents);
  } catch (err) {
    console.error('장소 검색 실패:', err);
  }
};


  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="장소 검색"
        className="w-full border-b border-gray-400 py-1 focus:outline-none"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border shadow w-full mt-1 max-h-60 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.id}
              onClick={() => {
                onPlaceSelect(place);
                setResults([]);
                setQuery(place.place_name);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">📍 {place.place_name}</div>
              <div className="text-sm text-gray-500">{place.road_address_name || place.address_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
