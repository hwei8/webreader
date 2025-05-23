import { useEffect, useRef, useState } from 'react';
import * as epub from 'epubjs';
import './Reader.css';

interface ReaderProps {
  bookPath: string;
}

export const Reader = ({ bookPath }: ReaderProps) => {
  const [content, setContent] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rendition, setRendition] = useState<any>(null);
  const [pageInput, setPageInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const LINES_PER_PAGE = 180;

  useEffect(() => {
    const isEpub = bookPath.endsWith('.epub');
    const fullPath = `/webreader/${bookPath}`;

    if (isEpub) {
      fetch(fullPath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          const book = epub.default(arrayBuffer);
          const newRendition = book.renderTo(containerRef.current!, {
            width: '100%',
            height: '100%',
            spread: 'none'
          });
          newRendition.display();
          setRendition(newRendition);

          newRendition.on('keyup', (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === ' ') {
              newRendition.next();
            } else if (event.key === 'ArrowLeft') {
              newRendition.prev();
            }
          });
        })
        .catch(error => {
          console.error('Error loading EPUB:', error);
        });
    } else {
      fetch(fullPath)
        .then(response => response.text())
        .then(text => {
          const lines = text.split('\n').map(line => {
            return line.replace(/^\uFEFF/, '');
          });
          setContent(lines);
          setTotalPages(Math.ceil(lines.length / LINES_PER_PAGE));
        })
        .catch(error => {
          console.error('Error loading text file:', error);
        });
    }
  }, [bookPath]);

  const goToNextPage = () => {
    if (bookPath.endsWith('.epub') && rendition) {
      rendition.next();
    } else if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (bookPath.endsWith('.epub') && rendition) {
      rendition.prev();
    } else if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber - 1);
      setPageInput('');
    }
  };

  const getCurrentPageContent = () => {
    const start = currentPage * LINES_PER_PAGE;
    const end = start + LINES_PER_PAGE;
    return content.slice(start, end);
  };

  return (
    <div className="reader-container">
      {bookPath.endsWith('.epub') ? (
        <div ref={containerRef} className="epub-container" />
      ) : (
        <>
          <div className="text-content">
            {getCurrentPageContent().map((line, i) => (
              <p key={i} className="text-line">{line}</p>
            ))}
          </div>
          <div className="navigation-controls">
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="nav-button"
            >
              Previous
            </button>
            <div className="progress">
              <div className="page-info">
                Page {currentPage + 1} of {totalPages}
              </div>
              <form onSubmit={handlePageInputSubmit} className="page-input-form">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={handlePageInputChange}
                  placeholder="Go to page"
                  className="page-input"
                />
                <button type="submit" className="go-button">Go</button>
              </form>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};