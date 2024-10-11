import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { User } from 'lucide-react';
import axios from 'axios';

const PostComment = ({ post, toggleLike, onClose, newPost, fetchComments }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [likedByUser, setLikedByUser] = useState(false);

  useEffect(() => {
    // Fetch updated comments whenever post id changes
    fetchComments(post.id).then((updatedComments) => {
      setComments(updatedComments || []);
    });
  }, [post.id, fetchComments]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/likedPosts');
        const likedPosts = response.data;

        const currentUser = localStorage.getItem('loggedInUser');
        const currentUserEmail = currentUser ? JSON.parse(currentUser).email : 'Anonymous';

        const isLiked = likedPosts.some(
          (like) => like.email === currentUserEmail && like.postid === post.id
        );
        setLikedByUser(isLiked);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, [post.id]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      const currentUser = localStorage.getItem('loggedInUser');
      const currentUserEmail = currentUser ? JSON.parse(currentUser).email : 'Anonymous';

      const newCommentData = {
        "Post ID": post.id,
        Username: currentUserEmail,
        Title: "Comment", // You can modify this to fit your structure
        Content: newComment,
        Comments: "No replies",
        date: new Date().toISOString(), // Adding the date property
      };

      const updatedComments = [...comments, newCommentData];

      try {
        const response = await fetch(`http://localhost:5000/api/data/posts`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: post.id,
            comments: updatedComments,
          }),
        });

        console.log(updatedComments);

        if (response.ok) {
          setComments(updatedComments);
          setNewComment('');
        }
      } catch (error) {
        console.error('Error while submitting comment:', error);
      }
    }
  };

  const formatDate = (date) => {
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      return 'Invalid Date';
    }

    return validDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-gray-100 shadow-lg rounded-lg overflow-hidden border border-gray-300 max-w-3xl w-full ${comments.length > 0 ? 'h-[90vh]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-4 bg-white p-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-black-500">
            <User size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#2B2B2B]">{post.username}</p>
            <h2 className="text-xl font-semibold text-[#009368]">{post.title}</h2>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[#2B2B2B]">{post.content}</p>
        </div>

        <div className="flex justify-start space-x-4 p-4 bg-white">
          <button
            className="flex items-center space-x-1 text-[#009368] hover:text-[#00805c] transition-transform transform hover:scale-110"
            onClick={() => {
              toggleLike(post.id);
              setLikedByUser(!likedByUser);
            }}
          >
            {likedByUser ? (
              <FaHeart size={20} />
            ) : (
              <FaRegHeart size={20} />
            )}
            <span className="text-sm">Like</span>
          </button>
          <button
            className="flex items-center space-x-1 text-[#009368] hover:text-[#00805c] transition-transform transform hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <FaComment size={20} />
            <span className="text-sm">Comment</span>
          </button>
        </div>

        {comments && comments.length > 0 && (
          <div className="bg-white p-4 border-t border-gray-300">
            <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4 pl-2">Comments</h3>
            <div className="h-52 overflow-y-auto space-y-4 custom-scrollbar">
              {comments.map((comment, index) => (
                <div key={index} className="pl-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black-500">
                      <User size={19} />
                    </div>
                    <p className="text-sm font-medium text-[#009368]">
                      {comment.Username ? comment.Username.split('@')[0] : 'Anonymous'}
                    </p>
                  </div>

                  <div className="mr-6 bg-white border border-gray-300 rounded-lg p-4 shadow-md">
                    <p className="text-sm text-[#5a5a5a] mb-1">
                      {comment.Content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(comment.date)}  {/* Displaying the date here */}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment input field should always be visible, placed below the comments section */}
        <div className="flex items-center justify-between p-4 bg-white border-t border-gray-300">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-[#009368] text-sm"
          />
          <button
            onClick={handleCommentSubmit}
            className="ml-4 bg-[#009368] text-white px-4 py-1 rounded-lg hover:bg-[#007f58] focus:ring-2 focus:ring-[#007f58] focus:ring-opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
