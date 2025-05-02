import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';
describe('Button Component', () => {
    it('renders the button with the correct text', () => {
        render(_jsx(Button, { onClick: () => console.log('click'), children: "Click Me" }));
        const buttonElement = screen.getByText(/click me/i);
        expect(buttonElement).toBeInTheDocument();
    });
    it('calls the onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(_jsx(Button, { onClick: handleClick, children: "Click Me" }));
        const buttonElement = screen.getByText(/click me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('applies the disabled attribute correctly', () => {
        render(_jsx(Button, { onClick: () => console.log('click'), disabled: true, children: "Click Me" }));
        const buttonElement = screen.getByText(/click me/i);
        expect(buttonElement).toBeDisabled();
    });
});
