import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/userSlice";
import { logout } from "../redux/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Edit, Trash2, LogOut, User } from "lucide-react";

const UserListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, total_pages, current_page, loading } = useSelector(
    (state: RootState) => state.users
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  // User info - in a real app, you'd probably fetch this from an API
  // For now we'll just hardcode a username based on having a token
  const username = token ? "Admin User" : "Guest";

  useEffect(() => {
    // Only fetch users if the list is empty (initial load) or page changes
    if (users.length === 0) {
      dispatch(fetchUsers(current_page));
    }
  }, [dispatch, current_page, users.length]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers(page));
  };

  const handleDeleteUser = (id: number) => {
    dispatch(deleteUser(id))
      .then(() => {
        setNotification({
          message: "User deleted successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        setNotification({
          message: "Failed to delete user. Please try again.",
          type: "error",
        });
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleEditUser = (user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  }) => {
    navigate(`/users/edit/${user.id}`, { state: { user } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-12 h-12" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Avatar</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar>
                              <AvatarImage
                                src={user.avatar}
                                alt={user.first_name}
                              />
                              <AvatarFallback>
                                {user.first_name[0]}
                                {user.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.first_name}
                          </TableCell>
                          <TableCell>{user.last_name}</TableCell>
                          <TableCell className="hidden md:table-cell truncate max-w-[150px] lg:max-w-none">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                                className="w-full sm:w-auto"
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setSelectedUser(user.id)}
                                    className="w-full sm:w-auto"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the user from
                                      the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        selectedUser &&
                                        handleDeleteUser(selectedUser)
                                      }
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (current_page > 1)
                            handlePageChange(current_page - 1);
                        }}
                        isActive={current_page > 1}
                      />
                    </PaginationItem>
                    {[...Array(total_pages)].map((_, index) => (
                      <PaginationItem
                        key={index}
                        className="hidden sm:inline-block"
                      >
                        <PaginationLink
                          href="#"
                          isActive={current_page === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className="inline-block sm:hidden">
                      <span className="px-4 py-2">
                        {current_page} of {total_pages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (current_page < total_pages)
                            handlePageChange(current_page + 1);
                        }}
                        isActive={current_page < total_pages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {notification && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          } animate-in slide-in-from-bottom-5 duration-300`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default UserListPage;
