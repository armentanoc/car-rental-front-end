import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page + 1 < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="pagination">
      <button className="pagination-button" disabled={page === 0} onClick={handlePrevious}>
        Anterior
      </button>
      <span>
        Página {page + 1} de {totalPages}
      </span>
      <button className="pagination-button" disabled={page + 1 === totalPages} onClick={handleNext}>
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
