import { render, screen, fireEvent } from '../../test-utils';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../src/themes';
import { Tag } from './Tag';

const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Tag', () => {
  it('renders with default props', () => {
    renderWithTheme(<Tag>Default Tag</Tag>);

    const tag = screen.getByText('Default Tag');
    expect(tag).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = renderWithTheme(<Tag variant="filled">Filled</Tag>);
    expect(screen.getByText('Filled')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Tag variant="outlined">Outlined</Tag>
      </ThemeProvider>
    );
    expect(screen.getByText('Outlined')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Tag variant="ghost">Ghost</Tag>
      </ThemeProvider>
    );
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('renders with different semantic variants', () => {
    const { rerender } = renderWithTheme(<Tag semantic="primary">Primary</Tag>);
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Tag semantic="success">Success</Tag>
      </ThemeProvider>
    );
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Tag semantic="error">Error</Tag>
      </ThemeProvider>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<Tag size="sm">Small</Tag>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Tag size="lg">Large</Tag>
      </ThemeProvider>
    );
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const TestIcon = <svg data-testid="test-icon"><path /></svg>;
    renderWithTheme(<Tag icon={TestIcon}>With Icon</Tag>);

    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders removable tag with remove button', () => {
    const onRemove = jest.fn();
    renderWithTheme(<Tag removable onRemove={onRemove}>Removable</Tag>);

    expect(screen.getByText('Removable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove tag' })).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    renderWithTheme(<Tag removable onRemove={onRemove}>Remove me</Tag>);

    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    renderWithTheme(<Tag disabled>Disabled</Tag>);

    const tag = screen.getByText('Disabled');
    expect(tag).toBeInTheDocument();
  });

  it('disables remove functionality when disabled', () => {
    const onRemove = jest.fn();
    renderWithTheme(<Tag removable disabled onRemove={onRemove}>Disabled Removable</Tag>);

    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeDisabled();

    fireEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('forwards additional props to Box', () => {
    renderWithTheme(<Tag data-testid="custom-tag">Custom</Tag>);

    const tag = screen.getByTestId('custom-tag');
    expect(tag).toBeInTheDocument();
  });

  it('handles text overflow correctly', () => {
    renderWithTheme(<Tag>Very long tag content that should be truncated with ellipsis</Tag>);

    const textContainer = screen.getByText('Very long tag content that should be truncated with ellipsis');
    expect(textContainer).toBeInTheDocument();
  });

  it('renders without remove button when not removable', () => {
    renderWithTheme(<Tag>No remove</Tag>);

    expect(screen.getByText('No remove')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles all semantic variants in ghost mode', () => {
    const semantics = ['default', 'primary', 'success', 'warning', 'error', 'info'] as const;

    semantics.forEach(semantic => {
      const { unmount } = renderWithTheme(<Tag variant="ghost" semantic={semantic}>{semantic}</Tag>);
      expect(screen.getByText(semantic)).toBeInTheDocument();
      unmount();
    });
  });
});