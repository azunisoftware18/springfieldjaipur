"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "@/components/table/core"; // Apne path ke hisaab se adjust karein
import ActionMenu from "../common/ActionMenu";
import { Pencil, Trash, User, Mail, ShieldCheck } from "lucide-react";
import { useState, useMemo } from "react";

// 1. Dummy Data
const DUMMY_USERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: 2,
    name: "Sneha Patel",
    email: "sneha@example.com",
    role: "Editor",
    status: "Active",
    joinedDate: "2023-11-05",
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@example.com",
    role: "User",
    status: "Inactive",
    joinedDate: "2024-01-20",
  },
];

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 2. Filter Logic
  const filteredUsers = useMemo(() => {
    return DUMMY_USERS.filter((user) =>
      [user.name, user.email].some((val) =>
        val?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const columns = ["User Details", "Role", "Status", "Joined", "Action"];

  return (
    <TableShell
      title="User Management"
      searchProps={{
        value: search,
        onChange: (e) => setSearch(e.target.value),
        onClear: () => setSearch(""),
        placeholder: "Search by name or email...",
      }}
      paginationProps={{
        page,
        totalPages: 1,
        onNext: () => setPage((p) => p + 1),
        onPrev: () => setPage((p) => p - 1),
      }}
    >
      <TableHead columns={columns} />

      <TableBody>
        {loading ? (
          <TableLoader rows={5} />
        ) : filteredUsers.length === 0 ? (
          <TableEmpty message="No users found." />
        ) : (
          filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              renderActions={() => (
                <ActionMenu
                  items={[
                    {
                      label: "Edit User",
                      icon: Pencil,
                      onClick: () => console.log("Edit", user.id),
                    },
                    {
                      label: "Delete",
                      icon: Trash,
                      danger: true,
                      onClick: () => console.log("Delete", user.id),
                    },
                  ]}
                />
              )}
            >
              {/* User Details Column */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" /> {user.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Role Column */}
              <td className="px-6 py-4">
                <div className="flex items-center text-slate-600">
                  <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                  {user.role}
                </div>
              </td>

              {/* Status Column */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              {/* Date Column */}
              <td className="px-6 py-4 text-slate-500 italic text-sm">
                {new Date(user.joinedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </TableRow>
          ))
        )}
      </TableBody>
    </TableShell>
  );
}