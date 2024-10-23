import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React from "react";
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
  const totalPageCount: number = Math.ceil(totalCount / limit);
  const currentPage: number = Math.floor(skip / limit) + 1;

  const handlePageChange = (page: number) => {
    fetch((page - 1) * limit);
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

        {Array.from({ length: totalPageCount }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPageCount > 2 && currentPage < totalPageCount && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
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
