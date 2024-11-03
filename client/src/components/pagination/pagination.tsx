import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React, { useState } from "react";
function PaginationComp({
  fetch,
  limit,
  totalCount,
  skip,
}: {
  fetch: (skip: number) => void;
  totalCount: number;
  limit: number;
  skip: number;
}) {
  const totalPagesToDisplay = 5;

  const totalPageCount: number = Math.ceil(totalCount / limit);
  const currentPage: number = Math.floor(skip / limit) + 1;
  const showLeftEllipsis = currentPage - 1 > totalPagesToDisplay / 2;
  const showRightEllipsis =
    totalPageCount - currentPage + 1 > totalPagesToDisplay / 2;
  const totalPagesArray: number[] = Array.from({ length: totalPageCount });
  const getPageNumbers = () => {
    if (totalPageCount <= totalPagesToDisplay) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    } else {
      const half = Math.floor(totalPagesToDisplay / 2);
      // To ensure that the current page is always in the middle
      let start = currentPage - half;
      let end = currentPage + half;
      // If the current page is near the start
      if (start < 1) {
        start = 1;
        end = totalPagesToDisplay;
      }
      // If the current page is near the end
      if (end > totalPageCount) {
        start = totalPageCount - totalPagesToDisplay + 1;
        end = totalPageCount;
      }
      // If showLeftEllipsis is true, add an ellipsis before the start page
      if (showLeftEllipsis) {
        start++;
      }
      // If showRightEllipsis is true, add an ellipsis after the end page
      if (showRightEllipsis) {
        end--;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  };
  const handlePageChange = (page: number) => {
    fetch((page - 1) * limit);
  };
  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers();
    return pageNumbers.map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href="#"
          isActive={pageNumber === currentPage}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));
  };
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {renderPaginationItems()}
        {totalPageCount > 2 && currentPage < totalPageCount && (
          <>
            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPageCount)}>
                {totalPageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {currentPage < totalPageCount && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComp;
