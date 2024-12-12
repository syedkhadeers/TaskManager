import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import {
  FaSearch,
  FaChevronDown,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";
import { getUsers } from "../../services/userService";

// Avatar Component
const Avatar = ({ src, alt = "avatar" }) => (
  <img src={src} alt={alt} className="w-8 h-8 rounded-full object-cover" />
);

// InputGroup Component
const InputGroup = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  decoration,
  className = "",
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) => (
  <div
    className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-sm ${className}`}
  >
    <input
      id={name}
      name={name}
      value={value}
      type={type}
      placeholder={label}
      aria-label={label}
      onChange={onChange}
      className={`peer block w-full p-3 text-gray-600 focus:outline-none ${
        disabled ? "bg-gray-200" : ""
      } ${inputClassName}`}
      disabled={disabled}
    />
    <div
      className={`flex items-center pl-3 py-3 text-gray-600 ${
        disabled ? "bg-gray-200" : ""
      } ${decorationClassName}`}
    >
      {decoration}
    </div>
  </div>
);

// GlobalSearchFilter Component
const GlobalSearchFilter = ({
  globalFilter,
  setGlobalFilter,
  className = "",
}) => (
  <InputGroup
    name="search"
    value={globalFilter || ""}
    onChange={(e) => setGlobalFilter(e.target.value)}
    label="Search"
    decoration={<FaSearch size="1rem" className="text-gray-400" />}
    className={className}
  />
);

// SelectMenu Component
const SelectMenu = ({ value, setValue, options, className = "", disabled }) => {
  const selectedOption = useMemo(
    () => options.find((o) => o.id === value),
    [options, value]
  );

  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <div className={`relative w-full ${className}`}>
        <Listbox.Button
          className={`relative w-full rounded-xl py-3 pl-3 pr-10 text-base text-gray-700 shadow-sm ${
            disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
          }`}
        >
          <span className="block truncate">{selectedOption.caption}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown size="0.80rem" className="text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white shadow-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active }) =>
                  `cursor-default select-none py-3 pl-10 pr-4 ${
                    active ? "bg-red-100" : ""
                  }`
                }
                value={option.id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {" "}
                      {option.caption}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                        <FaCheck size="0.5rem" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

// PaginationNav Component
const PaginationNav = ({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
}) => {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;

    const visiblePageButtonCount = 3;
    let numberOfButtons = Math.min(pageCount, visiblePageButtonCount);
    const pageIndices = [pageIndex];
    numberOfButtons--;

    Array.from({ length: numberOfButtons }).forEach((_item, index) => {
      const pageBefore = pageIndices[0] - 1;
      const pageAfter = pageIndices[pageIndices.length - 1] + 1;

      if (
        pageBefore >= 0 &&
        (index < numberOfButtons / 2 || pageAfter > pageCount - 1)
      ) {
        pageIndices.unshift(pageBefore);
      } else {
        pageIndices.push(pageAfter);
      }
    });

    return pageIndices.map((page) => (
      <li key={page}>
        <button
          onClick={() => gotoPage(page)}
          className={`px-3 py-2 rounded-lg ${
            pageIndex === page ? "bg-red-200" : "bg-white"
          }`}
        >
          {page + 1}
        </button>
      </li>
    ));
  }, [pageCount, pageIndex, gotoPage]);

  return (
    <ul className="flex gap-2">
      <li>
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="p-2 disabled:bg-gray-300"
        >
          <FaChevronLeft />
        </button>
      </li>
      {renderPageLinks()}
      <li>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="p-2 disabled:bg-gray-300"
        >
          <FaChevronRight />
        </button>
      </li>
    </ul>
  );
};

// TableComponent
const TableComponent = ({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
}) => (
  <div className="w-full min-w-[30rem] p-4 bg-white rounded-xl shadow-sm">
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, headerGroupIndex) => (
          <tr
            key={`header-group-${headerGroupIndex}`}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <th
                key={`header-${column.id}`}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="px-3 text-start text-xs font-light uppercase cursor-pointer"
                style={{ width: column.width }}
              >
                <div className="flex gap-2 items-center">
                  <span className="text-gray-600">
                    {column.render("Header")}
                  </span>
                  <div className="flex flex-col">
                    <FaSortUp
                      className={`text-sm translate-y-1/2 ${
                        column.isSorted && !column.isSortedDesc
                          ? "text-red-400"
                          : "text-gray-300"
                      }`}
                    />
                    <FaSortDown
                      className={`text-sm -translate-y-1/2 ${
                        column.isSortedDesc ? "text-red-400" : "text-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr key={`row-${rowIndex}`} {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  key={`cell-${cell.column.id}-${cell.row.index}`}
                  {...cell.getCellProps()}
                  className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg"
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Main Table Component
const Table = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: "300px",
        Cell: ({ row, value }) => (
          <div className="flex gap-2 items-center">
            <Avatar src={row.original.photo?.url} alt={`${value}'s Avatar`} />
            <span>{value}</span>
          </div>
        ),
      },
      { Header: "Email", accessor: "email" },
      { Header: "Role", accessor: "role" },
      {
        Header: "Verified",
        accessor: "isVerified",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getUsers();
      const users = Array.isArray(response)
        ? response
        : Array.isArray(response.users)
        ? response.users
        : [];
      setData(users);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page: rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <GlobalSearchFilter
          className="sm:w-64"
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <SelectMenu
          className="sm:w-44"
          value={pageSize}
          setValue={setPageSize}
          options={[
            { id: 5, caption: "5 items per page" },
            { id: 10, caption: "10 items per page" },
            { id: 20, caption: "20 items per page" },
          ]}
        />
      </div>
      {data.length > 0 ? (
        <TableComponent
          getTableProps={getTableProps}
          headerGroups={headerGroups}
          getTableBodyProps={getTableBodyProps}
          rows={rows}
          prepareRow={prepareRow}
        />
      ) : (
        <div>No users found</div>
      )}
      <div className="flex justify-center">
        <PaginationNav
          gotoPage={gotoPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
        />
      </div>
    </div>
  );
};

// Main UsersContent Component
const UsersContent = () => (
  <div className="flex flex-col overflow-auto py-4 sm:py-0">
    <Table />
  </div>
);

export default UsersContent;
