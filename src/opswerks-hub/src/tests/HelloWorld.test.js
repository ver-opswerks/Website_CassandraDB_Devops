// web/src/frontend/src/components/HelloWorld.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Importing here
import HelloWorld from './HelloWorld';

describe('HelloWorld Component', () => {
    test('renders the correct greeting', () => {
        const name = 'Alice';
        render(<HelloWorld name={name} />);

        const greetingElement = screen.getByText(`Hello, ${name}!`);
        expect(greetingElement).toBeInTheDocument();
    });
});
