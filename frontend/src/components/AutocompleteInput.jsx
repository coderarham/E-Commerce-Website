import React, { useState, useRef, useEffect } from 'react';

const AutocompleteInput = ({ 
  name, 
  placeholder, 
  value, 
  onChange, 
  suggestions = [], 
  className = "",
  required = false 
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
    setActiveSuggestion(-1);
  }, [value, suggestions]);

  const handleInputChange = (e) => {
    onChange(e);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { name, value: suggestion } });
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }, 200);
  };

  const handleSuggestionMouseDown = (e) => {
    // Prevent blur event when clicking on suggestion
    e.preventDefault();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => value.length >= 2 && setShowSuggestions(filteredSuggestions.length > 0)}
        className={className}
        required={required}
        autoComplete="off"
      />
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onMouseDown={handleSuggestionMouseDown}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestion ? 'bg-blue-100' : ''
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;