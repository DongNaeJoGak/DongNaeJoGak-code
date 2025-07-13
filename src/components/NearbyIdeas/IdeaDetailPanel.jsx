// src/components/NearbyIdeas/IdeaDetailPanel.jsx
import React, { useState, useEffect} from 'react';



export default function IdeaDetailPanel({ idea, onClose }) {
    const [nearbyIdeas, setNearbyIdeas] = useState([]);

    const cursor = 0; // 고정값
    const size = 10;  // 고정값

    useEffect(() => {
      console.log('받아온 idea 전체 ▶', idea);
      console.log('받아온 idea.imageUrl ▶', idea.imageUrl);
  }, [idea.imageUrl]);

    useEffect(() => {
    if (idea?.ideaId) {
      // 📡 nearby API 호출
       fetch(`https://dongnaejogak.kro.kr/api/ideas/${idea.ideaId}/nearby?cursor=${cursor}&size=${size}`)

        .then(res => res.json())
        .then(data => {
          console.log('🔥 근처 아이디어 ▶', data);
          if (data.isSuccess && Array.isArray(data.result.ideas)) {
             setNearbyIdeas(data.result.ideas);
          }
        })
        .catch(err => console.error('❌ 근처 아이디어 불러오기 실패:', err));
    }
  }, [idea]);


  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [currentReplyText, setCurrentReplyText] = useState('');
  const [reportOpenId, setReportOpenId] = useState(null);
  const [selectedReportOption, setSelectedReportOption] = useState('');
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [isReactionLoading, setIsReactionLoading] = useState(false);
  const [userReaction, setUserReaction] = useState(null);


  const [likes, setLikes] = useState(idea?.likeNum ?? 0);
  const [dislikes, setDislikes] = useState(idea?.dislikeNum ?? 0);

  // idea가 변경될 때 좋아요/싫어요 상태 업데이트
  useEffect(() => {
    if (idea) {
      setLikes(idea.likeNum ?? 0);
      setDislikes(idea.dislikeNum ?? 0);
    }
  }, [idea]);


  const address = idea.road_address_name || idea.address_name || '';

  const handleReaction = async (reactionType) => {
    console.log('🔍 idea 객체 확인:', idea);
    console.log('🔍 idea.ideaId 확인:', idea?.ideaId);
    console.log('🔍 idea의 모든 키 확인:', idea ? Object.keys(idea) : 'idea가 null');
    console.log('🔍 reactionType 확인:', reactionType);
    
    if (!idea?.ideaId || isReactionLoading) return;
  
    setIsReactionLoading(true);
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
  
            const url = `https://dongnaejogak.kro.kr/api/ideaReactions/${idea.ideaId}?reactionType=${reactionType}`;
      console.log('🔍 요청 URL 확인:', url);

      console.log('📡 최종 요청', {
        url: `https://dongnaejogak.kro.kr/api/ideaReactions/${idea.ideaId}?reactionType=${reactionType}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 응답 데이터:', data);
  
      if (response.ok && data.isSuccess) {
        const { likeNum, dislikeNum, memberReactionType } = data.result;
  
        setLikes(likeNum);
        setDislikes(dislikeNum);
        setUserReaction(memberReactionType); // 'LIKE' | 'DISLIKE' | null
      } else {
        alert(`반응 처리 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('❌ 반응 처리 중 오류:', err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsReactionLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (!idea?.ideaId) return;
  
    const fetchComments = async () => {
      try {
        const res = await fetch(`https://dongnaejogak.kro.kr/api/ideas/${idea.ideaId}/comments?page=0&size=10`);
        const data = await res.json();
        if (data.isSuccess) {
          setComments(data.result.comments.map(c => ({
            id: c.commentId,
            author: c.writerName,
            date: c.createdAt.slice(0, 16).replace('T', ' '),
            text: c.content,
            replies: c.replies.map(r => ({
              id: r.replyId,
              author: r.writerName,
              date: r.createdAt.slice(0, 16).replace('T', ' '),
              text: r.content
            }))
          })));
        }
      } catch (err) {
        console.error('❌ 댓글 로딩 실패:', err);
      }
    };
  
    fetchComments();
  }, [idea]);
  

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;
  
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`https://dongnaejogak.kro.kr/api/ideas/${idea.ideaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      });
  
      const data = await res.json();
      if (data.isSuccess) {
        setNewComment('');
        // 새로고침 없이 댓글 반영
        setComments(prev => [
          {
            id: data.result.commentId,
            author: '나의닉네임',
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            text,
            replies: []
          },
          ...prev
        ]);
      } else {
        alert('댓글 작성 실패');
      }
    } catch (err) {
      console.error('❌ 댓글 작성 실패:', err);
    }
  };
  

  const handleAddReply = async (parentId, replyText) => {
    const text = replyText.trim();
    if (!text) return;
  
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`https://dongnaejogak.kro.kr/api/ideas/${idea.ideaId}/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      });
  
      const data = await res.json();
      if (data.isSuccess) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? {
                  ...c,
                  replies: [
                    ...c.replies,
                    {
                      id: data.result.commentId,
                      author: '나의닉네임',
                      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                      text
                    }
                  ]
                }
              : c
          )
        );
        setReplyOpenId(null);
        setCurrentReplyText('');
      } else {
        alert('답글 작성 실패');
      }
    } catch (err) {
      console.error('❌ 대댓글 작성 실패:', err);
    }
  };
  

  const total = likes + dislikes || 1;
  const likePct = Math.round((likes/total)*100);

  return (
      <div
        className={`fixed top-16 bottom-16 right-[454px] w-[400px] bg-white shadow-lg rounded-lg overflow-hidden 
          transform transition-transform duration-300 ease-in-out z-40 
          ${idea ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

      {reportOpenId !== null && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[322px] h-[370px] relative">
            <button
              onClick={() => setReportOpenId(null)}
              className="absolute top-5 right-5 w-4 h-4"
            >
              <img src="/icons/x.svg" alt="닫기" className="w-full h-full" />
            </button>
            <h3 className="ml-2 mt-3 body1_sb mb-4">신고하기</h3>
            <ul className="ml-2 body2_r space-y-2">
              {['욕설/비하 발언','음란성','홍보성 콘텐츠','개인정보 노출','특정인 비방','기타'].map(opt => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => setSelectedReportOption(opt)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={`/icons/${selectedReportOption === opt ? 'selected.svg' : 'unselected.svg'}`}
                      alt={selectedReportOption === opt ? '선택됨' : '선택안됨'}
                      className="w-5 h-5"
                    />
                    <span>{opt}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setReportOpenId(null);
                  setShowReportSuccess(true);
                  setTimeout(() => setShowReportSuccess(false), 2000);
                }}
                className="w-[160px] h-[55px]"
              >
                <img src="/icons/report.svg" alt="신고 제출" className="w-full h-full" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 신고 완료 모달 */}
      
      {showReportSuccess && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[322px] h-[370px] relative text-center">
            <button
              onClick={() => setShowReportSuccess(false)}
              className="absolute top-5 right-5 w-4 h-4"
            >
        <img src="/icons/x.svg" alt="닫기" className="w-full h-full" />
      </button>

              {/* 체크 아이콘 */}
              <img
                src="/icons/check.svg"
                alt="완료"
                className="mx-auto w-24 h-24 mt-13 mb-4"
              />

              {/* 타이틀 */}
              <p className="body1_sb text-black tracking-tighter mt-9 mb-2">
                신고가 완료되었습니다.
              </p>

              {/* 본문 설명 */}
              <p className="text-[14px] font-semibold text-gray-400 tracking-tighter leading-normal whitespace-pre-line mt-5">
                허위 신고의 경우 서비스 이용제한과 같은<br />
                불이익을 받으실 수 있습니다.
              </p>
            </div>
          </div>
        )}

      


      <div className="relative h-full flex flex-col">
        <button onClick={onClose} className="absolute top-5 right-5 z-20 w-4 h-4">
          <img src="/icons/x.svg" alt="닫기" className="w-full h-full" />
        </button>
        <img
          src={
            idea.imageUrl
              ? idea.imageUrl.startsWith('http')
                ? idea.imageUrl
                : `https://dongnaejogak.kro.kr/${idea.imageUrl}`
              : '/example.png'
          }
          onError={(e) => {
            e.target.onerror = null; // 무한루프 방지
            e.target.src = '/example.png';
          }}
          alt={idea.title}
          className="w-full h-60 object-cover"
        />

        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="body1_sb text-gray-800">{idea.title}</h2>
            <span className="mini tag2_r text-gray-500">{address}</span>
          </div>
          <hr className="border-2 border-gray-300 mb-4" />
          <p className="body2_r text-gray-800 mb-4 flex-shrink-0">{idea.content || '상세 설명이 여기에 들어갑니다.'}</p>
          <hr className="border-2 border-gray-300 mb-8" />
          <div className="flex items-center mb-4">
            <div className="flex flex-col items-center">
              <button 
                onClick={() => handleReaction('LIKE')} 
                disabled={isReactionLoading}
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  userReaction === 'LIKE' ? 'bg-[#59E400]' : 'bg-gray-300'
                }`}
              >
                <img src="/good.svg" alt="좋아요" className="w-6 h-6"/>
              </button>
              <span className="mt-1 text-[#59E400]">{likes}</span>
            </div>
            <div className="mb-5 mx-auto w-2/3 relative h-5 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-[#59E400]" style={{width:`${likePct}%`}}/>
              <div className="absolute right-0 top-0 bottom-0 bg-[#E74343]" style={{width:`${100 - likePct}%`}}/>
            </div>
            <div className="flex flex-col items-center">
              <button 
                onClick={() => handleReaction('DISLIKE')} 
                disabled={isReactionLoading}
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  userReaction === 'DISLIKE' ? 'bg-[#E74343]' : 'bg-gray-300'
                }`}
              >
                <img src="/bad.svg" alt="싫어요" className="w-6 h-6"/>
              </button>
              <span className="mt-1 text-[#E74343]">{dislikes}</span>
            </div>
          </div>
          <h3 className="font-semibold mb-2 text-gray-800">댓글 {comments.length}개</h3>
          <div className="pt-4 mb-4 flex-shrink-0">
            <textarea rows={1} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" className="body2_r w-full border-0 border-b-2 border-gray-00 focus:border-black focus:outline-none pb-1 pt-0 resize-none leading-tight"/>
            <div className="mt-2 flex justify-end space-x-2">
              <button onClick={() => setNewComment('')} className="flex-none flex items-center justify-center w-[55px] h-[32px]"><img src="/icons/cancel.svg" alt="취소" className="w-12 h-12"/></button>
              <button onClick={handleAddComment} className="flex-none flex items-center justify-center w-[55px] h-[32px]"><img src="/icons/post.svg" alt="작성" className="w-12 h-12"/></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4">
            {comments.map(c => (
              <div key={c.id} className="p-3 rounded-lg relative">
                <div className="flex justify-between items-start">
                  <div><span className="mini tag1_m font-semibold text-[16px]">{c.author}</span><span className="ml-2 mini tag2_r text-[13px] text-gray-500">{c.date}</span></div>
                  <button onClick={() => setReportOpenId(c.id)} className="text-gray-600">⋮</button>
                </div>
                <p className="mt-2 text-gray-800">{c.text}</p>
                <button onClick={() => setReplyOpenId(replyOpenId === c.id ? null : c.id)} className="mini tag2_r text-[13px] text-gray-600 mt-2 mb-2">답글 쓰기</button>
                {(c.replies.length > 0 || replyOpenId === c.id) && (
                  <div className="-mx-4 bg-gray-100 px-4 py-4 rounded-b-lg">
                    {replyOpenId === c.id && (
                      <div className="mb-2">
                        <div className="flex items-center">
                          <img src="/icons/comment.svg" alt="답글 아이콘" className="w-4 h-4 inline-block align-middle -mt-0.5 mr-2"/>
                          <input type="text" value={currentReplyText} onChange={e => setCurrentReplyText(e.target.value)} placeholder="답글 입력" className="body2_r w-full border-0 border-b-2 border-gray-00 focus:border-black focus:outline-none pb-1 pt-0 resize-none leading-tight"/>
                          <button onClick={() => setReportOpenId(/* reply id placeholder */)} className="ml-2 text-gray-600">⋮</button>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button onClick={() => { setReplyOpenId(null); setCurrentReplyText(''); }} className="flex-none flex items-center justify-center w-[55px] h-[32px]"><img src="/icons/cancel.svg" alt="취소" className="w-12 h-12"/></button>
                          <button onClick={() => handleAddReply(c.id, currentReplyText)} className="flex-none flex items-center justify-center w-[55px] h-[32px]"><img src="/icons/post.svg" alt="작성" className="w-12 h-12"/></button>
                        </div>
                      </div>
                    )}
                    {c.replies.map(r => (
                      <div key={r.id} className="pt-3">
                        <div className="flex justify-between items-center mini tag1_m text-xs text-gray-600 leading-none">
                          <div className="flex items-center gap-1">
                            <img src="/icons/comment.svg" alt="답글 아이콘" className="w-4 h-4 inline-block align-middle -mt-0.5 mr-1"/>
                            <span className="mini tag1_m font-semibold text-[16px]">{r.author}</span>
                            <span className="ml-1 mini tag2_r text-[13px] text-gray-500">{r.date}</span>
                          </div>
                          <button onClick={() => setReportOpenId(r.id)} className="text-gray-600">⋮</button>
                        </div>
                        <p className="ml-6 mt-3 mb-2 text-gray-800">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
