import React, { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Column, useGlobalFilter, useSortBy, useTable } from "react-table";
import { TransactionUserResponse } from "../../lib/mutations/transactionMutations";
import { formatDateTime, getTimeStamp } from "../../lib/formatDateTime";
import { formatRupiah } from "../../lib/formatCurrency";
import { formatSlug } from "../../lib/formatString";
import BatalkanPenawaran from "./BatalkanPenawaran";

interface RiwayatTableInterface {
  data: TransactionUserResponse[];
}

const RiwayatTable = (props: RiwayatTableInterface) => {
  const isHighest = (item: TransactionUserResponse) => {
    if (item.closing_time > getTimeStamp()) return "Pending";
    else {
      if (item.is_highest) return "Selesai";
      else return "Gagal";
    }
  };

  const columns = useMemo<Column<TransactionUserResponse>[]>(
    () => [
      {
        Header: "Nama Barang",
        accessor: "name" as keyof TransactionUserResponse,
      },
      {
        Header: "Harga Pembukaan",
        accessor: "open_bid" as keyof TransactionUserResponse,
      },
      {
        Header: "Harga Tawaran",
        accessor: "bid_value" as keyof TransactionUserResponse,
      },
      {
        Header: "Waktu",
        accessor: "date" as keyof TransactionUserResponse,
      },
      { Header: "Status", accessor: "status" as keyof TransactionUserResponse },
      { Header: "Aksi", accessor: "action" as keyof TransactionUserResponse },
    ],
    []
  );

  const data = React.useMemo(() => {
    const temp = props.data.map((item: TransactionUserResponse) => {
      const { name, item_id } = item;
      return {
        ...item,
        open_bid: formatRupiah(item.open_bid),
        bid_value: formatRupiah(item.bid_value),
        date: formatDateTime(item.updated_at),
        status: isHighest(item),
        action: (
          <div className="flex flex-row gap-4">
            <Link href={`/lelang-terbuka/${formatSlug(name, item_id)}`}>
              <a className="cursor-pointer text-primary hover:text-primary-d hover:underline">
                Detail
              </a>
            </Link>
            <BatalkanPenawaran data={item} />
          </div>
        ),
      };
    });

    return temp;
  }, [props.data]);

  const initialState = { sortBy: [{ id: "date", asc: true }] };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    // @ts-ignore
    useTable({ columns, data, initialState }, useGlobalFilter, useSortBy);

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden border-2 border-gray-300 sm:rounded-xl md: rounded-2xl">
          <table {...getTableProps()} className="min-w-full ">
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      // @ts-ignore
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={i}
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                    >
                      <p className="flex flex-row">
                        {column.render("Header")}
                        <span>
                          {/* @ts-ignore */}
                          {column.isSorted ? (
                            // @ts-ignore
                            column.isSortedDesc ? (
                              <ChevronDownIcon className="w-4 h-4 ml-4" />
                            ) : (
                              <ChevronUpIcon className="w-4 h-4 ml-4" />
                            )
                          ) : (
                            <ChevronUpIcon className="invisible w-4 h-4 ml-4" />
                          )}
                        </span>
                      </p>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={i}
                    className={clsx(
                      "bg-white",
                      i === data.length - 1 ? "" : "bg-white border-b"
                    )}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={i}
                          className={clsx(
                            "px-6 py-4 text-sm",
                            i === 0
                              ? "whitespace-nowrap  font-medium text-text-d"
                              : " text-gray-500 whitespace-nowrap"
                          )}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatTable;
