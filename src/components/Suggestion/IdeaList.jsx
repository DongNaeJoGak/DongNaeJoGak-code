import React, { useEffect, useState } from 'react';

export default function IdeaList() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetch("https://dongnaejogak.kro.kr/api/ideas?page=0&size=10")
      .then(res => res.json())
      .then(data => {
        setIdeas(data.result.ideas || []);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">등록된 아이디어 목록</h2>
      {ideas.map((idea) => (
        <div key={idea.ideaId} className="mb-4 p-3 border rounded shadow">
          <h3 className="font-semibold">{idea.title}</h3>
          <p>{idea.content}</p>
          <p className="text-sm text-gray-500">
            위치: 위도 {idea.latitude}, 경도 {idea.longitude}
          </p>
        </div>
      ))}
    </div>
  );
}
