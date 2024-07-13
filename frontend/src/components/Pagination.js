import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const pages = [];
        
        for (let i = currentPage; i >= 1 && pages.length < 3; i--) {
            pages.unshift(i);
        }

        for (let i = currentPage + 1; i <= totalPages && pages.length < 6; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="pagination">
            {currentPage !== 1 && (
                <button onClick={() => onPageChange(currentPage - 1)}>
                    Prev
                </button>
            )}
            {pageNumbers.map(num => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={currentPage === num ? 'active' : ''}
                >
                    {num}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
