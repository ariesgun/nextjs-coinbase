"use client";

import { capitalize } from "@/app/coinbase/utils";
import { useCoinbase } from "@/lib/coinbase";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import React from "react";
import * as moment from "moment";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ASSET", uid: "asset", sortable: true },
  { name: "TYPE", uid: "type", sortable: true },
  { name: "AMOUNT", uid: "amount", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "BALANCE", uid: "balance", sortable: true },
  { name: "TIMESTAMP", uid: "timestamp" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "asset",
  "type",
  "amount",
  "price",
  "balance",
  "timestamp",
];

export function OrderTable() {
  const { orders } = useCoinbase();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "balance",
    direction: "descending",
  });
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [filterValue, setFilterValue] = React.useState("");

  const hasSearchFilter = Boolean(filterValue);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [page, setPage] = React.useState(1);

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.product_id.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredOrders;
  }, [orders, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onCellAction = React.useCallback((value) => {
    // console.log(value);
    setCellSelected(value);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            size="sm"
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    orders.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const renderCell = React.useCallback((data, columnKey) => {
    // console.log("Data, ", data);
    // console.log(columnKey);
    const cellValue = data[columnKey];
    // console.log(cellValue);
    switch (columnKey) {
      case "asset":
        return (
          <div className="flex flex-row items-center gap-x-4 my-2">
            <p className="text-md">{data.product_id}</p>
          </div>
        );
      case "type":
        return (
          <div className="flex flex-row items-center gap-x-4 my-2">
            <p className="text-md">{data.side}</p>
          </div>
        );
      case "amount":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny capitalize text-default-400">
              {data.size}
            </p>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{data.price}</p>
          </div>
        );
      case "balance":
        return <p className="text-md">{data.price * data.size}</p>;
      case "timestamp":
        return (
          <p className="text-md">
            {moment(data.trade_time).format("DD-MMM-YYYY HH:mm:ss.SSS")}
          </p>
        );
      // case "actions":
      //   return (
      //     <div className="relative flex justify-end items-center gap-2">
      //       <Dropdown>
      //         <DropdownTrigger>
      //           <Button isIconOnly size="sm" variant="light">
      //             <VerticalDotsIcon className="text-default-300" />
      //           </Button>
      //         </DropdownTrigger>
      //         <DropdownMenu>
      //           <DropdownItem>View</DropdownItem>
      //           <DropdownItem onPress={onOpen}>Edit</DropdownItem>
      //           <DropdownItem>Delete</DropdownItem>
      //         </DropdownMenu>
      //       </Dropdown>
      //     </div>
      //   );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[640px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No orders found"} items={items}>
        {(item) => (
          <TableRow key={item.entry_id}>
            {(columnKey) => (
              <TableCell className="py-1">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
