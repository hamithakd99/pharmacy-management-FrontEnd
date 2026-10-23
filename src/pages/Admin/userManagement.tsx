import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    Flex,
    Heading,
    Input,
    Portal,
    Spinner,
    Text,
} from "@chakra-ui/react";
import toast from "react-hot-toast";

import api from "@/api/axios";

import ExternalUserDetailsDialog from "@/components/User/ExternalUserDetailsDialog";
import ExternalUserForm from "@/components/User/ExternalUserForm";
import ExternalUserTable from "@/components/User/ExternalUserTable";
import StaffForm from "@/components/User/StaffForm";
import StaffTable from "@/components/User/StaffTable";
import UserDetailsDialog from "@/components/User/UserDetailsDialog";
import UserSummaryCards from "@/components/User/UserSummaryCards";

import Pagination from "@/components/Pagination";
import type { PaginationInfo } from "@/components/Pagination";

import type {
    ExternalUser,
    StaffUser,
} from "@/components/User/user.types";

type ActiveTab = "STAFF" | "CUSTOMERS" | "SUPPLIERS";

interface StaffSummary {
    totalStaff: number;
    admins: number;
    employees: number;
    cashiers: number;
}

interface ExternalSummary {
    totalExternal: number;
    suppliers: number;
    customers: number;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
    summary: Record<string, number>;
}

const initialPagination: PaginationInfo = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const initialStaffSummary: StaffSummary = {
    totalStaff: 0,
    admins: 0,
    employees: 0,
    cashiers: 0,
};

const initialExternalSummary: ExternalSummary = {
    totalExternal: 0,
    suppliers: 0,
    customers: 0,
};

