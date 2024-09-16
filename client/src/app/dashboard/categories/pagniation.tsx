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
function Pageniation({
  fetch,
  limit,
  totalCount,
  skip,
}: {
  fetch: (skip: any) => any;
  totalCount: number;
  limit: number;
  skip: number;
}) {
  //  TODO: pagination limit control
  const totalPageCount: number = Math.floor(totalCount / limit);
  const skipBase = skip === 0 ? 0 : skip / limit;
  console.log({ skipBase, totalPageCount, totalCount, skip, limit });
  return (
    <>
      <Pagination>
        <PaginationContent>
          {skipBase > 0 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => fetch((skipBase - 1) * limit)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: totalPageCount === 1 ? 1 : 2 }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={skipBase  === index}
                onClick={() => fetch(index * limit)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPageCount > 2 ? (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink onClick={() => fetch(totalPageCount * limit)}>
                  {totalPageCount}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : (
            <></>
          )}
          {totalPageCount !== skipBase + 1 && (
            <PaginationItem>
              <PaginationNext onClick={() => fetch((skipBase + 1) * limit)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default Pageniation;
