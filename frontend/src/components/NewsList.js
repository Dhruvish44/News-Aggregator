import React from 'react';
import { useUser } from '../contexts/UserContext';

const NewsList = ({ articles }) => {
    const { user } = useUser();

    const handleBookmark = async (article) => {
        if (!user) {
            alert('Please login to bookmark articles.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/news/bookmark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': user.id
                },
                body: JSON.stringify(article)
            });

            const data = await response.json();

            if (data.success) {
                alert('Article bookmarked successfully!');
            } else {
                alert(data.error || 'Article is already bookmarked.');
            }
        } catch (err) {
            console.error('Error bookmarking the article:', err);
        }
    };

    return (
        <div className="news-list">
            {articles.map((article, index) => (
                <div key={index} className="news-item">
                    <img src={article.urlToImage} alt={article.title} className="news-image" />
                    <div className="news-content">
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        <button className="action-btn" onClick={() => handleBookmark(article)}>Bookmark</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsList;
