import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const { user } = useUser();

    const handleSearch = async () => {
        onSearch(query);

        if (!user) return;

        try {
            await fetch('http://localhost:5000/api/search-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    query,
                }),
            });
        } catch (err) {
            console.error('Error logging the search:', err);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;