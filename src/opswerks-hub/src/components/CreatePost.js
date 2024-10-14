import React, { useState } from 'react';
import axios from 'axios';
import config from './Config';

const PostCreate = ({ onPostCreated, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Retrieve users from localStorage and check if anyone is logged in
  const users = JSON.parse(localStorage.getItem('loggedInUser')) || [];
  const loggedInUser = users.email; 
  const creatorName = loggedInUser.split('@')[0]; 

  const handlePostSubmit = async () => {
    if (!title || !content) {
      alert('Please fill out both the title and content fields.');
      return;
    }

    const newPost = {
      id: Date.now(),
      username: creatorName, 
      title,
      content,
      like: 0,
      comments: [],
    };
    console.log(newPost);

    try {
      // Send the new post data to the backend API
      await axios.post(`${config.apiBaseUrl}/api/data/posts`, newPost);

      

      setTitle('');
      setContent('');

      // Call the onPostCreated callback to refresh the list of posts
      onPostCreated(newPost);

      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 shadow-lg rounded-lg overflow-hidden border border-gray-300 w-3xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="flex items-center space-x-4 bg-white p-4">
          <h2 className="text-xl font-semibold text-[#009368]">Create a New Post</h2>
        </div>

        {/* Content section */}
        <div className="p-4 bg-white">
          {/* Title input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-[#009368] focus:border-[#009368] text-green-600 font-bold text-lg focus:outline-none transition-all"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-[#009368] focus:border-[#009368] text-[#2B2B2B] focus:outline-none transition-all"
              rows="5"
            ></textarea>
          </div>
        </div>

        {/* Buttons section */}
        <div className="flex justify-between items-center bg-white p-4 border-t border-gray-300">
          
          <button
            onClick={onClose}
            className="text-[#009368] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handlePostSubmit}
            className="bg-[#009368] text-white px-4 py-2 rounded-lg hover:bg-[#00805c] transition-all"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;
