"use client";
import { useState, useMemo, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getAllAthletes } from "@/firebase/database";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";
import { Search, Download, Filter, Eye, MoreHorizontal, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageHeader } from "@/components/shared/PageHeader";
import { updateAthleteStatus, addStatusHistory } from "@/firebase/database";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import type { AthleteRecord, RegistrationStatus } from "@/types";

const columnHelper = createColumnHelper<AthleteRecord>();

export default function AdminAthletesPage() {
  const [data, setData] = useState<AthleteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    async function load() {
      const athletes = await getAllAthletes();
      setData(athletes);
      setLoading(false);
    }
    load();
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor("athleteId", { header: "ID", cell: info => <span className="font-mono text-xs text-slate-500">{info.getValue()}</span> }),
    columnHelper.accessor("personalDetails.fullName", { header: "Name", cell: info => <span className="font-bold text-slate-900">{info.getValue()}</span> }),
    columnHelper.accessor("personalDetails.mobile", { header: "Mobile", cell: info => <span className="text-sm font-medium">{info.getValue()}</span> }),
    columnHelper.accessor("personalDetails.age", { header: "Age", cell: info => <span className="text-sm font-medium">{info.getValue()}</span> }),
    columnHelper.accessor("sportName", { header: "Sport" }),
    columnHelper.accessor("competitionDetails.ageGroup", { header: "Age Group" }),
    columnHelper.accessor("status", { header: "Status", cell: info => <StatusBadge status={info.getValue()} /> }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const row = info.row.original;
        const { user } = useAuthStore.getState();

        const onAction = async (newStatus: RegistrationStatus) => {
          try {
            await updateAthleteStatus(row.athleteId, newStatus);
            await addStatusHistory(row.athleteId, {
              previousStatus: row.status,
              currentStatus: newStatus,
              updatedBy: user?.name || "Admin",
              timestamp: new Date().toISOString(),
              notes: `Status changed to ${newStatus} from management list.`
            });
            toast.success(`Athlete ${newStatus} successfully`);
            // Reload or update local state
            window.location.reload();
          } catch {
            toast.error("Failed to update status");
          }
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction("Approved" as RegistrationStatus)}
              title="Approve"
              className="p-2 hover:bg-emerald-50 rounded-lg transition text-slate-300 hover:text-emerald-600"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => onAction("Rejected" as RegistrationStatus)}
              title="Reject"
              className="p-2 hover:bg-rose-50 rounded-lg transition text-slate-300 hover:text-rose-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-100 mx-1" />
            <Link
              href={`/admin/athletes/${row.athleteId}`}
              title="View Details"
              className="p-2 hover:bg-blue-50 rounded-lg transition text-slate-300 hover:text-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader title="Athlete Management" subtitle="Manage, review, and export all athlete applications." />
          <div className="flex items-center gap-2">
            <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              <Download className="h-4 w-4" /> Export
            </button>
            {/* Add filter icon/modal here if needed */}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search by name, ID or sport..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="h-6 w-[1px] bg-slate-100" />
          <p className="text-xs text-slate-400 font-medium">Found {table.getFilteredRowModel().rows.length} Athletes</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-900 border-none focus:ring-0 cursor-pointer"
              >
                {[10, 20, 30].map(size => <option key={size} value={size}>Show {size}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function exportCsv() {
  try {
    // Access table via DOM because this helper is outside component scope — fallback: gather rows from window if needed
    const tableElm: any = document.querySelector('table');
    // Use data from React table previously rendered via component state isn't directly accessible here; instead recreate by reading DOM rows
    const rows: string[] = [];
    const headerCells = Array.from(tableElm.querySelectorAll('thead th')).map((th: any) => th.innerText.trim());
    rows.push(headerCells.join(','));
    const bodyRows = Array.from(tableElm.querySelectorAll('tbody tr'));
    bodyRows.forEach((tr: any) => {
      const cols = Array.from(tr.querySelectorAll('td')).map((td: any) => `"${td.innerText.replace(/"/g,'""')}"`);
      rows.push(cols.join(','));
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athletes_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    // fallback to toast if available
    try { (window as any).sonner?.toast?.("Export failed"); } catch {}
  }
}
