import React, { useState, useRef, useEffect } from "react";
import "./AdminTable.scss";

// Types
export interface Column<T> {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowKey: (item: T) => string | number;
}

export function AdminTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  onRowClick,
  rowKey,
}: AdminTableProps<T>) {
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    () => {
      const initial: { [key: string]: number } = {};
      columns.forEach((col) => {
        initial[col.key] = col.width || 150;
      });
      return initial;
    }
  );

  const [resizing, setResizing] = useState<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    setResizing(columnKey);
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnKey];
  };

  useEffect(() => {
    if (!resizing) {
      document.body.classList.remove("resizing-column");
      return;
    }

    document.body.classList.add("resizing-column");

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      const newWidth = startWidth.current + diff;

      const column = columns.find((col) => col.key === resizing);
      const minWidth = column?.minWidth || 80;
      const maxWidth = column?.maxWidth || 600;

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      setColumnWidths((prev) => ({
        ...prev,
        [resizing]: clampedWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.body.classList.remove("resizing-column");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("resizing-column");
    };
  }, [resizing, columns]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="bg-blue-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left font-semibold text-blue-700 relative select-none"
                  style={{
                    width: columnWidths[column.key],
                    minWidth: columnWidths[column.key],
                    maxWidth: columnWidths[column.key],
                  }}
                >
                  <div className="flex items-center justify-between pr-2">
                    <span>{column.header}</span>
                    {/* ✅ Resize handle - rộng hơn để dễ kéo */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 transition-colors z-10"
                      onMouseDown={(e) => handleMouseDown(e, column.key)}
                      title="Kéo để thay đổi kích thước cột"
                    >
                      {/* Vạch hiển thị khi hover */}
                      <div className="absolute right-0.5 top-1/4 bottom-1/4 w-0.5 bg-blue-400 opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((item) => (
              <tr
                key={rowKey(item)}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3"
                    style={{
                      width: columnWidths[column.key],
                      minWidth: columnWidths[column.key],
                      maxWidth: columnWidths[column.key],
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
