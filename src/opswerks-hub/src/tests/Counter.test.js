// web/src/frontend/src/components/Counter.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

test('renders count and increments on button click', () => {
    render(<Counter />);

    // Check initial count
    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));

    // Check updated count
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
