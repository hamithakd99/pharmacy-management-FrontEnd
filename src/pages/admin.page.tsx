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
import CategoriesManagement from "./Admin/categoriesManagement";
import AddProduct from "./Admin/Product Management/addNewProduct";
import EditProduct from "./Admin/Product Management/editProduct";
import GRNManagement from "./Admin/gRNManagement";
import CreateGRN from "@/components/GRN/CreateGRN";
import EditGRN from "@/components/GRN/EditGRN";
import CreatePO from "@/components/PO/CreatePO";
import PurchaseOrderManagement from "./Admin/purchaseOrderManagement";
import EditPO from "@/components/PO/EditPO";
import { useState } from "react";
export default function AdminPage() {

  const [inventoryOpen, setInventoryOpen] = useState(false);
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
          {/* ================================
    INVENTORY
================================ */}

          <Box>

            {/* Inventory Main Button */}

            <Box
              p={3}
              rounded="md"
              cursor="pointer"
              _hover={{
                bg: "teal.600",
              }}
              onClick={() =>
                setInventoryOpen(!inventoryOpen)
              }
            >

              <Flex
                justify="space-between"
                align="center"
              >

                <Text>
                  Inventory
                </Text>

                <Text>
                  {inventoryOpen ? "▲" : "▼"}
                </Text>

              </Flex>

            </Box>


            {/* Inventory Sub Menu */}

            {inventoryOpen && (

              <VStack
                align="stretch"
                gap={1}
                mt={1}
                pl={4}
              >

                <Link to="/admin/categories">

                  <Box
                    p={2}
                    rounded="md"
                    fontSize="sm"
                    _hover={{
                      bg: "teal.600",
                    }}
                  >
                    Category
                  </Box>

                </Link>


                <Link to="/admin/po">

                  <Box
                    p={2}
                    rounded="md"
                    fontSize="sm"
                    _hover={{
                      bg: "teal.600",
                    }}
                  >
                    PO
                  </Box>

                </Link>


                <Link to="/admin/grn">

                  <Box
                    p={2}
                    rounded="md"
                    fontSize="sm"
                    _hover={{
                      bg: "teal.600",
                    }}
                  >
                    GRN
                  </Box>

                </Link>


                <Link to="/admin/orders">

                  <Box
                    p={2}
                    rounded="md"
                    fontSize="sm"
                    _hover={{
                      bg: "teal.600",
                    }}
                  >
                    Orders
                  </Box>

                </Link>

              </VStack>

            )}

          </Box>

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
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/register/newuser" element={<UserRegister />} />
          <Route
            path="/register/external/newuser"
            element={<ExternalUserRegister />}
          />
          <Route path="/grn" element={<GRNManagement />} />
          <Route path="/grn/create" element={<CreateGRN />} />
          <Route path="/grn/edit/:batchNumber" element={<EditGRN />} />
          <Route path="/po" element={<PurchaseOrderManagement />} />
          <Route path="/po/create" element={<CreatePO />} />
          <Route path="/po/purchase-orders/:id" element={<EditPO />} />
        </Routes>

      </Box>

    </Flex>
  );
}