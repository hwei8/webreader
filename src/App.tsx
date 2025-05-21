import { useState, useEffect } from 'react';
import { BookList } from './components/BookList';
import { Reader } from './components/Reader';
import './App.css';

function App() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    if (bookPath) {
      setSelectedBook(bookPath);
    }
  }, []);

  const handleBookSelect = (bookPath: string) => {
    setSelectedBook(bookPath);
    window.history.pushState({}, '', `?book=${encodeURIComponent(bookPath)}`);
  };

  return (
    <div className="app">
      {selectedBook ? (
        <div>
          <button
            onClick={() => {
              setSelectedBook(null);
              window.history.pushState({}, '', './');
            }}
            className="back-button"
          >
            Back to Library
          </button>
          <Reader bookPath={selectedBook} />
        </div>
      ) : (
        <BookList onBookSelect={handleBookSelect} />
      )}
    </div>
  );
}

export default App;