export default function UserManagement() {
    // =====================================================
    // DATA STATES
    // =====================================================

    const [users, setUsers] = useState<StaffUser[]>([]);
    const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);

    const [staffSummary, setStaffSummary] =
        useState<StaffSummary>(initialStaffSummary);

    const [externalSummary, setExternalSummary] =
        useState<ExternalSummary>(initialExternalSummary);

    const [staffPagination, setStaffPagination] =
        useState<PaginationInfo>(initialPagination);

    const [externalPagination, setExternalPagination] =
        useState<PaginationInfo>(initialPagination);

    // =====================================================
    // SEARCH, TAB AND PAGINATION
    // =====================================================

    const [activeTab, setActiveTab] = useState<ActiveTab>("STAFF");
    const [search, setSearch] = useState("");

    const [staffPage, setStaffPage] = useState(1);
    const [externalPage, setExternalPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // =====================================================
    // LOADING STATES
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [staffFormLoading, setStaffFormLoading] = useState(false);
    const [externalFormLoading, setExternalFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // =====================================================
    // STAFF DIALOG STATES
    // =====================================================

    const [staffDialogOpen, setStaffDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

    // =====================================================
    // EXTERNAL USER DIALOG STATES
    // =====================================================

    const [externalDialogOpen, setExternalDialogOpen] = useState(false);

    const [editingExternalUser, setEditingExternalUser] =
        useState<ExternalUser | null>(null);

    const [selectedExternalUser, setSelectedExternalUser] =
        useState<ExternalUser | null>(null);

    const [externalViewOpen, setExternalViewOpen] = useState(false);

    // =====================================================
    // LOAD STAFF USERS
    // =====================================================

    const loadUsers = useCallback(async () => {
        try {
            const response = await api.get<PaginatedResponse<StaffUser>>(
                "/user/",
                {
                    params: {
                        page: staffPage,
                        limit,
                        search: search.trim(),
                    },
                }
            );

            const result = response.data;

            setUsers(Array.isArray(result.data) ? result.data : []);

            if (result.pagination) {
                setStaffPagination(result.pagination);
            }

            if (result.summary) {
                setStaffSummary({
                    totalStaff: result.summary.totalStaff ?? 0,
                    admins: result.summary.admins ?? 0,
                    employees: result.summary.employees ?? 0,
                    cashiers: result.summary.cashiers ?? 0,
                });
            }
        } catch (error) {
            console.error("Failed to load staff users:", error);
            toast.error("Failed to load staff users.");
        }
    }, [staffPage, limit, search]);

    // =====================================================
    // LOAD EXTERNAL USERS
    // =====================================================

    const loadExternalUsers = useCallback(async () => {
        try {
            const role =
                activeTab === "CUSTOMERS"
                    ? "CUSTOMER"
                    : activeTab === "SUPPLIERS"
                        ? "SUPPLIER"
                        : "";

            const response = await api.get<PaginatedResponse<ExternalUser>>(
                "/external/all-external-users",
                {
                    params: {
                        page: externalPage,
                        limit,
                        search: search.trim(),
                        role,
                    },
                }
            );

            const result = response.data;

            setExternalUsers(
                Array.isArray(result.data) ? result.data : []
            );

            if (result.pagination) {
                setExternalPagination(result.pagination);
            }

            if (result.summary) {
                setExternalSummary({
                    totalExternal: result.summary.totalExternal ?? 0,
                    suppliers: result.summary.suppliers ?? 0,
                    customers: result.summary.customers ?? 0,
                });
            }
        } catch (error) {
            console.error("Failed to load external users:", error);
            toast.error("Failed to load external users.");
        }
    }, [externalPage, limit, search, activeTab]);

    // =====================================================
    // INITIAL LOAD AND REFRESH
    // =====================================================

    const loadAllUsers = useCallback(async () => {
        setLoading(true);

        try {
            await Promise.all([
                loadUsers(),
                loadExternalUsers(),
            ]);
        } finally {
            setLoading(false);
        }
    }, [loadUsers, loadExternalUsers]);

    useEffect(() => {
        void loadAllUsers();
    }, [loadAllUsers]);

    // =====================================================
    // SEARCH AND PAGINATION HANDLERS
    // =====================================================

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setStaffPage(1);
        setExternalPage(1);
    };

    const clearSearch = () => {
        handleSearchChange("");
    };

    const handleLimitChange = (value: number) => {
        setLimit(value);
        setStaffPage(1);
        setExternalPage(1);
    };

    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
        setSearch("");
        setStaffPage(1);
        setExternalPage(1);
    };

    // =====================================================
    // CREATE STAFF
    // =====================================================

    const handleCreateStaff = async (
        data: Record<string, unknown>
    ) => {
        try {
            setStaffFormLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            await api.post("/user/register", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Staff user created successfully.");

            setStaffDialogOpen(false);
            setEditingStaff(null);
            setStaffPage(1);

            await loadUsers();
        } catch (error: any) {
            console.error("Create staff error:", error);
            console.error("Server response:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create staff user."
            );
        } finally {
            setStaffFormLoading(false);
        }
    };

    // =====================================================
    // UPDATE STAFF
    // =====================================================

    const handleUpdateStaff = async (
        data: Record<string, unknown>
    ) => {
        if (!editingStaff) return;

        try {
            setStaffFormLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            await api.put(
                `/user/update/${editingStaff.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Staff updated successfully.");

            setStaffDialogOpen(false);
            setEditingStaff(null);

            await loadUsers();
        } catch (error: any) {
            console.error("Update staff error:", error);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update staff."
            );
        } finally {
            setStaffFormLoading(false);
        }
    };

    // =====================================================
    // DELETE STAFF
    // =====================================================

    const handleDeleteStaff = (user: StaffUser) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteStaff = async () => {
        if (!userToDelete) return;

        try {
            setDeleteLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            await api.delete(`/user/delete/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Staff user deleted successfully.");

            setDeleteDialogOpen(false);
            setUserToDelete(null);

            // Last record on a page may have been deleted.
            // Reset to page 1 to avoid an empty last page.
            setStaffPage(1);

            await loadUsers();
        } catch (error: any) {
            console.error("Delete staff error:", error);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete staff user."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =====================================================
    // CREATE EXTERNAL USER
    // =====================================================

    const handleCreateExternalUser = async (
        data: Record<string, unknown>
    ) => {
        try {
            setExternalFormLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            await api.post("/external/register", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("External user created successfully.");

            setExternalDialogOpen(false);
            setEditingExternalUser(null);
            setExternalPage(1);

            await loadExternalUsers();
        } catch (error: any) {
            console.error("Create external user error:", error);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create external user."
            );
        } finally {
            setExternalFormLoading(false);
        }
    };

    // =====================================================
    // UPDATE EXTERNAL USER
    // =====================================================

    const handleUpdateExternalUser = async (
        data: Record<string, unknown>
    ) => {
        if (!editingExternalUser) return;

        try {
            setExternalFormLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            const updateData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber,
                nickName: data.nickName,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
            };

            await api.put(
                `/external/update/${editingExternalUser.id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("External user updated successfully.");

            setExternalDialogOpen(false);
            setEditingExternalUser(null);

            await loadExternalUsers();
        } catch (error: any) {
            console.error("Update external user error:", error);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update external user."
            );
        } finally {
            setExternalFormLoading(false);
        }
    };

    // =====================================================
    // DELETE EXTERNAL USER
    // =====================================================

    const handleDeleteExternalUser = async (
        user: ExternalUser
    ) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/external/delete/${user.id}`);

            toast.success("External user deleted successfully.");

            setExternalPage(1);

            await loadExternalUsers();
        } catch (error: any) {
            console.error("Delete external user error:", error);

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete external user."
            );
        }
    };

    // =====================================================
    // VIEW / EDIT HANDLERS
    // =====================================================

    const handleViewStaff = (user: StaffUser) => {
        setSelectedStaff(user);
        setViewDialogOpen(true);
    };

    const handleEditStaff = (user: StaffUser) => {
        setEditingStaff(user);
        setStaffDialogOpen(true);
    };

    const handleViewExternalUser = (user: ExternalUser) => {
        setSelectedExternalUser(user);
        setExternalViewOpen(true);
    };

    const handleEditExternalUser = (user: ExternalUser) => {
        setEditingExternalUser(user);
        setExternalDialogOpen(true);
    };

    // =====================================================
    // SUMMARY COUNTS
    // =====================================================

    // These values come from backend count() queries.
    // They do not depend on the current page or search.

    const {
        totalStaff,
        admins,
        employees,
        cashiers,
    } = staffSummary;

    const {
        totalExternal,
        suppliers,
        customers,
    } = externalSummary;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box>
            {/* PAGE HEADER */}

            <Flex
                justify="space-between"
                align="center"
                mb={5}
                gap={4}
                wrap="wrap"
            >
                <Box>
                    <Heading size="lg" fontWeight="700">
                        User Management
                    </Heading>

                    <Text color="gray.500" fontSize="sm" mt={1}>
                        Manage staff, suppliers and customers
                    </Text>
                </Box>

                <Flex gap={2} wrap="wrap">
                    <Button
                        colorPalette="blue"
                        onClick={() => {
                            setEditingStaff(null);
                            setStaffDialogOpen(true);
                        }}
                    >
                        + Staff
                    </Button>

                    <Button
                        colorPalette="teal"
                        onClick={() => {
                            setEditingExternalUser(null);
                            setExternalDialogOpen(true);
                        }}
                    >
                        + External User
                    </Button>
                </Flex>
            </Flex>

            {/* SUMMARY CARDS */}

            <UserSummaryCards
                totalStaff={totalStaff}
                admins={admins}
                employees={employees}
                cashiers={cashiers}
                totalExternal={totalExternal}
                suppliers={suppliers}
                customers={customers}
            />

            {/* TABS */}

            <Flex
                borderBottomWidth="1px"
                borderColor="gray.200"
                mb={4}
                gap={1}
                wrap="wrap"
            >
                <Button
                    variant={activeTab === "STAFF" ? "subtle" : "ghost"}
                    colorPalette="blue"
                    roundedBottom="none"
                    onClick={() => handleTabChange("STAFF")}
                >
                    Staff ({totalStaff})
                </Button>

                <Button
                    variant={activeTab === "CUSTOMERS" ? "subtle" : "ghost"}
                    colorPalette="green"
                    roundedBottom="none"
                    onClick={() => handleTabChange("CUSTOMERS")}
                >
                    Customers ({customers})
                </Button>

                <Button
                    variant={activeTab === "SUPPLIERS" ? "subtle" : "ghost"}
                    colorPalette="orange"
                    roundedBottom="none"
                    onClick={() => handleTabChange("SUPPLIERS")}
                >
                    Suppliers ({suppliers})
                </Button>
            </Flex>

            {/* SEARCH AND REFRESH */}

            <Flex
                justify="space-between"
                align="center"
                gap={3}
                mb={4}
                wrap="wrap"
            >
                <Flex gap={2} flex="1" maxW="500px">
                    <Input
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                        placeholder={
                            activeTab === "STAFF"
                                ? "Search staff..."
                                : activeTab === "CUSTOMERS"
                                    ? "Search customers..."
                                    : "Search suppliers..."
                        }
                        bg="white"
                    />

                    {search && (
                        <Button
                            variant="outline"
                            onClick={clearSearch}
                        >
                            Clear
                        </Button>
                    )}
                </Flex>

                <Button
                    variant="outline"
                    onClick={() => void loadAllUsers()}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Flex>

            {/* CONTENT */}

            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    minH="250px"
                >
                    <Spinner size="lg" />
                </Flex>
            ) : (
                <>
                    {activeTab === "STAFF" && (
                        <>
                            {users.length === 0 ? (
                                <Box
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    rounded="lg"
                                    p={10}
                                    textAlign="center"
                                >
                                    <Text fontWeight="600" color="gray.600">
                                        No staff users found
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        mt={1}
                                    >
                                        Try a different search term.
                                    </Text>
                                </Box>
                            ) : (
                                <StaffTable
                                    users={users}
                                    onView={handleViewStaff}
                                    onEdit={handleEditStaff}
                                    onDelete={handleDeleteStaff}
                                />
                            )}

                            <Pagination
                                pagination={staffPagination}
                                onPageChange={setStaffPage}
                                onLimitChange={handleLimitChange}
                            />
                        </>
                    )}

                    {activeTab === "CUSTOMERS" && (
                        <>
                            {externalUsers.length === 0 ? (
                                <Box
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    rounded="lg"
                                    p={10}
                                    textAlign="center"
                                >
                                    <Text fontWeight="600" color="gray.600">
                                        No customers found
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        mt={1}
                                    >
                                        Try a different search term.
                                    </Text>
                                </Box>
                            ) : (
                                <ExternalUserTable
                                    users={externalUsers}
                                    onView={handleViewExternalUser}
                                    onEdit={handleEditExternalUser}
                                    onDelete={handleDeleteExternalUser}
                                />
                            )}

                            <Pagination
                                pagination={externalPagination}
                                onPageChange={setExternalPage}
                                onLimitChange={handleLimitChange}
                            />
                        </>
                    )}

                    {activeTab === "SUPPLIERS" && (
                        <>
                            {externalUsers.length === 0 ? (
                                <Box
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    rounded="lg"
                                    p={10}
                                    textAlign="center"
                                >
                                    <Text fontWeight="600" color="gray.600">
                                        No suppliers found
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        mt={1}
                                    >
                                        Try a different search term.
                                    </Text>
                                </Box>
                            ) : (
                                <ExternalUserTable
                                    users={externalUsers}
                                    onView={handleViewExternalUser}
                                    onEdit={handleEditExternalUser}
                                    onDelete={handleDeleteExternalUser}
                                />
                            )}

                            <Pagination
                                pagination={externalPagination}
                                onPageChange={setExternalPage}
                                onLimitChange={handleLimitChange}
                            />
                        </>
                    )}
                </>
            )}

            {/* STAFF DETAILS */}

            <UserDetailsDialog
                open={viewDialogOpen}
                user={selectedStaff}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedStaff(null);
                }}
            />

            {/* EXTERNAL USER DETAILS */}

            <ExternalUserDetailsDialog
                open={externalViewOpen}
                user={selectedExternalUser}
                onClose={() => {
                    setExternalViewOpen(false);
                    setSelectedExternalUser(null);
                }}
            />

            {/* CREATE / EDIT STAFF DIALOG */}

            <Dialog.Root
                open={staffDialogOpen}
                onOpenChange={(details) => {
                    if (!details.open) {
                        setStaffDialogOpen(false);
                        setEditingStaff(null);
                    }
                }}
            >
                <Portal>
                    <Dialog.Backdrop />

                    <Dialog.Positioner>
                        <Dialog.Content maxW="900px" rounded="xl">
                            <Dialog.Header>
                                <Dialog.Title>
                                    {editingStaff
                                        ? "Edit Staff User"
                                        : "Register Staff User"}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body pb={5}>
                                <StaffForm
                                    user={editingStaff}
                                    loading={staffFormLoading}
                                    onCancel={() => {
                                        setStaffDialogOpen(false);
                                        setEditingStaff(null);
                                    }}
                                    onSubmit={(data) => {
                                        if (editingStaff) {
                                            void handleUpdateStaff(data);
                                        } else {
                                            void handleCreateStaff(data);
                                        }
                                    }}
                                />
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* DELETE STAFF CONFIRMATION */}

            <Dialog.Root
                open={deleteDialogOpen}
                onOpenChange={(details) => {
                    if (!details.open) {
                        setDeleteDialogOpen(false);
                        setUserToDelete(null);
                    }
                }}
            >
                <Portal>
                    <Dialog.Backdrop />

                    <Dialog.Positioner>
                        <Dialog.Content maxW="420px" rounded="xl">
                            <Dialog.Header>
                                <Dialog.Title>
                                    Delete Staff User
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <Text color="gray.600" mb={3}>
                                    Are you sure you want to delete this staff
                                    user?
                                </Text>

                                {userToDelete && (
                                    <Box
                                        bg="gray.50"
                                        rounded="lg"
                                        p={4}
                                    >
                                        <Text fontWeight="700">
                                            {userToDelete.firstName}{" "}
                                            {userToDelete.lastName}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                        >
                                            {userToDelete.userId}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                        >
                                            {userToDelete.email}
                                        </Text>
                                    </Box>
                                )}

                                <Text
                                    fontSize="sm"
                                    color="red.500"
                                    mt={4}
                                >
                                    This action cannot be undone.
                                </Text>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                        setUserToDelete(null);
                                    }}
                                    disabled={deleteLoading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    colorPalette="red"
                                    onClick={() =>
                                        void confirmDeleteStaff()
                                    }
                                    loading={deleteLoading}
                                >
                                    Delete User
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* CREATE / EDIT EXTERNAL USER DIALOG */}

            <Dialog.Root
                open={externalDialogOpen}
                onOpenChange={(details) => {
                    if (!details.open) {
                        setExternalDialogOpen(false);
                        setEditingExternalUser(null);
                    }
                }}
            >
                <Portal>
                    <Dialog.Backdrop />

                    <Dialog.Positioner>
                        <Dialog.Content maxW="900px" rounded="xl">
                            <Dialog.Header>
                                <Dialog.Title>
                                    {editingExternalUser
                                        ? "Edit External User"
                                        : "Register External User"}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body pb={5}>
                                <ExternalUserForm
                                    user={editingExternalUser}
                                    loading={externalFormLoading}
                                    onCancel={() => {
                                        setExternalDialogOpen(false);
                                        setEditingExternalUser(null);
                                    }}
                                    onSubmit={(
                                        data: Record<string, unknown>
                                    ) => {
                                        if (editingExternalUser) {
                                            void handleUpdateExternalUser(data);
                                        } else {
                                            void handleCreateExternalUser(data);
                                        }
                                    }}
                                />
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
}