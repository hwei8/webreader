import { useEffect, useRef, useState } from 'react';
import * as epub from 'epubjs';
import './Reader.css';

interface ReaderProps {
  file: File;
}

export const Reader = ({ file }: ReaderProps) => {
  const [content, setContent] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rendition, setRendition] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const LINES_PER_PAGE = 30;

  useEffect(() => {
    if (file.type === 'application/epub+zip') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const book = epub.default(arrayBuffer);
        const newRendition = book.renderTo(containerRef.current!, {
          width: '100%',
          height: '100%',
          spread: 'none'
        });
        newRendition.display();
        setRendition(newRendition);

        // Add navigation for EPUB
        newRendition.on('keyup', (event: KeyboardEvent) => {
          if (event.key === 'ArrowRight' || event.key === ' ') {
            newRendition.next();
          } else if (event.key === 'ArrowLeft') {
            newRendition.prev();
          }
        });
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          setContent(lines);
          setTotalPages(Math.ceil(lines.length / LINES_PER_PAGE));
        } catch (error) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            setContent(lines);
            setTotalPages(Math.ceil(lines.length / LINES_PER_PAGE));
          };
          reader.readAsText(file, 'GB2312');
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file]);

  const goToNextPage = () => {
    if (file.type === 'application/epub+zip' && rendition) {
      rendition.next();
    } else if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (file.type === 'application/epub+zip' && rendition) {
      rendition.prev();
    } else if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getCurrentPageContent = () => {
    const start = currentPage * LINES_PER_PAGE;
    const end = start + LINES_PER_PAGE;
    return content.slice(start, end);
  };

  return (
    <div className="reader-container">
      {file.type === 'application/epub+zip' ? (
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
              Page {currentPage + 1} of {totalPages}
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