import React, { useState, useEffect } from 'react';
import './styles/styles.css';
import NewsList from './components/NewsList';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import apiKey from './apiKey';
import Login from './components/Login';
import Register from './components/Register';
import { useUser } from './contexts/UserContext';

const App = () => {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState('world news');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('login');
    const [showingBookmarks, setShowingBookmarks] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    


    const { user, setUser } = useUser();

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=${currentPage}&pageSize=10`
            );
            const data = await response.json();
            setArticles(data.articles);
            setTotalPages(Math.ceil(data.totalResults / 10));
            setError(null);
        } catch (err) {
            setError(err.message);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/news/bookmarks', {
                headers: {
                    'Content-Type': 'application/json',
                    'userId': user.id
                },
            });
            const data = await response.json();
            setBookmarks(data.bookmarks || []);
            setShowingBookmarks(true);  // <-- Add this line
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
        }
    };
    

    useEffect(() => {
        if (view === 'news' && user) {
            fetchNews();
        }
    }, [query, currentPage, view, user]);

    const logout = () => {
        setUser(null);
        setView('login');
    };

    if (view === 'login') {
        return (
            <div>
                <Login 
                    onLoginSuccess={() => {
                        setView('news');
                    }} 
                    onSwitchToRegister={() => setView('register')}
                />
            </div>
        );
    }

    if (view === 'register') {
        return (
            <div>
                <Register onSwitchToLogin={() => setView('login')} />
            </div>
        );
    }
    
    if (view === 'news' && user) {
        return (
            <div className="app">
            <h1>
            <a href="#" className="title-link" onClick={(e) => {
    e.preventDefault();
    setQuery('world-news');  // or whatever default query you use
    setView('news');
}}>
    News Aggregator
</a>

            </h1>
                <div className="user-details">
                <span className="welcome">Welcome, {user.name}</span>
                    <div className="user-actions">
                        <button className="action-btn" onClick={logout}>Logout</button>
                        <button className="action-btn bookmarks-btn" onClick={() => {
    if (showingBookmarks) {
        setShowingBookmarks(false);
    } else {
        fetchBookmarks();
    }
}}>
    {showingBookmarks ? "View News" : "View Bookmarks"}
</button>


                    </div>
                </div>

                { showingBookmarks ? 
                    <NewsList articles={bookmarks} />
                    :
                    <>
                        <SearchBar onSearch={setQuery} />
                        <h2 className="world-news" style={{ fontSize: '50px' }}>World News</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <>
                                <NewsList articles={articles} />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </>
                }
            </div>
        );
    }

    return null;
};

export default App;