import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('calls onChange when user types and submits from button click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onSubmit = jest.fn();

    render(
      <SearchBar
        value="Roman Empire"
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, ' meme');

    expect(onChange).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Explain this' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('submits on Ctrl+Enter and disables submit when loading', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const { rerender } = render(
      <SearchBar value="Met Gala" onChange={() => {}} onSubmit={onSubmit} />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '{Control>}{Enter}{/Control}');
    expect(onSubmit).toHaveBeenCalledTimes(1);

    rerender(
      <SearchBar value="Met Gala" onChange={() => {}} onSubmit={onSubmit} isLoading />
    );

    expect(screen.getByRole('button', { name: 'Analyzing…' })).toBeDisabled();
  });
});
