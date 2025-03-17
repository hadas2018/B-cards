import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // חישוב העמודים שיוצגו בפאגינציה (מוצגים רק 5 עמודים בכל פעם)
  const getPaginationGroup = () => {
    // נקבע אמצע קבוצת העמודים להיות העמוד הנוכחי
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    
    // אם הגענו לסוף, נזיז את תחילת הקבוצה אחורה
    if (end === totalPages) {
      start = Math.max(end - 4, 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-4">
        {/* כפתור קודם */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
        </li>
        
        {/* 5 עמודים עם העמוד הנוכחי במרכז */}
        {getPaginationGroup().map((pageNumber) => (
          <li 
            key={pageNumber} 
            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
          >
            <button 
              className="page-link" 
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        
        {/* כפתור הבא */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;