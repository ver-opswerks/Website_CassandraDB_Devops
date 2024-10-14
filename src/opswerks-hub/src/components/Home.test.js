import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from './Home'; // Ensure this points to your actual file location
import '@testing-library/jest-dom'; // For better assertions like "toBeInTheDocument"
import mockPosts from '../__mocks__/mockPosts'; // Assuming you have some mock data for posts

jest.mock('axios'); // Mock axios for API calls

describe('Home Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/create a new post/i)).toBeInTheDocument();
  });

  test('fetches and displays posts', async () => {
    // Mock API response for posts
    axios.get.mockResolvedValueOnce({
      data: mockPosts,
    });

    render(<Home />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
    });
  });

  test('opens and closes the PostCreate overlay', async () => {
    render(<Home />);

    // Click the "Create Post" button
    fireEvent.click(screen.getByText(/create a new post/i));

    // The PostCreate component should appear
    expect(screen.getByText(/create a new post/i)).toBeInTheDocument();

    // Click the "Cancel" button to close the overlay
    fireEvent.click(screen.getByText(/cancel/i));

    // PostCreate component should disappear
    expect(screen.queryByText(/create a new post/i)).not.toBeInTheDocument();
  });

  test('toggles like for a post', async () => {
    // Mock API response for posts
    axios.get.mockResolvedValueOnce({
      data: mockPosts,
    });

    render(<Home />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
    });

    const likeButton = screen.getAllByText(/like/i)[0];

    // Mock like toggling action
    fireEvent.click(likeButton);

    // Assert that the like button toggles state (you might need to check for visual changes or a network request)
    expect(likeButton).toHaveTextContent(/like/i);
  });

  // Add more tests to cover more functionality if needed.
});
