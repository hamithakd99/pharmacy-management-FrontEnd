import ExternalUserTable from "@/components/User/ExternalUserTable";
import StaffForm from "@/components/User/StaffForm";
import StaffTable from "@/components/User/StaffTable";
import type { ExternalUser, StaffUser } from "@/components/User/user.types";
import UserSummaryCards from "@/components/User/UserSummaryCards";
import { Box, Button, Dialog, Flex, Heading, Input, Portal, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type ActiveTab =
    | "STAFF"
    | "EXTERNAL";

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

    const filteredExternalUsers =
        useMemo(() => {

            const value =
                search
                    .toLowerCase()
                    .trim();

            if (!value) {

                return externalUsers;

            }

            return externalUsers.filter(
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
            externalUsers,
            search,
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

            await axios.post(
                import.meta.env.VITE_BACKEND_URL +
                "/user/register",
                data
            );

            toast.success(
                "Staff user created successfully."
            );

            setStaffDialogOpen(false);

            await loadUsers();

        } catch (error: any) {

            console.error(error);

            toast.error(
                error.response?.data?.error ??
                "Failed to create staff user."
            );

        } finally {

            setStaffFormLoading(false);

        }

    };


    // =================================================
    // DELETE STAFF USER
    // =================================================

    const handleDeleteStaff =
        async (
            user: StaffUser
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
                    import.meta.env.VITE_BACKEND_URL +
                    `/user/delete/${user.id}`
                );


                setUsers(
                    (currentUsers) =>
                        currentUsers.filter(
                            (item) =>
                                item.id !==
                                user.id
                        )
                );


            } catch (error) {

                console.error(
                    "Failed to delete staff user:",
                    error
                );

                window.alert(
                    "Failed to delete user."
                );

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

            await axios.put(
                `/user/update/${editingStaff.id}`,
                data
            );

            toast.success(
                "Staff updated successfully."
            );

            setEditingStaff(null);

            setStaffDialogOpen(false);

            await loadUsers();

        } catch (error: any) {

            console.error(error);

            toast.error(
                error.response?.data?.error ??
                "Failed to update staff."
            );

        } finally {

            setStaffFormLoading(false);

        }

    };


    // =================================================
    // VIEW STAFF
    // =================================================

    const handleViewStaff =
        (user: StaffUser) => {

            console.log(
                "View Staff User:",
                user
            );

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

    const handleViewExternalUser =
        (user: ExternalUser) => {

            console.log(
                "View External User:",
                user
            );

        };


    // =================================================
    // EDIT EXTERNAL USER
    // =================================================

    const handleEditExternalUser =
        (user: ExternalUser) => {

            console.log(
                "Edit External User:",
                user
            );

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

            <Flex
                borderBottomWidth="1px"
                borderColor="gray.200"
                mb={4}
                gap={1}
            >

                <Button
                    variant={
                        activeTab ===
                            "STAFF"
                            ? "subtle"
                            : "ghost"
                    }
                    colorPalette="blue"
                    roundedBottom="none"
                    onClick={() => {

                        setActiveTab(
                            "STAFF"
                        );

                        setSearch("");

                    }}
                >
                    Staff
                    {" "}
                    ({users.length})
                </Button>


                <Button
                    variant={
                        activeTab ===
                            "EXTERNAL"
                            ? "subtle"
                            : "ghost"
                    }
                    colorPalette="teal"
                    roundedBottom="none"
                    onClick={() => {

                        setActiveTab(
                            "EXTERNAL"
                        );

                        setSearch("");

                    }}
                >
                    External Users
                    {" "}
                    ({externalUsers.length})
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
                            activeTab ===
                                "STAFF"
                                ? "Search staff..."
                                : "Search suppliers or customers..."
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

                    <Spinner
                        size="lg"
                    />

                </Flex>

            ) : activeTab ===
                "STAFF" ? (

                /* =================================================
                   STAFF TABLE
                ================================================= */

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
                            Try a different search
                            term.
                        </Text>

                    </Box>

                ) : (

                    <StaffTable
                        users={
                            filteredStaff
                        }

                        onView={
                            handleViewStaff
                        }

                        onEdit={
                            handleEditStaff
                        }

                        onDelete={
                            handleDeleteStaff
                        }
                    />

                )

            ) : (

                /* =================================================
                   EXTERNAL USER TABLE
                ================================================= */

                filteredExternalUsers.length ===
                    0 ? (

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
                            No external users found
                        </Text>

                        <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={1}
                        >
                            Try a different search
                            term.
                        </Text>

                    </Box>

                ) : (

                    <ExternalUserTable
                        users={
                            filteredExternalUsers
                        }

                        onView={
                            handleViewExternalUser
                        }

                        onEdit={
                            handleEditExternalUser
                        }

                        onDelete={
                            handleDeleteExternalUser
                        }
                    />

                )

            )}
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

        </Box>

    );

}