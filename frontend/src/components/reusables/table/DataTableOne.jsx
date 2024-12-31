import React, { useState, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import {
  SearchIcon,
  DownloadIcon,
  LayoutGridIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  PlusIcon,
  RefreshCcw,
} from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
//import css
import "../../../styles/common.css";

const DataTableOne = ({
  data,
  columns,
  onRefresh,
  onAddNew,
  addNewText,
  onTitle,
  renderRowActions,
  loading, 
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    enableGlobalFilter: true,
    enableSorting: true,
  });

  const exportToCSV = () => {
    const visibleColumns = columns.filter(
      (col) =>
        col.export !== "no" &&
        table.getState().columnVisibility[col.accessorKey] !== false
    );

    const csvData = table.getFilteredRowModel().rows.map((row) => {
      const rowData = {};
      visibleColumns.forEach((col) => {
        let value = row.getValue(col.accessorKey);
        if (typeof value === "boolean") {
          value = value ? "Yes" : "No";
        } else if (typeof value === "number") {
          value = value.toString();
        }
        rowData[col.header] = value;
      });
      return rowData;
    });

    const headers = visibleColumns.map((col) => col.header);
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const visibleColumns = columns.filter(
      (col) =>
        col.export !== "no" &&
        table.getState().columnVisibility[col.accessorKey] !== false
    );

    const tableData = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        let value = row.getValue(col.accessorKey);
        if (typeof value === "boolean") {
          return value ? "Yes" : "No";
        }
        return value?.toString() || "";
      })
    );

    const headers = visibleColumns.map((col) => col.header);

    doc.text(onTitle, 14, 15);
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 20 },
    });

    doc.save("export.pdf");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full flex flex-col h-full">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-t-2xl flex-none border-b border-white/10 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold text-white dark:text-white/90">
            {onTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNew}
              className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 px-4 py-2 text-white rounded-lg focus:outline-none transition-colors flex items-center gap-2 border border-white/10 dark:border-gray-600/50 hover:border-white/20 dark:hover:border-gray-500/50"
            >
              <PlusIcon size={20} />
              {addNewText}
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-white/20 dark:border-gray-600 bg-white/10 dark:bg-gray-800 text-white dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-white/70 dark:placeholder-gray-400"
              />
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 dark:text-gray-500"
                size={20}
              />
            </div>

            <button
              onClick={onRefresh}
              className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 p-2 rounded-lg focus:outline-none transition-colors border border-white/10 dark:border-gray-600/50 hover:border-white/20 dark:hover:border-gray-500/50"
            >
              <RefreshCcw className="text-white dark:text-white/90" size={20} />
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 p-2 rounded-lg focus:outline-none transition-colors border border-white/10 dark:border-gray-600/50 hover:border-white/20 dark:hover:border-gray-500/50">
                <DownloadIcon
                  className="text-white dark:text-white/90"
                  size={20}
                />
              </Menu.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={exportToCSV}
                          className={`${
                            active
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300"
                          } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                        >
                          <FileTextIcon className="mr-3 h-4 w-4" />
                          Export to CSV
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={exportToPDF}
                          className={`${
                            active
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300"
                          } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                        >
                          <FileTextIcon className="mr-3 h-4 w-4" />
                          Export to PDF
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <Menu as="div" className="relative">
              <Menu.Button className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 p-2 rounded-lg focus:outline-none transition-colors border border-white/10 dark:border-gray-600/50 hover:border-white/20 dark:hover:border-gray-500/50">
                <LayoutGridIcon
                  className="text-white dark:text-white/90"
                  size={20}
                />
              </Menu.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none border border-gray-100 dark:border-gray-700 z-50">
                  {table.getAllLeafColumns().map((column) => (
                    <Menu.Item key={column.id} as="div">
                      {({ active }) => (
                        <label
                          className={`${
                            active
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
                              : ""
                          } flex items-center px-4 py-3 cursor-pointer`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={column.getIsVisible()}
                            onChange={column.getToggleVisibilityHandler()}
                            className="mr-3 rounded text-blue-500 dark:bg-gray-600 focus:ring-blue-400 border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {column.columnDef.header}
                          </span>
                        </label>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex-1">
        <div className="flex-1 overflow-x-auto custom-scrollbar2">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:pl-4 last:pr-4"
                        style={{
                          minWidth: header.column.columnDef.minWidth || "auto",
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <FaSortUp className="ml-2" />,
                              desc: <FaSortDown className="ml-2" />,
                            }[header.column.getIsSorted()] ??
                              (header.column.getCanSort() ? (
                                <FaSort className="ml-2" />
                              ) : null)}
                          </div>
                        )}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading
                  ? // Loading skeleton
                    [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="animate-pulse">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                          </div>
                        </td>
                      </tr>
                    ))
                  : table.getRowModel().rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 first:pl-4 last:pr-4"
                            style={{
                              minWidth:
                                cell.column.columnDef.minWidth || "auto",
                            }}
                          >
                            <div className="flex items-center">
                              {cell.column.columnDef.cell ? (
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              ) : (
                                <span className="truncate">
                                  {cell.getValue()}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          {renderRowActions(
                            row.original,
                            index,
                            table.getRowModel().rows.length
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex-none justify-between items-center gap-4 mt-6 px-8 pb-6">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            entries
          </span>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTableOne;
