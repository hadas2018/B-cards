// src/components/admin/UsersTable.tsx
import React, { useState } from "react";
import { User } from "../../interfaces/users/User";
import Pagination from "../Pagination";


interface UsersTableProps {
  users: User[];
  onToggleRole: (userId: string, role: "admin" | "business") => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onToggleRole,
  onEditUser,
  onDeleteUser,
}) => {
  // פאגינציה
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // חישוב מספר הדפים הכולל
  const totalPages = Math.ceil(users.length / itemsPerPage);
  
  // פילטור הנתונים לדף הנוכחי
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // טיפול בשינוי דף
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!users.length) {
    return (
      <div className="alert alert-info text-center">
        לא נמצאו משתמשים להצגה
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="align-middle">
                <td>
                  {user.name?.first} {user.name?.last}
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onEditUser(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteUser(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* שימוש בקומפוננטת פאגינציה */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersTable;
