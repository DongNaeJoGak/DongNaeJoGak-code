import React from 'react';
import classNames from 'classnames';

const statusColor = {
  '투표 중': 'border-green-500 text-green-600',
  '검토 중': 'border-green-400 text-green-500',
  '완료': 'border-yellow-500 text-yellow-600',
};

const IdeaCard = ({ idea }) => {
  return (
<div className="border rounded-lg overflow-hidden shadow-sm w-full">
  <img src={idea.image} alt={idea.title} className="w-full h-24 object-cover" />
  <div className="p-4"> {/* 기존 p-3 → p-4 로 여백 확대 */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-gray-800">{idea.title}</h3>
      <span className={classNames('text-xs font-medium px-2 py-1 border rounded', statusColor[idea.status])}>
        {idea.status}
      </span>
    </div>
    <div className="text-sm text-gray-500 flex gap-2">
      👍 {idea.likes} &nbsp;&nbsp; 👎 {idea.dislikes}
    </div>
  </div>
</div>

  );
};

export default IdeaCard;
