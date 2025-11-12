import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, TabItem } from './Tabs';

const mockTabs: TabItem[] = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div>, disabled: true },
];

describe('Tabs Component', () => {
  it('renders all tab triggers and shows first tab content by default', () => {
    render(<Tabs tabs={mockTabs} data-testid="tabs" />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();

    const content1 = screen.getByText('Content 1').closest('.mond-tabs__content');
    const content2 = screen.getByText('Content 2').closest('.mond-tabs__content');

    expect(content1).not.toHaveClass('mond-tabs__content--hidden');
    expect(content2).toHaveClass('mond-tabs__content--hidden');
  });

  it('switches content when tab is clicked', () => {
    render(<Tabs tabs={mockTabs} defaultActiveTab="tab2" />);

    const content1 = screen.getByText('Content 1').closest('.mond-tabs__content');
    const content2 = screen.getByText('Content 2').closest('.mond-tabs__content');

    expect(content1).toHaveClass('mond-tabs__content--hidden');
    expect(content2).not.toHaveClass('mond-tabs__content--hidden');

    fireEvent.click(screen.getByText('Tab 1'));

    expect(content1).not.toHaveClass('mond-tabs__content--hidden');
    expect(content2).toHaveClass('mond-tabs__content--hidden');
  });

  it('works as controlled component', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');

    rerender(<Tabs tabs={mockTabs} activeTab="tab2" onChange={handleChange} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  describe('Disabled tabs', () => {
    it('marks disabled tabs and does not switch when clicked', () => {
      render(<Tabs tabs={mockTabs} />);

      const disabledTab = screen.getByText('Tab 3').closest('button');
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(screen.getByText('Tab 3'));

      const content1 = screen.getByText('Content 1').closest('.mond-tabs__content');
      expect(content1).not.toHaveClass('mond-tabs__content--hidden');
    });
  });

  describe('Variants and sizes', () => {
    it('applies variant and size classes', () => {
      const { rerender } = render(<Tabs tabs={mockTabs} variant="line" size="sm" data-testid="tabs" />);

      let tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('mond-tabs__list--line');

      let firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveClass('mond-tabs__trigger--sm');

      rerender(<Tabs tabs={mockTabs} variant="card" size="lg" data-testid="tabs" />);

      tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('mond-tabs__list--card');

      firstTab = screen.getByText('Tab 1').closest('button');
      expect(firstTab).toHaveClass('mond-tabs__trigger--lg');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes and manages focus', () => {
      render(<Tabs tabs={mockTabs} />);

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[0]).toHaveAttribute('tabindex', '0');
      expect(tabs[1]).toHaveAttribute('tabindex', '-1');

      const activePanel = screen.getByRole('tabpanel');
      expect(activePanel).toHaveAttribute('aria-hidden', 'false');
      expect(activePanel).toHaveTextContent('Content 1');
    });
  });

  describe('Keyboard navigation', () => {
    it('supports Enter and Space keys', () => {
      render(<Tabs tabs={mockTabs} />);

      const secondTab = screen.getByText('Tab 2').closest('button');

      fireEvent.keyDown(secondTab!, { key: 'Enter' });
      expect(screen.getByText('Content 2')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Tab 1'));

      fireEvent.keyDown(secondTab!, { key: ' ' });
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  it('renders JSX content and handles empty/invalid tabs', () => {
    const tabsWithJSX: TabItem[] = [
      {
        id: 'jsx1',
        label: <span>🏠 Home</span>,
        content: <div><h2>Welcome Home</h2></div>,
      },
    ];

    const { unmount } = render(<Tabs tabs={tabsWithJSX} />);

    expect(screen.getByText('🏠 Home')).toBeInTheDocument();
    expect(screen.getByText('Welcome Home')).toBeInTheDocument();

    unmount();

    render(<Tabs tabs={[]} data-testid="tabs" />);
    const emptyTabs = screen.getByTestId('tabs');
    expect(emptyTabs).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('applies custom className and handles onChange', () => {
    const handleChange = jest.fn();
    render(<Tabs tabs={mockTabs} className="custom-class" onChange={handleChange} data-testid="tabs" />);

    const tabsElement = screen.getByTestId('tabs');
    expect(tabsElement).toHaveClass('custom-class');

    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');

    fireEvent.click(screen.getByText('Tab 3'));
    expect(handleChange).toHaveBeenCalledTimes(1); // Disabled tab should not trigger
  });
});
