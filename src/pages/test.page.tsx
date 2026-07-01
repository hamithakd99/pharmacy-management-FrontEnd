import Sidebar from "@/components/Slidebar/sidebar";
import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function TestPage() {
  return (
    <Flex bg="gray.50">
      <Sidebar />

      <Box
        flex="1"
        p={6}
        overflow="auto"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}