import {
  Box,
  VStack,
  Text,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";

import { useState } from "react";

import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiMenu,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: FiHome,
    path: "/admin",
  },
  {
    title: "Products",
    icon: FiPackage,
    path: "/admin/products",
  },
  {
    title: "Users",
    icon: FiUsers,
    path: "/admin/users",
  },
  {
    title: "Orders",
    icon: FiShoppingCart,
    path: "/admin/orders",
  },
  {
    title: "Reports",
    icon: FiBarChart2,
    path: "/admin/reports",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      w={collapsed ? "80px" : "260px"}
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      transition="all .3s ease"
      display="flex"
      flexDirection="column"
      p={4}
      boxShadow="sm"
    >
      {/* Header */}

      <HStack justify="space-between" mb={8}>
        {!collapsed && (
          <Heading
            size="md"
            color="teal.600"
          >
            PharmaPOS
          </Heading>
        )}

        <IconButton
          aria-label="Toggle Sidebar"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu />
        </IconButton>
      </HStack>

      {/* Menu */}

      <VStack gap={2} align="stretch" flex="1">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
          >
            {({ isActive }) => (
              <HStack
                p={3}
                rounded="lg"
                justify={
                  collapsed
                    ? "center"
                    : "flex-start"
                }
                bg={
                  isActive
                    ? "teal.500"
                    : "transparent"
                }
                color={
                  isActive
                    ? "white"
                    : "gray.600"
                }
                transition="all .2s"
                cursor="pointer"
                _hover={{
                  bg: isActive
                    ? "teal.500"
                    : "gray.100",
                }}
              >
                <Box fontSize="20px">
                  <menu.icon />
                </Box>

                {!collapsed && (
                  <Text
                    fontWeight="500"
                  >
                    {menu.title}
                  </Text>
                )}
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* Footer */}

      {!collapsed && (
        <Box
          borderTop="1px solid"
          borderColor="gray.200"
          pt={4}
        >
          <Text
            fontSize="sm"
            color="gray.500"
          >
            Logged in as
          </Text>

          <Text
            fontWeight="bold"
          >
            Administrator
          </Text>
        </Box>
      )}
    </Box>
  );
}