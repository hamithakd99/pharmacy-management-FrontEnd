import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, Route, Routes } from "react-router-dom";

import ProductManagement from "./Admin/productManagement";
import UserManagement from "./Admin/userManagement";
import UserRegister from "./Admin/user registation/admin.user.register.page";
import ExternalUserRegister from "./Admin/user registation/admin.externalUser.register.page";
import Dashboard from "./Admin/dashBoard";

export default function AdminPage() {
  return (
    <Flex h="100vh" bg="gray.50">

      {/* Sidebar */}

      <Box
        w="260px"
        bg="teal.700"
        color="white"
        px={6}
        py={8}
        boxShadow="lg"
      >

        <Heading size="md" mb={1}>
          PharmaPOS
        </Heading>

        <Text
          color="whiteAlpha.700"
          fontSize="sm"
          mb={8}
        >
          Pharmacy Management
        </Text>

        <VStack align="stretch" gap={2}>

          <Link to="/admin/dashboard">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Dashboard
            </Box>
          </Link>

          <Link to="/admin/users">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Users
            </Box>
          </Link>

          <Link to="/admin/products">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Products
            </Box>
          </Link>

          <Link to="/admin/orders">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Orders
            </Box>
          </Link>

          <Link to="/admin/reports">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Reports
            </Box>
          </Link>

          <Link to="/admin/register/newuser">
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "teal.600",
              }}
            >
              Register Staff
            </Box>
          </Link>

        </VStack>

      </Box>

      {/* Main Content */}

      <Box
        flex="1"
        p={8}
        overflowY="auto"
      >

        <Routes>
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/register/newuser" element={<UserRegister />} />
          <Route
            path="/register/external/newuser"
            element={<ExternalUserRegister />}
          />
        </Routes>

      </Box>

    </Flex>
  );
}