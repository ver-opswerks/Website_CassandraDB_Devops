import React, { useState, useEffect } from 'react';
import Header from './Header';
import Nav from './Nav';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MessageCircle, User } from 'lucide-react';
import PostComment from '../components/PostComment';
import PostCreate from '../components/CreatePost';
import axios from 'axios';
import config from '../components/Config'; 

export default function Home() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [isPostCreateOpen, setIsPostCreateOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [newPost, setNewPost] = useState([]);

  // Fetch posts and liked posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/data/posts`);
        setPosts(response.data.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/data/likedPosts`);
        setLikedPosts(response.data);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
    if (loggedInUser && loggedInUser.loggedin) {
      console.log('Logged-in user:', loggedInUser.email);
      setCurrentUserEmail(loggedInUser.email);
      fetchLikedPosts();
    } else {
      console.error('No user is logged in.');
    }

    fetchPosts();
  }, []);

  // Fetch all posts from the backend (and look for specific post ID)
const fetchComments = async (postId) => {
  try {
    // Fetch all posts from the backend
    const response = await axios.get(`${config.apiBaseUrl}/api/data/posts`);
    
    // Find the post with the matching postId from the fetched posts
    const post = response.data.find((p) => p.id === postId);
    
    if (post) {
      return post.comments;
    } else {
      console.error('Post not found');
      return null; 
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return null;
  }
};


  // Check if a post was liked by the current user
  const hasUserLikedPost = (postId) => {
    return likedPosts.some(
      (like) => like.postid === postId && like.email === currentUserEmail
    );
  };

  // Toggle like or unlike a post
  const toggleLike = async (postId) => {
    if (!currentUserEmail) {
      console.warn('User is not logged in.');
      return;
    }

    const isLiked = hasUserLikedPost(postId);

    try {
      if (isLiked) {
        // Remove like
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((like) => !(like.postid === postId && like.email === currentUserEmail))
        );

        const response = await axios.delete(`${config.apiBaseUrl}/api/data/likedPosts`, {
          data: {
            email: currentUserEmail,
            postId: postId,
          },
        });

        if (response.status === 200) {
          console.log('Removed like for postId:', postId);
        } else {
          console.error('Failed to remove liked post:', response.data);
        }
      } else {
        // Add like
        const newLike = { postid: postId, email: currentUserEmail };
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, newLike]);

        const response = await axios.post(`${config.apiBaseUrl}/api/data/likedPosts`, {
          email: currentUserEmail,
          postId: postId,
        });

        if (response.status === 200) {
          console.log('Liked post:', postId);
        } else {
          console.error('Failed to insert liked post:', response.data);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openOverlay = (post) => {
    setActivePost(post);
  };

  const closeOverlay = () => {
    setActivePost(null);
  };

  const openPostCreate = () => {
    setIsPostCreateOpen(true);
  };

  const closePostCreate = () => {
    setIsPostCreateOpen(false);
  };

  const addNewPost = async (newPost) => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/data/posts`, newPost);
  
      console.log(newPost, "new post");
      setNewPost(newPost);
  
      if (response.status === 200) {
        // Fetch the updated list of posts and update the state
        const updatedPosts = await axios.get(`${config.apiBaseUrl}/api/data/posts`);
        setPosts(updatedPosts.data.sort((a, b) => b.id - a.id));
        
        console.log('Post added and posts updated successfully');
      } else {
        console.error('Failed to add new post:', response.data);
      }
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };
  


  /*const addComment = async (postId, newComment) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = { ...post, comments: [...post.comments, newComment] };
        await axios.put(`${config.apiBaseUrl}/api/data/posts/${postId}`, updatedPost);
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }; */

  return (
    <div>
      <Header />
      <div className="h-screen flex flex-row">
        <Nav onPostCreateClick={openPostCreate} />
        <div className="h-screen flex flex-col mt-16 w-screen">
          <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-100 shadow-lg rounded-lg overflow-hidden border border-gray-300 mt-6">
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
                      onClick={() => toggleLike(post.id)}
                    >
                      {hasUserLikedPost(post.id) ? (
                        <FaHeart size={20} />
                      ) : (
                        <FaRegHeart size={20} />
                      )}
                      <span className="text-sm">Like</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-[#009368] hover:text-[#00805c] transition-transform transform hover:scale-110"
                      onClick={() => openOverlay(post)}
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm">Comment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {isPostCreateOpen && (
        <PostCreate
          onPostCreated={(newPost) => {
            addNewPost(newPost);
          }}
          onClose={closePostCreate}
        />
      )}

      {activePost && (
        <PostComment
          post={activePost}
          comments={activePost.comments}
          onClose={closeOverlay}
          likedPosts={likedPosts}
          toggleLike={toggleLike}
          newPostSent={newPost}
          fetchComments={fetchComments}  
        />
      )}
    </div>
  );
}
