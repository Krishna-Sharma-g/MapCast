import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SearchBar from '../src/components/SearchBar.jsx';

const SearchHarness = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <SearchBar
      query={query}
      onQueryChange={setQuery}
      onSearch={onSearch}
      suggestions={[]}
      loading={false}
      onSelect={() => {}}
    />
  );
};

describe('SearchBar debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('waits 300ms before triggering onSearch', async () => {
    const handleSearch = vi.fn();
    render(<SearchHarness onSearch={handleSearch} />);
    expect(handleSearch).toHaveBeenCalledWith('');
    handleSearch.mockClear();

    const input = screen.getByPlaceholderText(/start typing/i);
    await userEvent.type(input, 'Lon');

    expect(handleSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(handleSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(handleSearch).toHaveBeenCalledWith('Lon');
  });
});
