"use client";

import { capitalize } from "@/app/coinbase/utils";
import { useCoinbase } from "@/lib/coinbase";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Checkbox } from "@nextui-org/react";
import React from "react";

const columns = [
  { name: "ASSET", uid: "asset", sortable: true },
  { name: "AMOUNT", uid: "total_balance_crypto", sortable: true },
  { name: "BALANCE", uid: "total_balance_fiat", sortable: true },
  { name: "COST", uid: "cost" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "asset",
  "total_balance_crypto",
  "total_balance_fiat",
  "cost",
];

export function PortfolioTable() {
  const { portfolios } = useCoinbase();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "asset",
    direction: "ascending",
  });
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [filterValue, setFilterValue] = React.useState("");

  const hasSearchFilter = Boolean(filterValue);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [page, setPage] = React.useState(1);

  const [showSmallBalances, setShowSmallBalances] = React.useState(false);

  const aggregatedItems = React.useMemo(() => {
    const aggregatedData = portfolios.reduce((acc, curr) => {
      // Check if the id already exists in the accumulator
      if (acc[curr.asset]) {
        // If the id exists, push the current item to the array
        // acc[curr.asset].push(curr);
        let item = acc[curr.asset];
        item.allocation += curr.allocation;
        item.total_balance_crypto += curr.total_balance_crypto;
        item.total_balance_fiat += curr.total_balance_fiat;
        item.cost_basis.value = String(
          Number(item.cost_basis.value) + Number(item.cost_basis.value),
        );
        acc[curr.asset] = item;
      } else {
        // If the id doesn't exist, create a new array with the current item
        acc[curr.asset] = curr;
      }
      return acc;
    }, {});

    return Object.values(aggregatedData);
  }, [sortDescriptor, portfolios]);

  const sortedItems = React.useMemo(() => {
    return [...aggregatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, aggregatedItems]);

  const filteredItems = React.useMemo(() => {
    let filteredPortfolios = [...sortedItems];

    if (hasSearchFilter) {
      filteredPortfolios = filteredPortfolios.filter((portfolio) =>
        portfolio.asset.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (!showSmallBalances) {
      filteredPortfolios = filteredPortfolios.filter(
        (portfolio) => portfolio.total_balance_fiat > 0.01,
      );
    }

    return filteredPortfolios;
  }, [sortedItems, showSmallBalances, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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
        <div className="flex justify-between items-center">
          <div className="w-2/3">
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
          </div>
          <div className="flex gap-5 items-center">
            <Checkbox
              size="sm"
              isSelected={showSmallBalances}
              onValueChange={setShowSmallBalances}
            >
              {"Show small balances (< $0.01)"}
            </Checkbox>
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
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {portfolios.length} assets
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    portfolios.length,
    onSearchChange,
    showSmallBalances,
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
  }, [
    selectedKeys,
    items.length,
    page,
    pages,
    showSmallBalances,
    hasSearchFilter,
  ]);

  const renderCell = React.useCallback((data, columnKey) => {
    const cellValue = data[columnKey];

    switch (columnKey) {
      case "asset":
        return (
          <div className="flex flex-row items-center gap-x-4 my-2">
            <Image width={30} alt={data.asset} src={data.asset_img_url} />
            <p className="text-sm">{data.asset}</p>
          </div>
        );
      case "total_balance_crypto":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "total_balance_fiat":
        return (
          <div className="flex gap-x-2">
            <p className="text-bold text-small capitalize">
              {(Math.round(data.total_balance_fiat * 10000) / 10000).toFixed(4)}
            </p>
            <p className="text-bold capitalize text-default-500">
              {data.cost_basis.currency}
            </p>
          </div>
        );
      case "cost":
        return (
          <div className="flex gap-x-2">
            <p className="text-bold text-small capitalize">
              {(Math.round(data.cost_basis.value * 10000) / 10000).toFixed(4)}
            </p>
            <p className="text-bold capitalize text-default-500">
              {data.cost_basis.currency}
            </p>
          </div>
        );
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
      <TableBody emptyContent={"No data found"} items={items}>
        {(item) => (
          <TableRow key={item.account_uuid}>
            {(columnKey) => (
              <TableCell className="py-2">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
