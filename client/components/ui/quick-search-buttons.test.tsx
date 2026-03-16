import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickSearchButtons } from './quick-search-buttons';

describe('QuickSearchButtons', () => {
  it('renders prompts and calls onSelect with clicked prompt', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const prompts = ['Roman Empire', 'Met Gala', 'Skibidi'];

    render(<QuickSearchButtons prompts={prompts} onSelect={onSelect} />);

    expect(screen.getByRole('button', { name: 'Roman Empire' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Met Gala' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skibidi' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Met Gala' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('Met Gala');
  });
});
