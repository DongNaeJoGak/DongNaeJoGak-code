import React from 'react';
import IdeaCard from './IdeaCard';

const mockIdeas = [
  {
    id: 1,
    title: '제목',
    status: '투표 중',
    likes: 20,
    dislikes: 5,
    image: '/idea1.png',
  },
  {
    id: 2,
    title: '제목',
    status: '검토 중',
    likes: 14,
    dislikes: 2,
    image: '/idea2.png',
  },
  {
    id: 3,
    title: '제목',
    status: '완료',
    likes: 35,
    dislikes: 1,
    image: '/idea3.png',
  },
];

const IdeaNearbyPanel = ({ selectedPlace }) => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      {/* 패널 제목 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          이 주변에 제안된 아이디어
        </h2>
        <p className="text-sm text-gray-600">
          다른 시민들의 제안을 확인하고 투표해보세요!
        </p>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-4">
        {mockIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
};

export default IdeaNearbyPanel;
