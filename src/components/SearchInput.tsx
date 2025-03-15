import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';


interface Props {
  onSearch: (term: string) => void;
  placeholder?: string;
  delay?: number;
}

const SearchInput: React.FC<Props> = ({ 
  onSearch, 
  placeholder = 'חיפוש...', 
  delay = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, delay),
    [onSearch, delay]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="input-group">
      <span className="input-group-text">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setSearchTerm('')}
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default SearchInput;

