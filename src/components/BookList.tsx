import { useState, useEffect } from 'react';
import './BookList.css';

interface Book {
  title: string;
  path: string;
  type: 'epub' | 'txt';
  cover?: string;
}

interface BookListProps {
  onBookSelect: (bookPath: string) => void;
}

export const BookList = ({ onBookSelect }: BookListProps) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const bookList: Book[] = [
        {
          title: "Sample Book 1",
          path: "./books/book1.txt", // Add ./ to the path
          type: "txt"
        },
        {
          title: "Sample Book 2",
          path: "./books/book2.epub", // Add ./ to the path
          type: "epub"
        },
        {
          title: "Sample Book 3",
          path: "./books/book3.txt", // Add ./ to the path
          type: "txt"
        }
    ];
    setBooks(bookList);
  }, []);

  return (
    <div className="book-list">
      <h1>Available Books</h1>
      <div className="book-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <div className="book-cover">
              {book.cover ? (
                <img src={book.cover} alt={book.title} />
              ) : (
                <div className="book-placeholder">
                  {book.type === 'epub' ? '📚' : '📄'}
                </div>
              )}
            </div>
            <h3>{book.title}</h3>
            <button 
              onClick={() => onBookSelect(book.path)}
              className="read-button"
            >
              Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};