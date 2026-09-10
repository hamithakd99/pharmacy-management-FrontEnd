import ExternalUserDetailsDialog from "@/components/User/ExternalUserDetailsDialog";
import ExternalUserForm from "@/components/User/ExternalUserForm";
import ExternalUserTable from "@/components/User/ExternalUserTable";
import StaffForm from "@/components/User/StaffForm";
import StaffTable from "@/components/User/StaffTable";
import type { ExternalUser, StaffUser } from "@/components/User/user.types";
import UserDetailsDialog from "@/components/User/UserDetailsDialog";
import UserSummaryCards from "@/components/User/UserSummaryCards";
import { Box, Button, Dialog, Flex, Heading, Input, Portal, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type ActiveTab =
    | "STAFF"
    | "CUSTOMERS"
    | "SUPPLIERS";

export default function UserManagement() {

    // =================================================
    // STATES
    // =================================================

    const [users, setUsers] = useState<StaffUser[]>([]);
    const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("STAFF");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    // Staff Dialog
    const [staffDialogOpen, setStaffDialogOpen] = useState(false);
    const [staffFormLoading, setStaffFormLoading] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
    const [externalDialogOpen, setExternalDialogOpen] = useState(false);
    const [externalFormLoading, setExternalFormLoading] = useState(false);
    const [editingExternalUser, setEditingExternalUser] = useState<ExternalUser | null>(null);
    const [selectedExternalUser, setSelectedExternalUser] = useState<ExternalUser | null>(null);
    const [externalViewOpen, setExternalViewOpen] = useState(false);



    // =================================================
    // LOAD STAFF USERS
    // =================================================

    const loadUsers = async () => {

        try {

            const response =
                await axios.get(
                    import.meta.env.VITE_BACKEND_URL + "/user/");

            setUsers(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load staff users:",
                error
            );

        }

    };


    // =================================================
    // LOAD EXTERNAL USERS
    // =================================================

    const loadExternalUsers = async () => {

        try {

            const response =
                await axios.get(
                    import.meta.env.VITE_BACKEND_URL +
                    "/external/all-external-users"
                );

            setExternalUsers(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load external users:",
                error
            );

        }

    };


    // =================================================
    // LOAD ALL USERS
    // =================================================

    const loadAllUsers = async () => {

        try {

            setLoading(true);

            await Promise.all([
                loadUsers(),
                loadExternalUsers(),
            ]);

        } catch (error) {

            console.error(
                "Failed to load users:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {

        loadAllUsers();

    }, []);


    // =================================================
    // STAFF SEARCH
    // =================================================

    const filteredStaff =
        useMemo(() => {

            const value =
                search
                    .toLowerCase()
                    .trim();

            if (!value) {

                return users;

            }

            return users.filter(
                (user) =>
                    user.userId
                        .toLowerCase()
                        .includes(value) ||

                    user.firstName
                        .toLowerCase()
                        .includes(value) ||

                    user.lastName
                        .toLowerCase()
                        .includes(value) ||

                    user.email
                        .toLowerCase()
                        .includes(value) ||

                    user.contactNumber
                        .toLowerCase()
                        .includes(value) ||

                    user.role
                        .toLowerCase()
                        .includes(value) ||

                    user.city
                        .toLowerCase()
                        .includes(value)
            );

        }, [
            users,
            search,
        ]);


    // =================================================
    // EXTERNAL USER SEARCH
    // =================================================

    // =================================================
    // CUSTOMER SEARCH
    // =================================================

    const filteredCustomers =
        useMemo(() => {
            const value =
                search
                    .toLowerCase()
                    .trim();

            return externalUsers
                .filter(
                    (user) =>
                        user.role === "CUSTOMER"
                )
                .filter(
                    (user) =>
                        !value ||
                        user.userId
                            .toLowerCase()
                            .includes(value) ||
                        user.firstName
                            .toLowerCase()
                            .includes(value) ||
                        user.lastName
                            .toLowerCase()
                            .includes(value) ||
                        user.email
                            .toLowerCase()
                            .includes(value) ||
                        user.contactNumber
                            .toLowerCase()
                            .includes(value) ||
                        user.city
                            .toLowerCase()
                            .includes(value)
                );
        }, [
            externalUsers,
            search
        ]);

    // =================================================
    // SUPPLIER SEARCH
    // =================================================

    const filteredSuppliers =
        useMemo(() => {
            const value =
                search
                    .toLowerCase()
                    .trim();

            return externalUsers
                .filter(
                    (user) =>
                        user.role === "SUPPLIER"
                )
                .filter(
                    (user) =>
                        !value ||
                        user.userId
                            .toLowerCase()
                            .includes(value) ||
                        user.firstName
                            .toLowerCase()
                            .includes(value) ||
                        user.lastName
                            .toLowerCase()
                            .includes(value) ||
                        user.email
                            .toLowerCase()
                            .includes(value) ||
                        user.contactNumber
                            .toLowerCase()
                            .includes(value) ||
                        user.city
                            .toLowerCase()
                            .includes(value)
                );
        }, [
            externalUsers,
            search
        ]);


    // =================================================
    // SUMMARY COUNTS
    // =================================================

    const admins =
        users.filter(
            (user) =>
                user.role === "ADMIN"
        ).length;


    const employees =
        users.filter(
            (user) =>
                user.role === "EMPLOYEE"
        ).length;


    const cashiers =
        users.filter(
            (user) =>
                user.role === "CASHIER"
        ).length;


    const suppliers =
        externalUsers.filter(
            (user) =>
                user.role === "SUPPLIER"
        ).length;


    const customers =
        externalUsers.filter(
            (user) =>
                user.role === "CUSTOMER"
        ).length;

    const handleCreateStaff = async (
        data: Record<string, unknown>
    ) => {

        try {

            setStaffFormLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                toast.error(
                    "You are not logged in."
                );

                return;
            }

            await axios.post(
                import.meta.env.VITE_BACKEND_URL +
                "/user/register",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Staff user created successfully."
            );

            setStaffDialogOpen(false);

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Create Staff Error:",
                error
            );

            console.error(
                "Server Response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create staff user."
            );

        } finally {

            setStaffFormLoading(false);

        }
    };


    // =================================================
    // DELETE STAFF USER
    // =================================================

    const handleDeleteStaff = (
        user: StaffUser
    ) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);

    };

    const confirmDeleteStaff = async () => {

        if (!userToDelete) {
            return;
        }

        try {

            setDeleteLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                toast.error(
                    "You are not logged in."
                );

                return;
            }

            await axios.delete(
                import.meta.env.VITE_BACKEND_URL +
                `/user/delete/${userToDelete.id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Staff user deleted successfully."
            );

            setUsers(
                (currentUsers) =>
                    currentUsers.filter(
                        (user) =>
                            user.id !==
                            userToDelete.id
                    )
            );

            setDeleteDialogOpen(false);

            setUserToDelete(null);

        } catch (error: any) {

            console.error(
                "Delete Staff Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete staff user."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // =================================================
    // DELETE EXTERNAL USER
    // =================================================

    const handleDeleteExternalUser =
        async (
            user: ExternalUser
        ) => {

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
                );

            if (!confirmed) {

                return;

            }



            try {
                await axios.delete(
                    import.meta.env.VITE_BACKEND_URL + `/external/delete/${user.id}`
                );


                setExternalUsers(
                    (currentUsers) =>
                        currentUsers.filter(
                            (item) =>
                                item.id !==
                                user.id
                        )
                );


            } catch (error) {

                console.error(
                    "Failed to delete external user:",
                    error
                );

                window.alert(
                    "Failed to delete external user."
                );

            }
        };

    const handleUpdateStaff = async (
        data: Record<string, unknown>
    ) => {

        if (!editingStaff) {
            return;
        }

        try {

            setStaffFormLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                toast.error(
                    "You are not logged in."
                );

                return;
            }

            await axios.put(
                import.meta.env.VITE_BACKEND_URL +
                `/user/update/${editingStaff.id}`,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Staff updated successfully."
            );

            setEditingStaff(null);

            setStaffDialogOpen(false);

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Update Staff Error:",
                error
            );

            console.error(
                "Server Response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update staff."
            );

        } finally {

            setStaffFormLoading(false);

        }
    };

    const handleCreateExternalUser = async (
        data: Record<string, unknown>
    ) => {
        try {
            setExternalFormLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "You are not logged in."
                );
                return;
            }

            await axios.post(
                import.meta.env.VITE_BACKEND_URL +
                "/external/register",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            toast.success(
                "External user created successfully."
            );

            setExternalDialogOpen(false);
            setEditingExternalUser(null);

            await loadExternalUsers();
        } catch (error: any) {
            console.error(
                "Create External User Error:",
                error
            );

            console.error(
                "Server Response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create external user."
            );
        } finally {
            setExternalFormLoading(false);
        }
    };

    const handleUpdateExternalUser = async (
        data: Record<string, unknown>
    ) => {
        if (!editingExternalUser) {
            return;
        }

        try {
            setExternalFormLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "You are not logged in."
                );
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
                postalCode: data.postalCode
            };

            await axios.put(
                import.meta.env.VITE_BACKEND_URL +
                `/external/update/${editingExternalUser.id}`,
                updateData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            toast.success(
                "External user updated successfully."
            );

            setExternalDialogOpen(false);
            setEditingExternalUser(null);

            await loadExternalUsers();
        } catch (error: any) {
            console.error(
                "Update External User Error:",
                error
            );

            console.error(
                "Server Response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update external user."
            );
        } finally {
            setExternalFormLoading(false);
        }
    };


    // =================================================
    // VIEW STAFF
    // =================================================

    const handleViewStaff = (
        user: StaffUser
    ) => {

        setSelectedStaff(user);

        setViewDialogOpen(true);

    };


    // =================================================
    // EDIT STAFF
    // =================================================

    const handleEditStaff = (
        user: StaffUser
    ) => {

        setEditingStaff(user);

        setStaffDialogOpen(true);

    };


    // =================================================
    // VIEW EXTERNAL USER
    // =================================================

    const handleViewExternalUser = (
        user: ExternalUser
    ) => {
        setSelectedExternalUser(user);
        setExternalViewOpen(true);
    };


    // =================================================
    // EDIT EXTERNAL USER
    // =================================================

    const handleEditExternalUser = (
        user: ExternalUser
    ) => {
        setEditingExternalUser(user);
        setExternalDialogOpen(true);
    };


    // =================================================
    // CLEAR SEARCH
    // =================================================

    const clearSearch = () => {

        setSearch("");

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <Box>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Flex
                justify="space-between"
                align="center"
                mb={5}
                gap={4}
                wrap="wrap"
            >

                <Box>

                    <Heading
                        size="lg"
                        fontWeight="700"
                    >
                        User Management
                    </Heading>

                    <Text
                        color="gray.500"
                        fontSize="sm"
                        mt={1}
                    >
                        Manage staff, suppliers
                        and customers
                    </Text>

                </Box>


                <Flex gap={2}>

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


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <UserSummaryCards
                totalStaff={
                    users.length
                }
                admins={
                    admins
                }
                employees={
                    employees
                }
                cashiers={
                    cashiers
                }
                totalExternal={
                    externalUsers.length
                }
                suppliers={
                    suppliers
                }
                customers={
                    customers
                }
            />


            {/* =================================================
                TABS
            ================================================= */}

            {/* =================================================
    TABS
================================================= */}

            <Flex
                borderBottomWidth="1px"
                borderColor="gray.200"
                mb={4}
                gap={1}
            >
                <Button
                    variant={
                        activeTab === "STAFF"
                            ? "subtle"
                            : "ghost"
                    }
                    colorPalette="blue"
                    roundedBottom="none"
                    onClick={() => {
                        setActiveTab("STAFF");
                        setSearch("");
                    }}
                >
                    Staff ({users.length})
                </Button>

                <Button
                    variant={
                        activeTab === "CUSTOMERS"
                            ? "subtle"
                            : "ghost"
                    }
                    colorPalette="green"
                    roundedBottom="none"
                    onClick={() => {
                        setActiveTab("CUSTOMERS");
                        setSearch("");
                    }}
                >
                    Customers ({customers})
                </Button>

                <Button
                    variant={
                        activeTab === "SUPPLIERS"
                            ? "subtle"
                            : "ghost"
                    }
                    colorPalette="orange"
                    roundedBottom="none"
                    onClick={() => {
                        setActiveTab("SUPPLIERS");
                        setSearch("");
                    }}
                >
                    Suppliers ({suppliers})
                </Button>
            </Flex>


            {/* =================================================
                SEARCH + REFRESH
            ================================================= */}

            <Flex
                justify="space-between"
                align="center"
                gap={3}
                mb={4}
            >

                <Flex
                    gap={2}
                    flex="1"
                    maxW="500px"
                >

                    <Input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
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
                            onClick={
                                clearSearch
                            }
                        >
                            Clear
                        </Button>
                    )}

                </Flex>


                <Button
                    variant="outline"
                    onClick={
                        loadAllUsers
                    }
                    disabled={loading}
                >
                    Refresh
                </Button>

            </Flex>


            {/* =================================================
                CONTENT
            ================================================= */}

            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    minH="250px"
                >
                    <Spinner size="lg" />
                </Flex>
            ) : activeTab === "STAFF" ? (
                filteredStaff.length === 0 ? (
                    <Box
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        rounded="lg"
                        p={10}
                        textAlign="center"
                    >
                        <Text
                            fontWeight="600"
                            color="gray.600"
                        >
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
                        users={filteredStaff}
                        onView={handleViewStaff}
                        onEdit={handleEditStaff}
                        onDelete={handleDeleteStaff}
                    />
                )
            ) : activeTab === "CUSTOMERS" ? (
                filteredCustomers.length === 0 ? (
                    <Box
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        rounded="lg"
                        p={10}
                        textAlign="center"
                    >
                        <Text
                            fontWeight="600"
                            color="gray.600"
                        >
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
                        users={filteredCustomers}
                        onView={handleViewExternalUser}
                        onEdit={handleEditExternalUser}
                        onDelete={handleDeleteExternalUser}
                    />
                )
            ) : (
                filteredSuppliers.length === 0 ? (
                    <Box
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        rounded="lg"
                        p={10}
                        textAlign="center"
                    >
                        <Text
                            fontWeight="600"
                            color="gray.600"
                        >
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
                        users={filteredSuppliers}
                        onView={handleViewExternalUser}
                        onEdit={handleEditExternalUser}
                        onDelete={handleDeleteExternalUser}
                    />
                )
            )}


            <UserDetailsDialog
                open={viewDialogOpen}
                user={selectedStaff}
                onClose={() => {

                    setViewDialogOpen(false);

                    setSelectedStaff(null);

                }}
            />
            <ExternalUserDetailsDialog
                open={externalViewOpen}
                user={selectedExternalUser}
                onClose={() => {
                    setExternalViewOpen(false);
                    setSelectedExternalUser(null);
                }}
            />
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

                        <Dialog.Content
                            maxW="900px"
                            rounded="xl"
                        >

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

                                            handleUpdateStaff(data);

                                        } else {

                                            handleCreateStaff(data);

                                        }

                                    }}
                                />

                            </Dialog.Body>

                        </Dialog.Content>

                    </Dialog.Positioner>

                </Portal>
            </Dialog.Root>
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

                        <Dialog.Content
                            maxW="420px"
                            rounded="xl"
                        >

                            <Dialog.Header>

                                <Dialog.Title>
                                    Delete Staff User
                                </Dialog.Title>

                            </Dialog.Header>


                            <Dialog.Body>

                                <Text
                                    color="gray.600"
                                    mb={3}
                                >
                                    Are you sure you want to
                                    delete this staff user?
                                </Text>


                                {userToDelete && (

                                    <Box
                                        bg="gray.50"
                                        rounded="lg"
                                        p={4}
                                    >

                                        <Text
                                            fontWeight="700"
                                        >
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
                                    onClick={
                                        confirmDeleteStaff
                                    }
                                    loading={
                                        deleteLoading
                                    }
                                >
                                    Delete User
                                </Button>

                            </Dialog.Footer>

                        </Dialog.Content>

                    </Dialog.Positioner>

                </Portal>
            </Dialog.Root>
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
                        <Dialog.Content
                            maxW="900px"
                            rounded="xl"
                        >
                            <Dialog.Header>
                                <Dialog.Title>
                                    {editingExternalUser
                                        ? "Edit External User"
                                        : "Register External User"}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body pb={5}>
                                <ExternalUserForm
                                    user={
                                        editingExternalUser
                                    }
                                    loading={
                                        externalFormLoading
                                    }
                                    onCancel={() => {
                                        setExternalDialogOpen(
                                            false
                                        );
                                        setEditingExternalUser(
                                            null
                                        );
                                    }}
                                    onSubmit={(data: Record<string, unknown>) => {
                                        if (editingExternalUser) {
                                            handleUpdateExternalUser(data);
                                        } else {
                                            handleCreateExternalUser(data);
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