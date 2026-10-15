
import {
  Box,
  Button,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import {
  MdAddShoppingCart,
  MdInventory,
  MdLocalShipping,
  MdPeople,
  MdReceiptLong,
  MdCategory,
  MdArrowForward,
} from "react-icons/md";

const actions = [
  {
    title: "Create Bill",
    description: "Create a new sale",
    icon: MdAddShoppingCart,
    path: "/admin/orders/create",
    color: "teal",
  },
  {
    title: "Add Product",
    description: "Add to inventory",
    icon: MdInventory,
    path: "/admin/products/create",
    color: "blue",
  },
  {
    title: "Suppliers",
    description: "Manage suppliers",
    icon: MdLocalShipping,
    path: "/admin/suppliers",
    color: "purple",
  },
  {
    title: "Customers",
    description: "Manage customers",
    icon: MdPeople,
    path: "/admin/customers",
    color: "orange",
  },
  {
    title: "Bills",
    description: "View transactions",
    icon: MdReceiptLong,
    path: "/admin/orders",
    color: "green",
  },
  {
    title: "Categories",
    description: "Manage categories",
    icon: MdCategory,
    path: "/admin/categories",
    color: "pink",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      p={{ base: "4", md: "6" }}
      rounded="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      w="100%"
      minW="0"
    >
      <Flex
        justify="space-between"
        align="center"
        mb="5"
      >
        <Box>
          <Heading size="md">Quick Actions</Heading>
          <Text fontSize="sm" color="gray.500" mt="1">
            Frequently used pharmacy operations
          </Text>
        </Box>
      </Flex>

      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          xl: "repeat(6, minmax(0, 1fr))",
        }}
        gap={{ base: "3", md: "4" }}
      >
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            h="auto"
            minH={{ base: "120px", md: "135px" }}
            p={{ base: "3", md: "4" }}
            borderColor="gray.200"
            rounded="xl"
            whiteSpace="normal"
            onClick={() => navigate(action.path)}
            _hover={{
              bg: `${action.color}.50`,
              borderColor: `${action.color}.300`,
              transform: "translateY(-2px)",
              boxShadow: "sm",
            }}
            transition="all 0.2s ease"
          >
            <VStack
              gap="3"
              align="start"
              w="100%"
              h="100%"
            >
              <Flex
                align="center"
                justify="center"
                boxSize="44px"
                rounded="lg"
                bg={`${action.color}.100`}
                color={`${action.color}.700`}
              >
                <Icon as={action.icon} boxSize={6} />
              </Flex>

              <Box w="100%">
                <Flex
                  align="center"
                  justify="space-between"
                  gap="1"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    textAlign="left"
                  >
                    {action.title}
                  </Text>

                  <Icon
                    as={MdArrowForward}
                    boxSize={4}
                    color="gray.400"
                    flexShrink={0}
                  />
                </Flex>

                <Text
                  fontSize="xs"
                  color="gray.500"
                  textAlign="left"
                  mt="1"
                >
                  {action.description}
                </Text>
              </Box>
            </VStack>
          </Button>
        ))}
      </Grid>
    </Box>
  );
}
