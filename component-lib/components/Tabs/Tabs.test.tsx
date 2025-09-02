import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, TabItem } from './Tabs';

const mockTabs: TabItem[] = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div>Content 1</div>,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div>Content 2</div>,
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <div>Content 3</div>,
    disabled: true,
  },
];

describe('Tabs Component', () => {
  it('renders all tab triggers', () => {
    render(<Tabs tabs={mockTabs} data-testid="tabs" />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });

  it('switches content when tab is clicked', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Click on second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('respects defaultActiveTab prop', () => {
    render(<Tabs tabs={mockTabs} defaultActiveTab="tab2" />);
    
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('works as controlled component', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
    );
    
    // Initial state
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // Click second tab
    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');
    
    // Simulate parent component updating activeTab
    rerender(<Tabs tabs={mockTabs} activeTab="tab2" onChange={handleChange} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  describe('disabled tabs', () => {
    it('marks disabled tabs correctly', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const disabledTab = screen.getByText('Tab 3').closest('button');
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not switch to disabled tab when clicked', () => {
      render(<Tabs tabs={mockTabs} />);
      
      fireEvent.click(screen.getByText('Tab 3'));
      
      // Should still show first tab content
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 3')).not.toBeVisible();
    });

    it('applies disabled styling', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const disabledTab = screen.getByText('Tab 3').closest('button');
      expect(disabledTab).toHaveStyle('opacity: 0.5');
      expect(disabledTab).toHaveStyle('cursor: not-allowed');
    });
  });

  describe('variants', () => {
    it('renders line variant correctly', () => {
      render(<Tabs tabs={mockTabs} variant="line" data-testid="tabs" />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveStyle('border-bottom: 1px solid #cbd5e1');
      expect(tabList).toHaveStyle('background-color: transparent');
    });

    it('renders card variant correctly', () => {
      render(<Tabs tabs={mockTabs} variant="card" data-testid="tabs" />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveStyle('background-color: #ffffff');
      expect(tabList).toHaveStyle('border: 1px solid #cbd5e1');
      expect(tabList).toHaveStyle('border-radius: 0.25rem');
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Tabs tabs={mockTabs} size="sm" />);
      
      const firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveStyle('font-size: 0.875rem');
      expect(firstTab).toHaveStyle('min-height: 32px');
    });

    it('renders medium size correctly', () => {
      render(<Tabs tabs={mockTabs} size="md" />);
      
      const firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveStyle('font-size: 1rem');
      expect(firstTab).toHaveStyle('min-height: 40px');
    });

    it('renders large size correctly', () => {
      render(<Tabs tabs={mockTabs} size="lg" />);
      
      const firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveStyle('font-size: 1.125rem');
      expect(firstTab).toHaveStyle('min-height: 48px');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      render(<Tabs tabs={mockTabs} isDarkMode data-testid="tabs" />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveStyle('border-bottom: 1px solid #475569');
    });

    it('applies light mode styling by default', () => {
      render(<Tabs tabs={mockTabs} data-testid="tabs" />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveStyle('border-bottom: 1px solid #cbd5e1');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes for tabs', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      
      // First tab should be selected
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('has correct ARIA attributes for tab panels', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const tabPanels = screen.getAllByRole('tabpanel');
      expect(tabPanels).toHaveLength(3);
      
      // Only first panel should be visible
      expect(tabPanels[0]).toHaveAttribute('aria-hidden', 'false');
      expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'true');
      expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'true');
    });

    it('manages focus correctly', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const tabs = screen.getAllByRole('tab');
      
      // First tab should be focusable
      expect(tabs[0]).toHaveAttribute('tabindex', '0');
      expect(tabs[1]).toHaveAttribute('tabindex', '-1');
      expect(tabs[2]).toHaveAttribute('tabindex', '-1');
      
      // After clicking second tab, it should become focusable
      fireEvent.click(tabs[1]);
      expect(tabs[0]).toHaveAttribute('tabindex', '-1');
      expect(tabs[1]).toHaveAttribute('tabindex', '0');
    });

    it('supports keyboard navigation', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const secondTab = screen.getByText('Tab 2').closest('button');
      
      // Test Enter key
      fireEvent.keyDown(secondTab!, { key: 'Enter' });
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      
      // Reset to first tab
      fireEvent.click(screen.getByText('Tab 1'));
      
      // Test Space key
      fireEvent.keyDown(secondTab!, { key: ' ' });
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies correct base styles', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveStyle('display: flex');
      expect(firstTab).toHaveStyle('align-items: center');
      expect(firstTab).toHaveStyle('justify-content: center');
      expect(firstTab).toHaveStyle('border: none');
      expect(firstTab).toHaveStyle('cursor: pointer');
      expect(firstTab).toHaveStyle('user-select: none');
      expect(firstTab).toHaveStyle('white-space: nowrap');
    });

    it('applies active styling', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const activeTab = screen.getByText('Tab 1').closest('button');
      const inactiveTab = screen.getByText('Tab 2').closest('button');
      
      expect(activeTab).toHaveStyle('font-weight: 600'); // semibold
      expect(inactiveTab).toHaveStyle('font-weight: 400'); // normal
    });

    it('applies font family', () => {
      render(<Tabs tabs={mockTabs} />);
      
      const firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveStyle("font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
    });
  });

  describe('content rendering', () => {
    it('renders JSX content correctly', () => {
      const tabsWithJSX: TabItem[] = [
        {
          id: 'jsx1',
          label: <span>🏠 Home</span>,
          content: <div><h2>Welcome Home</h2><p>This is the home content.</p></div>,
        },
        {
          id: 'jsx2',
          label: <span>📊 Dashboard</span>,
          content: <div><h2>Dashboard</h2><p>Your dashboard content here.</p></div>,
        },
      ];
      
      render(<Tabs tabs={tabsWithJSX} />);
      
      expect(screen.getByText('🏠 Home')).toBeInTheDocument();
      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome Home')).toBeInTheDocument();
      expect(screen.getByText('This is the home content.')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<Tabs tabs={mockTabs} className="custom-class" data-testid="tabs" />);
    const tabsElement = screen.getByTestId('tabs');
    expect(tabsElement).toHaveClass('custom-class');
  });

  describe('edge cases', () => {
    it('handles empty tabs array', () => {
      render(<Tabs tabs={[]} data-testid="tabs" />);
      const tabsElement = screen.getByTestId('tabs');
      expect(tabsElement).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles invalid defaultActiveTab', () => {
      render(<Tabs tabs={mockTabs} defaultActiveTab="invalid-id" />);
      // Should still show first tab content as fallback
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('calls onChange when tab is clicked', () => {
      const handleChange = jest.fn();
      render(<Tabs tabs={mockTabs} onChange={handleChange} />);
      
      fireEvent.click(screen.getByText('Tab 2'));
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('does not call onChange for disabled tabs', () => {
      const handleChange = jest.fn();
      render(<Tabs tabs={mockTabs} onChange={handleChange} />);
      
      fireEvent.click(screen.getByText('Tab 3'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});