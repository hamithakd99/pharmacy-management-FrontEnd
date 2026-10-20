
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
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiX,
    FiLogOut,
} from "react-icons/fi";

import LogoutDialog from "@/components/LogoutDialog";

const COLORS = {
    navy: "#073B4C",
    green: "#15966A",
    mint: "#EAF5F2",
    white: "#FFFFFF",
    muted: "#64748B",
};

export interface MenuItem {
    label: string;
    path: string;
}

interface RoleLayoutProps {
    title: string;
    menuItems: MenuItem[];
}

interface StoredUser {
    firstName?: string;
    lastName?: string;
    role?: string;
}

const getMenuIcon = (label: string) => {
    switch (label.toLowerCase()) {
        case "dashboard":
            return FiHome;
        case "products":
        case "product management":
            return FiPackage;
        case "point of sale":
        case "orders":
        case "order management":
            return FiShoppingCart;
        default:
            return FiPackage;
    }
};

export default function RoleLayout({
    title,
    menuItems,
}: RoleLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] =
        useState(false);

    let user: StoredUser = {};

    try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : {};
    } catch {
        user = {};
    }

    const userName =
        [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") || title;

    const userRole = user.role || title.toUpperCase();

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLogoutDialogOpen(false);
        navigate("/login", { replace: true });
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
                {/* Pharmacy logo */}
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

                {/* Sidebar heading and collapse */}
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
                                compact
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                            title={
                                compact
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                            size="xs"
                            variant="ghost"
                            color={COLORS.navy}
                            onClick={() =>
                                setCollapsed((value) => !value)
                            }
                            _hover={{
                                bg: COLORS.mint,
                                color: COLORS.green,
                            }}
                        >
                            {compact ? (
                                <FiChevronRight />
                            ) : (
                                <FiChevronLeft />
                            )}
                        </IconButton>
                    )}
                </Flex>

                {/* Role-specific navigation */}
                <VStack
                    align="stretch"
                    gap="1"
                    px="2"
                    pb="3"
                    flex="1"
                    minH="0"
                    overflowY="auto"
                >
                    {menuItems.map((item) => {
                        const Icon = getMenuIcon(item.label);

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                {({ isActive }) => (
                                    <HStack
                                        position="relative"
                                        minH="42px"
                                        px={compact ? "0" : "3"}
                                        py="2"
                                        justify={
                                            compact
                                                ? "center"
                                                : "flex-start"
                                        }
                                        gap="3"
                                        rounded="lg"
                                        bg={
                                            isActive
                                                ? COLORS.navy
                                                : "transparent"
                                        }
                                        color={
                                            isActive
                                                ? "white"
                                                : COLORS.muted
                                        }
                                        fontWeight={
                                            isActive
                                                ? "semibold"
                                                : "medium"
                                        }
                                        cursor="pointer"
                                        transition="all 0.18s ease"
                                        title={
                                            compact
                                                ? item.label
                                                : undefined
                                        }
                                        _hover={{
                                            bg: isActive
                                                ? COLORS.navy
                                                : COLORS.mint,
                                            color: isActive
                                                ? "white"
                                                : COLORS.navy,
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
                                            color={
                                                isActive
                                                    ? "#65D6A7"
                                                    : "inherit"
                                            }
                                        >
                                            <Icon />
                                        </Box>

                                        {(!compact || isMobile) && (
                                            <Text
                                                fontSize="sm"
                                                flex="1"
                                                truncate
                                            >
                                                {item.label}
                                            </Text>
                                        )}

                                        {isActive &&
                                            (!compact || isMobile) && (
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
                    })}
                </VStack>

                {/* User profile and sign out */}
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
                        onClick={() =>
                            setIsLogoutDialogOpen(true)
                        }
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
                    </Button>

                    <LogoutDialog
                        open={isLogoutDialogOpen}
                        onClose={() =>
                            setIsLogoutDialogOpen(false)
                        }
                        onConfirm={handleLogout}
                    />
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

            {/* Mobile navigation drawer */}
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
                                onClick={() =>
                                    setMobileOpen(false)
                                }
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

            {/* Main content */}
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

                {/* Routed page */}
                <Box
                    flex="1"
                    minH="0"
                    minW="0"
                    p={{ base: "3", sm: "4", lg: "6" }}
                    overflowY="auto"
                    overflowX="hidden"
                >
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
}
