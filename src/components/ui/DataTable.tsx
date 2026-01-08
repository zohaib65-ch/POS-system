"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}
interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  itemsPerPage?: number;
}

export default function DataTable<T>({ columns, data, emptyMessage = "No data found", pagination, itemsPerPage = 10 }: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const { currentPage, totalPages, pageData, totalItems } = useMemo(() => {
    if (pagination) {
      return {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        pageData: data,
        totalItems: pagination.totalItems,
      };
    }
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    const page = Math.min(Math.max(1, internalPage), pages);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slice = data.slice(start, end);

    return {
      currentPage: page,
      totalPages: pages,
      pageData: slice,
      totalItems: total,
    };
  }, [data, pagination, internalPage, itemsPerPage]);

  const onPageChange = (page: number) => {
    if (pagination) {
      pagination.onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };
  const renderPageNumbers = () => {
    const delta = 2;
    const pages: (number | string)[] = [];

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) pages.push(1, "...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) pages.push("...", totalPages);

    return pages.map((p, idx) =>
      typeof p === "string" ? (
        <span key={idx} className="px-2 text-gray-500">
          {p}
        </span>
      ) : (
        <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(p)} className="min-w-[2.5rem]">
          {p}
        </Button>
      )
    );
  };

  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key as string}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageData.length > 0 ? (
            pageData.map((row, index) => (
              <TableRow key={(row as any).id ?? index}>
                {columns.map((col) => {
                  const value = (row as any)[col.key];
                  return <TableCell key={col.key as string}>{col.render ? col.render(value, row) : value ?? "-"}</TableCell>;
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 px-2 sm:flex-row sm:justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            {renderPageNumbers()}
            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600 sm:hidden">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
