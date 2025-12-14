// d:\PBL6_FE\e-learning-fe\src\features\course\Learning\DiscussionTab.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axiosAuth from '../../../api/axiosAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { voteForComment } from '../api';

interface ReplyRef {
  commentId: string;
  likeCount: number;
  dislikeCount: number;
  parentCommentId: string;
}

interface Comment {
  commentId: string;
  lectureId: string;
  userId: string;
  content: string;
  userName: string;
  userAvatar: string;
  createdAt: number;
  likeCount: number;
  dislikeCount: number;
  replies?: ReplyRef[];
  parentCommentId?: string;
  userVoteStatus?: 'LIKE' | 'DISLIKE' | null;
}

interface DiscussionTabProps {
  lectureId: string;
}

const CommentItem: React.FC<{
  comment: Comment;
  lectureId: string;
  onReplySuccess: () => void;
}> = ({ comment, lectureId, onReplySuccess }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [repliesDetails, setRepliesDetails] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch details for a specific comment ID
  const fetchCommentDetail = useCallback(async (commentId: string) => {
    try {
      const res = await axiosAuth.get(`/lectures/${lectureId}/comments/${commentId}`);
      if (res.data.status === 'success') {
        return res.data.data as Comment;
      }
    } catch (error) {
      console.error(`Failed to fetch comment detail for ${commentId}`, error);
    }
    return null;
  }, [lectureId]);

  // Initial fetch for the first reply if it exists
  useEffect(() => {
    const loadFirstReply = async () => {
      if (comment.replies && comment.replies.length > 0) {
        // Only fetch if we haven't loaded any replies yet
        if (repliesDetails.length === 0) {
            const firstReplyId = comment.replies[0].commentId;
            const detail = await fetchCommentDetail(firstReplyId);
            if (detail) {
              setRepliesDetails([detail]);
            }
        }
      }
    };
    loadFirstReply();
  }, [comment.replies, fetchCommentDetail, repliesDetails.length]);

  const handleLoadMoreReplies = async () => {
    if (!comment.replies) return;
    setLoadingReplies(true);
    
    // Determine which replies haven't been loaded yet
    const loadedIds = new Set(repliesDetails.map(r => r.commentId));
    const commentsToLoad = comment.replies.filter(r => !loadedIds.has(r.commentId));

    const newDetails: Comment[] = [];
    for (const replyRef of commentsToLoad) {
      const detail = await fetchCommentDetail(replyRef.commentId);
      if (detail) {
        newDetails.push(detail);
      }
    }

    setRepliesDetails(prev => [...prev, ...newDetails]);
    setLoadingReplies(false);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await axiosAuth.post(`/lectures/${lectureId}/comments/${comment.commentId}/reply`, {
        content: replyContent
      });
      setReplyContent("");
      setIsReplying(false);
      onReplySuccess(); // Refresh the parent list to show new reply structure
    } catch (error) {
      console.error("Failed to reply", error);
      alert("Không thể gửi phản hồi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
    try {
      await voteForComment(lectureId, comment.commentId, voteType);
      onReplySuccess(); // Refresh data to update counts and status
    } catch (error) {
      console.error("Failed to vote", error);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.max(0, now - timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return new Date(timestamp).toLocaleString('vi-VN');
    }
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    if (seconds > 10) return `${seconds} giây trước`;
    
    return "Vừa xong";
  };

  return (
    <div className="flex gap-3 mb-6">
      <img 
        src={comment.userAvatar || "https://ui-avatars.com/api/?name=" + comment.userName} 
        alt={comment.userName} 
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-3 inline-block min-w-[200px]">
          <div className="font-bold text-sm text-gray-900">{comment.userName}</div>
          <div className="text-gray-800 mt-1">{comment.content}</div>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500 font-semibold">
          <button onClick={() => handleVote('LIKE')} className={`flex items-center gap-1.5 transition-colors ${comment.userVoteStatus === 'LIKE' ? 'text-[#106c54]' : 'hover:text-[#106c54]'}`}>
            <i className={`${comment.userVoteStatus === 'LIKE' ? 'fas' : 'far'} fa-thumbs-up text-sm`}></i>
            <span>{comment.likeCount || 0}</span>
          </button>
          <button onClick={() => handleVote('DISLIKE')} className={`flex items-center gap-1.5 transition-colors ${comment.userVoteStatus === 'DISLIKE' ? 'text-red-600' : 'hover:text-red-600'}`}>
            <i className={`${comment.userVoteStatus === 'DISLIKE' ? 'fas' : 'far'} fa-thumbs-down text-sm`}></i>
            <span>{comment.dislikeCount || 0}</span>
          </button>
          <button onClick={() => setIsReplying(!isReplying)} className="hover:text-gray-800 transition-colors">Phản hồi</button>
          <span className="font-normal text-gray-400">{formatTime(comment.createdAt)}</span>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 flex gap-2">
             <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#106c54]"
              placeholder="Viết phản hồi..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting) {
                  handleSubmitReply();
                }
              }}
              autoFocus
            />
            <button 
              onClick={handleSubmitReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-[#106c54] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#0d5a45] disabled:bg-gray-300"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        )}

        {/* Replies List */}
        {repliesDetails.length > 0 && (
          <div className="mt-3 space-y-3">
            {repliesDetails.map(reply => (
              <div key={reply.commentId} className="flex gap-3">
                <img 
                  src={reply.userAvatar || "https://ui-avatars.com/api/?name=" + reply.userName} 
                  alt={reply.userName} 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block">
                    <div className="font-bold text-xs text-gray-900">{reply.userName}</div>
                    <div className="text-gray-800 text-sm mt-0.5">{reply.content}</div>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-2 text-xs text-gray-500 font-semibold">
                    <button 
                      onClick={async () => {
                        try {
                          await voteForComment(lectureId, reply.commentId, 'LIKE');
                          const updatedReply = await axiosAuth.get(`/lectures/${lectureId}/comments/${reply.commentId}`);
                          if (updatedReply.data.status === 'success') {
                             setRepliesDetails(prev => prev.map(r => r.commentId === reply.commentId ? updatedReply.data.data : r));
                          }
                        } catch (e) { console.error(e); }
                      }}
                      className={`flex items-center gap-1 transition-colors ${reply.userVoteStatus === 'LIKE' ? 'text-[#106c54]' : 'hover:text-[#106c54]'}`}
                    >
                      <i className={`${reply.userVoteStatus === 'LIKE' ? 'fas' : 'far'} fa-thumbs-up`}></i>
                      <span>{reply.likeCount || 0}</span>
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await voteForComment(lectureId, reply.commentId, 'DISLIKE');
                          const updatedReply = await axiosAuth.get(`/lectures/${lectureId}/comments/${reply.commentId}`);
                          if (updatedReply.data.status === 'success') {
                             setRepliesDetails(prev => prev.map(r => r.commentId === reply.commentId ? updatedReply.data.data : r));
                          }
                        } catch (e) { console.error(e); }
                      }}
                      className={`flex items-center gap-1 transition-colors ${reply.userVoteStatus === 'DISLIKE' ? 'text-red-600' : 'hover:text-red-600'}`}
                    >
                      <i className={`${reply.userVoteStatus === 'DISLIKE' ? 'fas' : 'far'} fa-thumbs-down`}></i>
                      <span>{reply.dislikeCount || 0}</span>
                    </button>
                    <span className="font-normal text-gray-400">{formatTime(reply.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Replies Button */}
        {comment.replies && comment.replies.length > repliesDetails.length && (
          <button 
            onClick={handleLoadMoreReplies}
            disabled={loadingReplies}
            className="mt-2 text-sm text-[#106c54] font-semibold hover:underline flex items-center gap-1"
          >
            <i className="fas fa-reply rotate-180"></i>
            {loadingReplies ? "Đang tải..." : `Xem thêm ${comment.replies.length - repliesDetails.length} phản hồi khác`}
          </button>
        )}
      </div>
    </div>
  );
};

const DiscussionTab: React.FC<DiscussionTabProps> = ({ lectureId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchComments = useCallback(async (pageNum: number, isRefresh = false) => {
    if (!lectureId) return;
    if (isRefresh) setLoading(true);
    
    try {
      const res = await axiosAuth.get(`/lectures/${lectureId}/comments/Page`, {
        params: {
          order: 'desc',
          page: pageNum,
          paging: 5,
          sort: 'created_At'
        }
      });

      if (res.data.status === 'success') {
        const newComments = res.data.data;
        setComments(prev => isRefresh ? newComments : [...prev, ...newComments]);
        setHasMore(res.data.meta.current_page < res.data.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    setPage(1);
    fetchComments(1, true);
  }, [lectureId, fetchComments]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      await axiosAuth.post(`/lectures/${lectureId}/comments`, {
        content: newComment
      });
      setNewComment("");
      // Refresh comments to show the new one
      fetchComments(1, true);
      setPage(1);
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Không thể đăng bình luận. Vui lòng thử lại.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Thảo luận</h2>
      
      {/* Comment Input */}
      <div className="flex gap-4 mb-8">
        <img 
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.first_name || 'User'}`} 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#106c54] focus:border-[#106c54] min-h-[80px]"
            placeholder="Bạn có thắc mắc gì không? Hãy hỏi ngay..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isPosting) {
                e.preventDefault();
                handlePostComment();
              }
            }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handlePostComment}
              disabled={isPosting || !newComment.trim()}
              className="bg-[#106c54] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0d5a45] disabled:bg-gray-300 transition-colors"
            >
              {isPosting ? "Đang đăng..." : "Bình luận"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.map(comment => (
          <CommentItem 
            key={comment.commentId} 
            comment={comment} 
            lectureId={lectureId}
            onReplySuccess={() => fetchComments(1, true)} // Simple refresh strategy
          />
        ))}
      </div>

      {loading && <div className="text-center py-4 text-gray-500">Đang tải bình luận...</div>}
      
      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchComments(nextPage);
            }}
            className="text-[#106c54] font-semibold hover:underline"
          >
            Xem thêm bình luận cũ hơn
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscussionTab;
