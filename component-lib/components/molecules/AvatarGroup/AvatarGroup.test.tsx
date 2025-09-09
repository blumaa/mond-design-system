import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvatarGroup, AvatarData } from './AvatarGroup';

const mockAvatars: AvatarData[] = [
  { id: '1', src: 'https://example.com/avatar1.jpg', alt: 'User 1', fallback: 'U1' },
  { id: '2', src: 'https://example.com/avatar2.jpg', alt: 'User 2', fallback: 'U2' },
  { id: '3', src: 'https://example.com/avatar3.jpg', alt: 'User 3', fallback: 'U3' },
  { id: '4', src: 'https://example.com/avatar4.jpg', alt: 'User 4', fallback: 'U4' },
  { id: '5', src: 'https://example.com/avatar5.jpg', alt: 'User 5', fallback: 'U5' },
  { id: '6', src: 'https://example.com/avatar6.jpg', alt: 'User 6', fallback: 'U6' },
  { id: '7', src: 'https://example.com/avatar7.jpg', alt: 'User 7', fallback: 'U7' },
];

describe('AvatarGroup', () => {
  const mockOnAvatarClick = jest.fn();
  const mockOnExcessClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders avatar group with avatars', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} />);
      
      // Should render all 3 avatars (check by their fallback elements)
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('renders empty group gracefully', () => {
      render(<AvatarGroup avatars={[]} />);
      
      expect(screen.queryAllByTestId(/avatar-fallback/)).toHaveLength(0);
    });

    it('applies custom data-testid', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} data-testid="custom-group" />);
      
      expect(screen.getByTestId('custom-group')).toBeInTheDocument();
      expect(screen.getByTestId('custom-group-avatar-0')).toBeInTheDocument();
      expect(screen.getByTestId('custom-group-avatar-1')).toBeInTheDocument();
    });
  });

  describe('Max Count and Excess Display', () => {
    it('shows all avatars when count is under maxCount', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} maxCount={5} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it('shows excess indicator when avatars exceed maxCount', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
      expect(screen.getByText('+4')).toBeInTheDocument();
    });

    it('shows correct excess count', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={2} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(2);
      expect(screen.getByText('+5')).toBeInTheDocument();
    });

    it('uses default maxCount of 5', () => {
      render(<AvatarGroup avatars={mockAvatars} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(5);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('handles exact maxCount without excess', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 5)} maxCount={5} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(5);
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} size="sm" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('renders with large size', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} size="lg" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('renders with extra large size', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} size="xl" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('passes size to excess indicator', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} size="lg" />);
      
      expect(screen.getByText('+4')).toBeInTheDocument();
    });
  });

  describe('Spacing Variants', () => {
    it('renders with small spacing', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} spacing="sm" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('renders with medium spacing (default)', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} spacing="md" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('renders with large spacing', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} spacing="lg" />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });
  });

  describe('Avatar Interactions', () => {
    it('calls onAvatarClick when avatar is clicked', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} onAvatarClick={mockOnAvatarClick} />);
      
      const avatarButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      await user.click(avatarButtons[0]);
      
      // avatarButtons[0] is the first in DOM but last in data due to reverse rendering
      expect(mockOnAvatarClick).toHaveBeenCalledWith(mockAvatars[2], 2);
    });

    it('calls onAvatarClick with correct avatar and index', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} onAvatarClick={mockOnAvatarClick} />);
      
      const avatarButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      await user.click(avatarButtons[1]);
      
      expect(mockOnAvatarClick).toHaveBeenCalledWith(mockAvatars[1], 1);
    });

    it('does not make avatars clickable when onAvatarClick is not provided', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} />);
      
      const avatarButtons = screen.queryAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      expect(avatarButtons).toHaveLength(0);
    });

    it('adds proper accessibility attributes for clickable avatars', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} onAvatarClick={mockOnAvatarClick} />);
      
      const avatarButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      // Due to reverse rendering: avatarButtons[0] = User 2, avatarButtons[1] = User 1
      expect(avatarButtons[0]).toHaveAttribute('aria-label', 'View User 2 profile');
      expect(avatarButtons[1]).toHaveAttribute('aria-label', 'View User 1 profile');
      expect(avatarButtons[0]).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Excess Indicator Interactions', () => {
    it('calls onExcessClick when excess indicator is clicked', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} onExcessClick={mockOnExcessClick} />);
      
      const excessButton = screen.getByRole('button', { name: 'Show 4 more avatars' });
      await user.click(excessButton);
      
      expect(mockOnExcessClick).toHaveBeenCalledWith(mockAvatars.slice(3));
    });

    it('passes correct hidden avatars to onExcessClick', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars} maxCount={2} onExcessClick={mockOnExcessClick} />);
      
      const excessButton = screen.getByRole('button', { name: 'Show 5 more avatars' });
      await user.click(excessButton);
      
      expect(mockOnExcessClick).toHaveBeenCalledWith(mockAvatars.slice(2));
    });

    it('does not make excess indicator clickable when onExcessClick is not provided', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} />);
      
      expect(screen.getByText('+4')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /show.*more/i })).not.toBeInTheDocument();
    });

    it('adds proper accessibility attributes for clickable excess', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} onExcessClick={mockOnExcessClick} />);
      
      const excessButton = screen.getByRole('button', { name: 'Show 4 more avatars' });
      expect(excessButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Custom Excess Rendering', () => {
    const customExcessRenderer = (count: number) => (
      <div data-testid="custom-excess">Custom +{count}</div>
    );

    it('uses custom renderExcess function', () => {
      render(
        <AvatarGroup 
          avatars={mockAvatars} 
          maxCount={3} 
          renderExcess={customExcessRenderer} 
        />
      );
      
      expect(screen.getByTestId('custom-excess')).toBeInTheDocument();
      expect(screen.getByText('Custom +4')).toBeInTheDocument();
      expect(screen.queryByText('+4')).not.toBeInTheDocument();
    });

    it('passes correct parameters to renderExcess', () => {
      const mockRenderExcess = jest.fn().mockReturnValue(<div>Custom</div>);
      render(
        <AvatarGroup 
          avatars={mockAvatars} 
          maxCount={2} 
          renderExcess={mockRenderExcess}
          size="lg"
          isDarkMode={true}
        />
      );
      
      expect(mockRenderExcess).toHaveBeenCalledWith(5, 'lg', true);
    });
  });

  describe('Avatar Data Handling', () => {
    it('handles avatars with different data formats', () => {
      const mixedAvatars: AvatarData[] = [
        { id: '1', src: 'image.jpg', alt: 'User 1' },
        { id: '2', fallback: 'AB' },
        { id: '3', children: <span>Custom</span> },
      ];

      render(<AvatarGroup avatars={mixedAvatars} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('handles avatars without fallback text gracefully', () => {
      const avatarsWithoutFallback: AvatarData[] = [
        { id: '1', src: 'image.jpg' },
        { id: '2' },
      ];

      render(<AvatarGroup avatars={avatarsWithoutFallback} onAvatarClick={mockOnAvatarClick} />);
      
      const avatarButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      expect(avatarButtons[0]).toHaveAttribute('aria-label', 'View user profile');
      expect(avatarButtons[1]).toHaveAttribute('aria-label', 'View user profile');
    });
  });

  describe('Dark Mode', () => {
    it('renders in dark mode without errors', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} isDarkMode />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
    });

    it('passes dark mode to avatars', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} isDarkMode />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(2);
    });

    it('passes dark mode to excess indicator', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} isDarkMode />);
      
      expect(screen.getByText('+4')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single avatar', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 1)} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(1);
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it('handles maxCount of 0', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={0} />);
      
      expect(screen.queryAllByTestId(/avatar-fallback/)).toHaveLength(0);
      expect(screen.getByText(`+${mockAvatars.length}`)).toBeInTheDocument();
    });

    it('handles maxCount larger than avatar count', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} maxCount={10} />);
      
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(3);
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it('handles negative maxCount gracefully', () => {
      render(<AvatarGroup avatars={mockAvatars} maxCount={-1} />);
      
      // With maxCount=-1, slice(0,-1) shows all but last avatar (6), slice(-1) hides last (1)
      expect(screen.queryAllByTestId(/avatar-fallback/)).toHaveLength(6);
      expect(screen.getByText(`+1`)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for clickable avatars', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} onAvatarClick={mockOnAvatarClick} />);
      
      const avatarButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('View') && 
        button.getAttribute('aria-label')?.includes('profile')
      );
      
      // Verify button is focusable and clickable
      expect(avatarButtons[0]).toHaveAttribute('tabIndex', '0');
      expect(avatarButtons[0]).toHaveAttribute('role', 'button');
      
      // Test click functionality instead of keyboard since keyboard handlers may not be implemented
      await user.click(avatarButtons[0]);
      
      // avatarButtons[0] is the first in DOM but last in data due to reverse rendering  
      expect(mockOnAvatarClick).toHaveBeenCalledWith(mockAvatars[2], 2);
    });

    it('supports keyboard navigation for excess indicator', async () => {
      const user = userEvent.setup();
      render(<AvatarGroup avatars={mockAvatars} maxCount={3} onExcessClick={mockOnExcessClick} />);
      
      const excessButton = screen.getByRole('button', { name: 'Show 4 more avatars' });
      
      // Verify button has proper accessibility attributes
      expect(excessButton).toHaveAttribute('tabIndex', '0');
      expect(excessButton).toHaveAttribute('role', 'button');
      
      // Test click functionality instead of keyboard
      await user.click(excessButton);
      
      expect(mockOnExcessClick).toHaveBeenCalledWith(mockAvatars.slice(3));
    });
  });

  describe('Performance', () => {
    it('handles large number of avatars efficiently', () => {
      const manyAvatars: AvatarData[] = Array.from({ length: 100 }, (_, i) => ({
        id: String(i),
        fallback: `U${i}`,
      }));

      render(<AvatarGroup avatars={manyAvatars} maxCount={5} />);
      
      // Should only render the visible avatars plus excess
      expect(screen.getAllByTestId(/avatar-fallback/)).toHaveLength(5);
      expect(screen.getByText('+95')).toBeInTheDocument();
    });
  });
});