import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    FiHome,
    FiUsers,
    FiPackage,
    FiShoppingCart,
    FiBarChart2,
    FiChevronDown,
    FiChevronRight,
    FiChevronLeft,
    FiMenu,
    FiX,
    FiLayers,
    FiClipboard,
    FiTruck,
    FiArchive,
    FiLogOut,
} from "react-icons/fi";
import {
    NavLink,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";

import ProductManagement from "./Admin/productManagement";
import UserManagement from "./Admin/userManagement";
import UserRegister from "./Admin/user registation/admin.user.register.page";
import ExternalUserRegister from "./Admin/user registation/admin.externalUser.register.page";
import Dashboard from "./Admin/dashBoard";
import CategoriesManagement from "./Admin/categoriesManagement";
import AddProduct from "./Admin/Product Management/addNewProduct";
import EditProduct from "./Admin/Product Management/editProduct";
import GRNManagement from "./Admin/gRNManagement";
import CreateGRN from "@/components/GRN/CreateGRN";
import EditGRN from "@/components/GRN/EditGRN";
import CreatePO from "@/components/PO/CreatePO";
import PurchaseOrderManagement from "./Admin/purchaseOrderManagement";
import EditPO from "@/components/PO/EditPO";
import OrderManagement from "./Admin/orderManagement";
import CreateOrder from "@/components/Order/CreateOrder/createOrder";
import OpeningStock from "@/components/Inventory/OpeningStock";
import LogoutDialog from "@/components/LogoutDialog";

const COLORS = {
    navy: "#073B4C",
    green: "#15966A",
    mint: "#EAF5F2",
    white: "#FFFFFF",
    muted: "#64748B",
};

const menuItems = [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: FiHome,
    },
    {
        title: "Users",
        path: "/admin/users",
        icon: FiUsers,
    },
    {
        title: "Products",
        path: "/admin/products",
        icon: FiPackage,
    },
];

const inventoryItems = [
    {
        title: "Categories",
        path: "/admin/categories",
        icon: FiLayers,
    },
    {
        title: "Purchase Orders",
        path: "/admin/po",
        icon: FiClipboard,
    },
    {
        title: "GRN",
        path: "/admin/grn",
        icon: FiTruck,
    },
    {
        title: "Orders",
        path: "/admin/orders",
        icon: FiShoppingCart,
    },
    {
        title: "Opening Stock",
        path: "/admin/opening-stock",
        icon: FiArchive,
    },
];

const reportItem = {
    title: "Reports",
    path: "/admin/reports",
    icon: FiBarChart2,
};

interface StoredUser {
    firstName?: string;
    lastName?: string;
    role?: string;
}

