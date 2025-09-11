import { render, screen, fireEvent } from '../../../test-utils';
import { TagList, TagData } from './TagList';

const mockTags: TagData[] = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript', variant: 'outlined' },
  { id: '3', label: 'JavaScript', semantic: 'success', removable: true },
  { id: '4', label: 'Node.js', disabled: true },
  { id: '5', label: 'GraphQL', semantic: 'primary', icon: <span>🔥</span> },
];

describe('TagList', () => {
  it('renders all tags correctly', () => {
    render(<TagList tags={mockTags} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
  });

  it('applies default props to all tags', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'Test' }]} 
        variant="outlined"
        semantic="primary"
        size="lg"
      />
    );
    
    const tag = screen.getByText('Test').closest('.mond-tag');
    expect(tag).toHaveClass('mond-tag--outlined');
    expect(tag).toHaveClass('mond-tag--primary');
    expect(tag).toHaveClass('mond-tag--lg');
  });

  it('allows individual tag props to override defaults', () => {
    render(
      <TagList 
        tags={[
          { id: '1', label: 'Default' },
          { id: '2', label: 'Custom', variant: 'ghost', semantic: 'error' }
        ]} 
        variant="filled"
        semantic="primary"
      />
    );
    
    const defaultTag = screen.getByText('Default').closest('.mond-tag');
    const customTag = screen.getByText('Custom').closest('.mond-tag');
    
    expect(defaultTag).toHaveClass('mond-tag--filled');
    expect(defaultTag).toHaveClass('mond-tag--primary');
    
    expect(customTag).toHaveClass('mond-tag--ghost');
    expect(customTag).toHaveClass('mond-tag--error');
  });

  it('calls onRemove when removable tag is removed', () => {
    const handleRemove = jest.fn();
    render(
      <TagList 
        tags={[{ id: '1', label: 'Removable', removable: true }]} 
        onRemove={handleRemove}
      />
    );
    
    const removeButton = screen.getByLabelText('Remove tag');
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('calls onTagClick when tag is clicked', () => {
    const handleTagClick = jest.fn();
    render(
      <TagList 
        tags={[{ id: '1', label: 'Clickable' }]} 
        onTagClick={handleTagClick}
      />
    );
    
    const tag = screen.getByText('Clickable');
    fireEvent.click(tag);
    
    expect(handleTagClick).toHaveBeenCalledWith('1');
  });

  it('does not call onTagClick for disabled tags', () => {
    const handleTagClick = jest.fn();
    render(
      <TagList 
        tags={[{ id: '1', label: 'Disabled', disabled: true }]} 
        onTagClick={handleTagClick}
      />
    );
    
    const tag = screen.getByText('Disabled');
    fireEvent.click(tag);
    
    expect(handleTagClick).not.toHaveBeenCalled();
  });

  it('renders empty state when no tags', () => {
    render(
      <TagList 
        tags={[]} 
        emptyState={<span>No tags available</span>}
      />
    );
    
    expect(screen.getByText('No tags available')).toBeInTheDocument();
  });

  it('does not render empty state when tags exist', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'Tag' }]} 
        emptyState={<span>No tags available</span>}
      />
    );
    
    expect(screen.queryByText('No tags available')).not.toBeInTheDocument();
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('shows overflow indicator when maxRows is exceeded', () => {
    const manyTags: TagData[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      label: `Tag ${i}`,
    }));

    render(
      <TagList 
        tags={manyTags} 
        maxRows={1}
        showOverflow={true}
      />
    );
    
    // Should show limited tags plus overflow indicator
    expect(screen.getByText(/\+\d+ more/)).toBeInTheDocument();
  });

  it('renders with custom gap', () => {
    render(
      <TagList 
        tags={mockTags} 
        gap="lg"
        data-testid="tag-list"
      />
    );
    
    const container = screen.getByTestId('tag-list');
    expect(container).toHaveStyle('gap: 1rem');
  });

  it('renders with dark mode', () => {
    render(<TagList tags={[{ id: '1', label: 'Dark' }]}  />);
    
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('handles icons in tags', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'With Icon', icon: <span data-testid="tag-icon">🔥</span> }]} 
      />
    );
    
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'Test' }]} 
        className="custom-class"
        data-testid="tag-list"
      />
    );
    
    expect(screen.getByTestId('tag-list')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<TagList ref={ref} tags={[{ id: '1', label: 'Test' }]} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional props', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'Test' }]} 
        data-testid="tag-list"
        aria-label="Tag list"
      />
    );
    
    const container = screen.getByTestId('tag-list');
    expect(container).toHaveAttribute('aria-label', 'Tag list');
  });

  // Accessibility tests
  it('maintains accessibility for removable tags', () => {
    render(
      <TagList 
        tags={[{ id: '1', label: 'Accessible', removable: true }]} 
      />
    );
    
    const removeButton = screen.getByLabelText('Remove tag');
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveAttribute('type', 'button');
  });

  it('handles keyboard events for removable tags', () => {
    const handleRemove = jest.fn();
    render(
      <TagList 
        tags={[{ id: '1', label: 'Keyboard', removable: true }]} 
        onRemove={handleRemove}
      />
    );
    
    const removeButton = screen.getByLabelText('Remove tag');
    fireEvent.keyDown(removeButton, { key: 'Enter' });
    
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('supports different sizes', () => {
    render(
      <TagList 
        tags={[
          { id: '1', label: 'Small', size: 'sm' },
          { id: '2', label: 'Medium', size: 'md' },
          { id: '3', label: 'Large', size: 'lg' },
        ]} 
      />
    );
    
    expect(screen.getByText('Small').closest('.mond-tag')).toHaveClass('mond-tag--sm');
    expect(screen.getByText('Medium').closest('.mond-tag')).toHaveClass('mond-tag--md');
    expect(screen.getByText('Large').closest('.mond-tag')).toHaveClass('mond-tag--lg');
  });

  it('supports different semantic colors', () => {
    render(
      <TagList 
        tags={[
          { id: '1', label: 'Default', semantic: 'default' },
          { id: '2', label: 'Primary', semantic: 'primary' },
          { id: '3', label: 'Success', semantic: 'success' },
          { id: '4', label: 'Warning', semantic: 'warning' },
          { id: '5', label: 'Error', semantic: 'error' },
          { id: '6', label: 'Info', semantic: 'info' },
        ]} 
      />
    );
    
    expect(screen.getByText('Default').closest('.mond-tag')).toHaveClass('mond-tag--default');
    expect(screen.getByText('Primary').closest('.mond-tag')).toHaveClass('mond-tag--primary');
    expect(screen.getByText('Success').closest('.mond-tag')).toHaveClass('mond-tag--success');
    expect(screen.getByText('Warning').closest('.mond-tag')).toHaveClass('mond-tag--warning');
    expect(screen.getByText('Error').closest('.mond-tag')).toHaveClass('mond-tag--error');
    expect(screen.getByText('Info').closest('.mond-tag')).toHaveClass('mond-tag--info');
  });
});