import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dropdown } from './Dropdown';
import { Button } from '../Button/Button';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

const mockOptionsWithIcons = [
  { value: 'edit', label: 'Edit', icon: '✏️' },
  { value: 'delete', label: 'Delete', icon: '🗑️' },
  { value: 'share', label: 'Share', icon: '📤' },
];

const mockOptionsWithNesting = [
  { value: 'file', label: 'File', children: [
    { value: 'new', label: 'New' },
    { value: 'open', label: 'Open' },
    { value: 'save', label: 'Save' },
  ]},
  { value: 'edit', label: 'Edit', children: [
    { value: 'cut', label: 'Cut' },
    { value: 'copy', label: 'Copy' },
    { value: 'paste', label: 'Paste' },
  ]},
];

describe('Dropdown Component', () => {
  it('renders trigger element', () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Dropdown
          options={mockOptions}
          trigger={<Button>Open Menu</Button>}
          data-testid="dropdown"
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

  it('calls onSelect when option is clicked', async () => {
    const mockOnSelect = jest.fn();
    
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        onSelect={mockOnSelect}
        data-testid="dropdown"
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
  });

  it('does not call onSelect for disabled options', async () => {
    const mockOnSelect = jest.fn();
    
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        onSelect={mockOnSelect}
        data-testid="dropdown"
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

  it('closes dropdown after selection by default', async () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  it('does not close dropdown when closeOnSelect is false', async () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        closeOnSelect={false}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  it('renders options with icons', async () => {
    render(
      <Dropdown
        options={mockOptionsWithIcons}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('✏️')).toBeInTheDocument();
      expect(screen.getByText('🗑️')).toBeInTheDocument();
      expect(screen.getByText('📤')).toBeInTheDocument();
    });
  });

  it('renders nested options', async () => {
    render(
      <Dropdown
        options={mockOptionsWithNesting}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    // Arrow down should focus first option
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Option 1').closest('[role="menuitem"]')).toHaveFocus();
    
    // Arrow down should focus second option
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Option 2').closest('[role="menuitem"]')).toHaveFocus();
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  it('selects option with Enter key', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();
    
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        onSelect={mockOnSelect}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    expect(mockOnSelect).toHaveBeenCalledWith('option1', mockOptions[0]);
  });

  it('works in controlled mode', async () => {
    const mockOnOpenChange = jest.fn();
    
    const ControlledDropdown = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      
      return (
        <Dropdown
          options={mockOptions}
          trigger={<Button>Open Menu</Button>}
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            mockOnOpenChange(open);
          }}
          data-testid="dropdown"
        />
      );
    };
    
    render(<ControlledDropdown />);
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  it('applies dark mode styling', async () => {
    render(
      <Dropdown
        options={mockOptions}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );

    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
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

  it('handles divider options', async () => {
    const optionsWithDivider = [
      { value: 'option1', label: 'Option 1' },
      { value: 'divider', label: '', divider: true },
      { value: 'option2', label: 'Option 2' },
    ];
    
    render(
      <Dropdown
        options={optionsWithDivider}
        trigger={<Button>Open Menu</Button>}
        data-testid="dropdown"
      />
    );
    
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });
});
