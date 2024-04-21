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
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  DotIcon,
  EditIcon,
  LockIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { CircleXIcon } from "@/app/ui/CircleXIcon";

import { Checkbox } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { createRecord, onDeleteRecord, onEditRecord } from "./action";
import { useFormState } from "react-dom";

const columns = [
  { name: "ASSET", uid: "asset", sortable: true },
  { name: "ACTION", uid: "action" },
  { name: "AMOUNT", uid: "amount" },
  { name: "TIMESTAMP", uid: "timestamp" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "asset",
  "action",
  "amount",
  "timestamp",
  "actions",
];

export function RecordTable() {
  const { records, setRecords, onRecordsFetched } = useCoinbase();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [editRecord, setEditRecord] = useState(null);
  const [editState, editRecordAction] = useFormState(onEditRecord, 0);
  const [addState, addRecordAction] = useFormState(createRecord, 0);
  const [deleteState, deleteRecordAction] = useFormState(onDeleteRecord, 0);

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
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [page, setPage] = React.useState(1);

  const sortedItems = React.useMemo(() => {
    return [...records].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, records, editState, addState, deleteState]);

  const filteredItems = React.useMemo(() => {
    let filteredPortfolios = [...sortedItems];

    if (hasSearchFilter) {
      filteredPortfolios = filteredPortfolios.filter((portfolio) =>
        portfolio.asset.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPortfolios;
  }, [sortedItems, filterValue, hasSearchFilter]);

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
    setCellSelected(value);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onCreated = () => {
    onClose();
  };

  const onAddNew = () => {
    setEditRecord(null);
    onOpenChange();
  };

  useEffect(() => {
    if (editState !== 0 || addState !== 0 || deleteState !== 0) {
      fetch("/api/records/")
        .then((res) => res.json())
        .then((data) => {
          onRecordsFetched(data.result);
        });
    }
  }, [editState, addState, deleteState]);

  const onRecordDeleted = () => {
    onClose();
  };

  const onEditRecordPress = (e) => {
    const curRecord = records.find(
      (record) => record.id === parseInt(e.target.value),
    );

    setEditRecord(curRecord);
    onOpenChange();
  };

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
            <Button
              color="primary"
              onPress={onAddNew}
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {records.length} assets
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    records.length,
    onSearchChange,
    onClear,
    rowsPerPage,
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
    page,
    pages,
    onNextPage,
    onPreviousPage,
    filteredItems.length,
  ]);

  const renderCell = (data, columnKey) => {
    const cellValue = data[columnKey];

    switch (columnKey) {
      case "asset":
        return (
          <div className="flex flex-row items-center gap-x-4 my-2">
            {/* <Image width={30} alt={data.asset} src={data.asset_img_url} /> */}
            <p className="text-sm">{data.asset}</p>
          </div>
        );
      case "timestamp":
        return (
          <div className="flex gap-x-2">
            <p className="text-bold text-small capitalize">{data.timestamp}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                type="submit"
                value={data.id}
                onPress={onEditRecordPress}
              >
                <EditIcon className="text-slate-400" />
              </Button>
            </div>
            <form action={deleteRecordAction}>
              <input hidden defaultValue={data.id} name="id" />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                type="submit"
                onPress={onRecordDeleted}
              >
                <CircleXIcon className="text-slate-400" />
              </Button>
            </form>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[640px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
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
          {(item) => {
            return (
              <TableRow key={item.account_uuid}>
                {(columnKey) => (
                  <TableCell className="py-2">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      {editRecord ? (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Update record
                </ModalHeader>
                <ModalBody className="px-0">
                  <form
                    action={editRecordAction}
                    className="flex flex-1 flex-col gap-3 px-6 py-2"
                  >
                    <Input
                      autoFocus
                      label="Asset"
                      name="asset"
                      placeholder="Enter asset name"
                      variant="bordered"
                      defaultValue={editRecord.asset}
                    />
                    <input hidden name="id" value={editRecord.id} readOnly />
                    <Input
                      label="Amount"
                      name="amount"
                      placeholder="Enter the amount"
                      variant="bordered"
                      defaultValue={editRecord.amount}
                    />
                    <Select
                      label="Type"
                      name="action"
                      placeholder="Deposit/ Withdraw"
                      variant={"bordered"}
                      defaultSelectedKeys={[editRecord.action]}
                    >
                      <SelectItem key={"DEPOSIT"} value={"DEPOSIT"}>
                        Deposit
                      </SelectItem>
                      <SelectItem key={"WITHDRAW"} value={"WITHDRAW"}>
                        Withdraw
                      </SelectItem>
                    </Select>
                    <DateInput
                      name="timestamp"
                      variant={"bordered"}
                      label={"Timestamp"}
                      defaultValue={
                        new CalendarDate(
                          new Date(editRecord.timestamp).getFullYear(),
                          new Date(editRecord.timestamp).getMonth() + 1,
                          new Date(editRecord.timestamp).getDate(),
                        )
                      }
                    />
                    <div className="flex flex-row gap-2 px-0 py-4 justify-end">
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" onPress={onCreated}>
                        Update
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add record
                </ModalHeader>
                <ModalBody className="px-0">
                  <form
                    action={addRecordAction}
                    className="flex flex-1 flex-col gap-3 px-6 py-2"
                  >
                    <Input
                      autoFocus
                      //   endContent={
                      //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      //   }
                      label="Asset"
                      name="asset"
                      placeholder="Enter asset name"
                      variant="bordered"
                    />
                    <Input
                      //   endContent={
                      //     <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      //   }
                      label="Amount"
                      name="amount"
                      placeholder="Enter the amount"
                      variant="bordered"
                    />
                    <Select
                      label="Type"
                      name="action"
                      placeholder="Deposit/ Withdraw"
                      variant={"bordered"}
                    >
                      <SelectItem key={"deposit"} value={"DEPOSIT"}>
                        Deposit
                      </SelectItem>
                      <SelectItem key={"withdraw"} value={"WITHDRAW"}>
                        Withdraw
                      </SelectItem>
                    </Select>
                    <DateInput
                      name="timestamp"
                      variant={"bordered"}
                      label={"Timestamp"}
                      defaultValue={
                        new CalendarDate(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          new Date().getDate(),
                        )
                      }
                      placeholderValue={new CalendarDate(1995, 11, 6)}
                    />
                    {/* <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div> */}
                    <div className="flex flex-row gap-2 px-0 py-4 justify-end">
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" onPress={onCreated}>
                        Create
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
