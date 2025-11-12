import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dropdown } from './Dropdown';
import { Button } from '../Button/Button';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('Dropdown Component', () => {
  it('renders trigger and opens dropdown on click', async () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();

    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Dropdown
          options={mockOptions}
          trigger={<Button>Open Menu</Button>}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  it('calls onSelect when option is clicked and closes by default', async () => {
    const mockOnSelect = jest.fn();

    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        onSelect={mockOnSelect}
      />
    );

    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(mockOnSelect).toHaveBeenCalledWith('option1', mockOptions[0]);

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  it('does not call onSelect for disabled options', async () => {
    const mockOnSelect = jest.fn();

    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        onSelect={mockOnSelect}
      />
    );

    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    const disabledOption = screen.getByText('Option 3');
    fireEvent.click(disabledOption);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation and closes on Escape', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
      />
    );

    const trigger = screen.getByText('Open Menu');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Option 1').closest('[role="menuitem"]')).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Dropdown
        ref={ref}
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('dropdown'));
  });
});
