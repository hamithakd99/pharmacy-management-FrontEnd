import { Flex, HStack, VStack } from "@chakra-ui/react";
import { Link, Route, Routes } from "react-router-dom";
import UserRegister from "./Admin/admin.user.register.page";
import ExternalUserRegister from "./Admin/admin.externalUser.register.page";

export default function AdminPage () {
    return (
        <div>
            <HStack>
                <Flex direction="column" bg="cyan.600" align="center" gap={3} p={3} borderRight="1px solid gray" minWidth="200px">
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/admin/reports">Reports</Link>
                    <Link to="/admin/reviews">Reviews</Link>
                    <Link to="/admin/register/newuser">Register Internal User</Link>
                    <Link to="/admin/register/external/newuser">Register External User</Link>
                
                </Flex>
                <VStack>
                    <Routes>
                        <Route path="/users" element={<h1>Users Management</h1>} />
                        <Route path="/products" element={<h1>Products Management</h1>} />
                        <Route path="/orders" element={<h1>Orders Management</h1>} />
                        <Route path="/reports" element={<h1>Reports Management</h1>} />
                        <Route path="/reviews" element={<h1>Reviews Management</h1>} />
                        <Route path="/register/newuser" element={<UserRegister />} />
                        <Route path="/register/external/newuser" element={<ExternalUserRegister />} />
                    </Routes>
                </VStack>
                
            </HStack>
        </div>
    )
}