export default function AdminPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    let user: StoredUser = {};

    try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : {};
    } catch {
        user = {};
    }

    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Administrator";

    const userRole = user.role || "ADMIN";

    const isInventoryActive = inventoryItems.some(
        (item) =>
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
    );

    useEffect(() => {
        if (isInventoryActive) {
            setInventoryOpen(true);
        }
    }, [isInventoryActive]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLogoutDialogOpen(false);
        navigate("/login", { replace: true });
    }

    function renderNavItem(
        item: {
            title: string;
            path: string;
            icon: React.ElementType;
        },
        nested = false
    ) {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                style={{ textDecoration: "none" }}
            >
                {({ isActive }) => (
                    <HStack
                        position="relative"
                        minH="42px"
                        px={collapsed && !nested ? "0" : nested ? "3" : "3"}
                        py="2"
                        ml={nested && !collapsed ? "2" : "0"}
                        justify={
                            collapsed && !nested
                                ? "center"
                                : "flex-start"
                        }
                        gap="3"
                        rounded="lg"
                        bg={isActive ? COLORS.navy : "transparent"}
                        color={isActive ? "white" : COLORS.muted}
                        fontWeight={isActive ? "semibold" : "medium"}
                        cursor="pointer"
                        transition="all 0.18s ease"
                        title={collapsed ? item.title : undefined}
                        _hover={{
                            bg: isActive ? COLORS.navy : COLORS.mint,
                            color: isActive ? "white" : COLORS.navy,
                        }}
                    >
                        {isActive && (
                            <Box
                                position="absolute"
                                left="0"
                                top="8px"
                                bottom="8px"
                                w="3px"
                                bg={COLORS.green}
                                roundedRight="full"
                            />
                        )}

                        <Box
                            minW="20px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            fontSize="17px"
                            color={isActive ? "#65D6A7" : "inherit"}
                        >
                            <Icon />
                        </Box>

                        {(!collapsed || mobileOpen) && (
                            <Text fontSize="sm" flex="1" truncate>
                                {item.title}
                            </Text>
                        )}

                        {isActive && (!collapsed || mobileOpen) && (
                            <Box
                                w="5px"
                                h="5px"
                                rounded="full"
                                bg="#65D6A7"
                                flexShrink={0}
                            />
                        )}
                    </HStack>
                )}
            </NavLink>
        );
    }

    function renderSidebar(isMobile = false) {
        const compact = collapsed && !isMobile;

        return (
            <Flex
                direction="column"
                h="100%"
                minH="0"
                w="full"
                bg={COLORS.white}
                overflow="hidden"
            >
                {/* Logo */}
                <Flex
                    minH={compact ? "76px" : "112px"}
                    px={compact ? "2" : "4"}
                    py="3"
                    align="center"
                    justify="center"
                    borderBottom="1px solid"
                    borderColor="gray.100"
                >
                    {compact ? (
                        <Box
                            w="42px"
                            h="42px"
                            rounded="lg"
                            bg={COLORS.mint}
                            p="1"
                        >
                            <img
                                src="/icon.png"
                                alt="Sethro Pharmacy"
                                style={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                    ) : (
                        <Box w="full" minW="0">
                            <Box
                                bg={COLORS.mint}
                                rounded="xl"
                                px="2"
                                py="2"
                            >
                                <img
                                    src="/Medical Logo.png"
                                    alt="Sethro Pharmacy"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "62px",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>

                            <Text
                                textAlign="center"
                                fontSize="9px"
                                fontWeight="bold"
                                letterSpacing="1.4px"
                                color={COLORS.navy}
                                mt="2"
                            >
                                PHARMACY MANAGEMENT
                            </Text>
                        </Box>
                    )}
                </Flex>

                {/* Sidebar controls */}
                <Flex
                    px="3"
                    pt="3"
                    pb="2"
                    justify={compact ? "center" : "space-between"}
                    align="center"
                >
                    {!compact && (
                        <Text
                            fontSize="10px"
                            fontWeight="bold"
                            letterSpacing="1.5px"
                            color="gray.400"
                        >
                            MAIN MENU
                        </Text>
                    )}

                    {!isMobile && (
                        <IconButton
                            aria-label={
                                compact ? "Expand sidebar" : "Collapse sidebar"
                            }
                            title={
                                compact ? "Expand sidebar" : "Collapse sidebar"
                            }
                            size="xs"
                            variant="ghost"
                            color={COLORS.navy}
                            onClick={() => setCollapsed((value) => !value)}
                            _hover={{
                                bg: COLORS.mint,
                                color: COLORS.green,
                            }}
                        >
                            {compact ? <FiChevronRight /> : <FiChevronLeft />}
                        </IconButton>
                    )}
                </Flex>

                {/* Navigation */}
                <VStack
                    align="stretch"
                    gap="1"
                    px="2"
                    pb="3"
                    flex="1"
                    minH="0"
                    overflowY="auto"
                    overflowX="hidden"
                >
                    {menuItems.map((item) => renderNavItem(item))}

                    {/* Inventory group */}
                    <Box>
                        <HStack
                            minH="42px"
                            px={compact ? "0" : "3"}
                            justify={compact ? "center" : "flex-start"}
                            gap="3"
                            rounded="lg"
                            cursor="pointer"
                            bg={
                                isInventoryActive
                                    ? COLORS.mint
                                    : "transparent"
                            }
                            color={
                                isInventoryActive
                                    ? COLORS.navy
                                    : COLORS.muted
                            }
                            fontWeight={isInventoryActive ? "semibold" : "medium"}
                            title={compact ? "Inventory" : undefined}
                            onClick={() => {
                                if (compact) {
                                    setCollapsed(false);
                                    setInventoryOpen(true);
                                } else {
                                    setInventoryOpen((value) => !value);
                                }
                            }}
                            _hover={{
                                bg: COLORS.mint,
                                color: COLORS.navy,
                            }}
                        >
                            <Box
                                minW="20px"
                                display="flex"
                                justifyContent="center"
                                fontSize="17px"
                                color={isInventoryActive ? COLORS.green : "inherit"}
                            >
                                <FiPackage />
                            </Box>

                            {(!compact || isMobile) && (
                                <>
                                    <Text fontSize="sm" flex="1">
                                        Inventory
                                    </Text>

                                    {inventoryOpen ? (
                                        <FiChevronDown size={14} />
                                    ) : (
                                        <FiChevronRight size={14} />
                                    )}
                                </>
                            )}
                        </HStack>

                        {inventoryOpen && (!compact || isMobile) && (
                            <VStack
                                align="stretch"
                                gap="1"
                                mt="1"
                                pl="2"
                            >
                                {inventoryItems.map((item) =>
                                    renderNavItem(item, true)
                                )}
                            </VStack>
                        )}
                    </Box>

                    {renderNavItem(reportItem)}
                </VStack>

                {/* User profile */}
                <Box
                    p={compact ? "2" : "3"}
                    borderTop="1px solid"
                    borderColor="gray.100"
                    bg="gray.50"
                >
                    <HStack
                        gap="2"
                        justify={compact ? "center" : "flex-start"}
                        mb="3"
                    >
                        <Flex
                            w="34px"
                            h="34px"
                            flexShrink={0}
                            align="center"
                            justify="center"
                            rounded="lg"
                            bg={COLORS.navy}
                            color="white"
                            fontWeight="bold"
                            fontSize="xs"
                        >
                            {userName.charAt(0).toUpperCase()}
                        </Flex>

                        {(!compact || isMobile) && (
                            <Box flex="1" minW="0">
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    color={COLORS.navy}
                                    truncate
                                >
                                    {userName}
                                </Text>

                                <Text
                                    fontSize="10px"
                                    color={COLORS.green}
                                    textTransform="capitalize"
                                >
                                    {userRole.toLowerCase()}
                                </Text>
                            </Box>
                        )}
                    </HStack>

                    <Button
                        w="full"
                        h="34px"
                        size="sm"
                        variant="outline"
                        borderColor="gray.200"
                        color="gray.600"
                        rounded="lg"
                        onClick={() => setIsLogoutDialogOpen(true)}
                        _hover={{
                            bg: "red.50",
                            color: "red.600",
                            borderColor: "red.200",
                        }}
                    >
                        <FiLogOut />
                        {(!compact || isMobile) && (
                            <Text fontSize="xs" ml="1">
                                Sign out
                            </Text>
                        )}

                        <LogoutDialog
                            open={isLogoutDialogOpen}
                            onClose={() => setIsLogoutDialogOpen(false)}
                            onConfirm={handleLogout}
                        />

                    </Button>
                </Box>
            </Flex>
        );
    }

    return (
        <Flex
            h="100dvh"
            w="full"
            minW="0"
            overflow="hidden"
            bg={COLORS.mint}
        >
            {/* Desktop sidebar */}
            <Box
                display={{ base: "none", md: "block" }}
                flexShrink={0}
                w={collapsed ? "68px" : "220px"}
                h="100%"
                borderRight="1px solid"
                borderColor="gray.200"
                boxShadow="2px 0 10px rgba(7,59,76,0.04)"
                transition="width 0.2s ease"
                overflow="hidden"
            >
                {renderSidebar()}
            </Box>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <Box
                    display={{ base: "block", md: "none" }}
                    position="fixed"
                    inset="0"
                    zIndex="1000"
                >
                    <Box
                        position="absolute"
                        inset="0"
                        bg="blackAlpha.600"
                        onClick={() => setMobileOpen(false)}
                    />

                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        bottom="0"
                        w="260px"
                        maxW="85vw"
                        bg="white"
                        boxShadow="2xl"
                    >
                        <Flex
                            justify="flex-end"
                            p="2"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <IconButton
                                aria-label="Close navigation"
                                variant="ghost"
                                onClick={() => setMobileOpen(false)}
                            >
                                <FiX />
                            </IconButton>
                        </Flex>

                        <Box h="calc(100% - 49px)">
                            {renderSidebar(true)}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Main area */}
            <Flex
                direction="column"
                flex="1"
                minW="0"
                h="100%"
                overflow="hidden"
            >
                {/* Mobile top bar */}
                <Flex
                    display={{ base: "flex", md: "none" }}
                    h="58px"
                    flexShrink={0}
                    align="center"
                    justify="space-between"
                    px="3"
                    bg="white"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                >
                    <HStack gap="2">
                        <IconButton
                            aria-label="Open navigation"
                            variant="ghost"
                            color={COLORS.navy}
                            onClick={() => setMobileOpen(true)}
                        >
                            <FiMenu />
                        </IconButton>

                        <Text
                            fontWeight="bold"
                            color={COLORS.navy}
                            fontSize="sm"
                        >
                            Sethro Pharmacy
                        </Text>
                    </HStack>

                    <Box
                        w="34px"
                        h="34px"
                        rounded="lg"
                        bg={COLORS.mint}
                        p="1"
                    >
                        <img
                            src="/Medical Logo.png"
                            alt="Sethro Pharmacy"
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                </Flex>

                {/* Page content */}
                <Box
                    flex="1"
                    minH="0"
                    minW="0"
                    p={{ base: "3", sm: "4", lg: "6" }}
                    overflowY="auto"
                    overflowX="hidden"
                >
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="products/edit/:id" element={<EditProduct />} />
                        <Route path="categories" element={<CategoriesManagement />} />
                        <Route path="register/newuser" element={<UserRegister />} />
                        <Route
                            path="register/external/newuser"
                            element={<ExternalUserRegister />}
                        />
                        <Route path="grn" element={<GRNManagement />} />
                        <Route path="grn/create" element={<CreateGRN />} />
                        <Route path="grn/edit/:batchNumber" element={<EditGRN />} />
                        <Route path="po" element={<PurchaseOrderManagement />} />
                        <Route path="po/create" element={<CreatePO />} />
                        <Route path="po/purchase-orders/:id" element={<EditPO />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="orders/create" element={<CreateOrder />} />
                        <Route path="opening-stock" element={<OpeningStock />} />
                    </Routes>
                </Box>
            </Flex>
        </Flex>
    );
}