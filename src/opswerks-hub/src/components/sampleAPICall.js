import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define your API base URL
const API_URL = 'http://localhost:5000/api/data';

const App = () => {
  // State to store users, liked posts, and posts
  const [users, setUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  // State to manage input fields for new user, liked post, and post
  const [newUser, setNewUser] = useState({ email: '', password: '', loggedIn: false });
  const [newLikedPost, setNewLikedPost] = useState({ postId: '', email: '' });
  const [newPost, setNewPost] = useState({ id: '', username: '', title: '', content: '' });

  // Fetch users, liked posts, and posts when the component mounts
  useEffect(() => {
    getUsers();
    getLikedPosts();
    getPosts();
  }, []);

  // Fetch users from the backend
  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch liked posts from the backend
  const getLikedPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/likedPosts`);
      setLikedPosts(response.data);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  // Fetch posts from the backend
  const getPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Post a new user to the backend
  const postUser = async () => {
    try {
      console.log('Sending user data:', newUser); // Log data being sent
      const response = await axios.post(`${API_URL}/users`, newUser);
      console.log('User posted:', response.data);
      getUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error posting user:', error);
    }
  };

  // Post a new liked post to the backend
  const postLikedPost = async () => {
    try {
      console.log('Sending liked post data:', newLikedPost); // Log data being sent
      const response = await axios.post(`${API_URL}/likedPosts`, newLikedPost);
      console.log('Liked Post posted:', response.data);
      getLikedPosts(); // Refresh the liked posts list
    } catch (error) {
      console.error('Error posting liked post:', error);
    }
  };

  // Post a new post to the backend
  const postPost = async () => {
    try {
      console.log('Sending post data:', newPost); // Log data being sent
      const response = await axios.post(`${API_URL}/posts`, newPost);
      console.log('Post posted:', response.data);
      getPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error posting post:', error);
    }
  };

  // Delete a user by email
  const deleteUser = async (email) => {
    try {
      await axios.delete(`${API_URL}/users`, { data: { email } });
      console.log(`User with email ${email} deleted`);
      getUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Delete a liked post by postId and email
const deleteLikedPost = async (postId, email) => {
  try {
    const response = await axios.delete(`${API_URL}/data/likedPosts`, { 
      data: { postId, email } 
    });

    // Check the response status
    if (response.status === 200) {
      console.log(`Liked post with ID ${postId} deleted for ${email}`);
    } else {
      console.warn(`Failed to delete liked post with ID ${postId} for ${email}`);
    }

    getLikedPosts(); // Refresh the liked posts list after deletion

  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Liked post with ID ${postId} not found for ${email}`);
    } else if (error.response && error.response.status === 500) {
      console.error('Server error while deleting liked post:', error.response.data);
    } else {
      console.error('Error deleting liked post:', error.message);
    }
  }
};


  // Delete a post by ID
  const deletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts`, { data: { id: postId } });
      console.log(`Post with ID ${postId} deleted`);
      getPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <ul className="mb-4">
        {users.map((user) => (
          <li key={user.email}>
            {user.email} ({user.loggedIn ? 'Logged In' : 'Logged Out'})
            <button
              className="bg-red-500 text-white ml-2 px-2 py-1 rounded"
              onClick={() => deleteUser(user.email)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h1 className="text-xl font-bold mb-4">Liked Posts</h1>
      <ul className="mb-4">
        {likedPosts.map((likedPost) => (
          <li key={likedPost.postId}>
            Post ID: {likedPost.postId} liked by {likedPost.email}
            <button
              className="bg-red-500 text-white ml-2 px-2 py-1 rounded"
              onClick={() => deleteLikedPost(likedPost.postId, likedPost.email)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h1 className="text-xl font-bold mb-4">Posts</h1>
      <ul className="mb-4">
        {posts.map((post) => (
          <li key={post.id}>
            Post ID: {post.id} by {post.username} - {post.title}
            <button
              className="bg-red-500 text-white ml-2 px-2 py-1 rounded"
              onClick={() => deletePost(post.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add New User Form */}
      <h2 className="text-lg font-semibold mb-2">Add New User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postUser();
        }}
      >
        <input
          className="border p-2 mb-2"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          type="checkbox"
          checked={newUser.loggedIn}
          onChange={(e) => setNewUser({ ...newUser, loggedIn: e.target.checked })}
        />
        <label>Logged In</label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add User
        </button>
      </form>

      {/* Add New Liked Post Form */}
      <h2 className="text-lg font-semibold mb-2">Add New Liked Post</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postLikedPost();
        }}
      >
        <input
          className="border p-2 mb-2"
          type="text"
          placeholder="Post ID"
          value={newLikedPost.postId}
          onChange={(e) => setNewLikedPost({ ...newLikedPost, postId: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          type="email"
          placeholder="User Email"
          value={newLikedPost.email}
          onChange={(e) => setNewLikedPost({ ...newLikedPost, email: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Liked Post
        </button>
      </form>

      {/* Add New Post Form */}
      <h2 className="text-lg font-semibold mb-2">Add New Post</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postPost();
        }}
      >
        <input
          className="border p-2 mb-2"
          type="text"
          placeholder="Post ID"
          value={newPost.id}
          onChange={(e) => setNewPost({ ...newPost, id: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          type="text"
          placeholder="Username"
          value={newPost.username}
          onChange={(e) => setNewPost({ ...newPost, username: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          className="border p-2 mb-2"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Post
        </button>
      </form>
    </div>
  );
};

export default App;
