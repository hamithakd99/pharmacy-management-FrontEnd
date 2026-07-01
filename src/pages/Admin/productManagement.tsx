import ProductSearchBar from "@/components/productSearchBar";
import { Box, Button, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import axios from "axios";
import { useEffect, useState } from "react";

const cards = [
  {
    title: "Total Products",
    value: 1248,
  },
  {
    title: "Total Categories",
    value: 48,
  },
  {
    title: "Low Stock Products",
    value: 5,
  },
  {
    title: "Out of Stock Products",
    value: 12,
  },
  {
    title: "Expire Soon Products",
    value: 1,
  }
]

export default function ProductManagement() {

  const [products, setProducts] = useState([]);

  useEffect(
    () => {
      axios.get(import.meta.env.VITE_BACKEND_URL + '/product/all')
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
        });

    }, []
  )

  return (
    <>
      <Box backgroundColor="blue.500"
        p={4} rounded="md" textAlign="center" fontWeight="bold">
        Product Management
      </Box>
      <Text mt="4" fontSize="xl" fontWeight="bold">
        <ProductSearchBar />
      </Text>

      <SimpleGrid
        minChildWidth="150px"
        gap={4}
        mt={4}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            rounded="lg"
            p={4}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="sm"
            minH="110px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Text
              fontSize="sm"
              color="gray.600"
              fontWeight="medium"
            >
              {card.title}
            </Text>

            <Text
              fontSize="3xl"
              fontWeight="bold"
            >
              {card.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box>
        <HStack>
          <Box
            w="75%"
            justifyContent="center"
            alignItems="center"
            display="flex">
            <Table.Root variant="outline" colorPalette="blue" mt={4}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Product ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Product Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Brand</Table.ColumnHeader>
                  <Table.ColumnHeader>Current Stock</Table.ColumnHeader>
                  <Table.ColumnHeader>Selling Price</Table.ColumnHeader>
                  <Table.ColumnHeader>Buying Price</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {products.map((product: any, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>{product.productId}</Table.Cell>

                    <Table.Cell>{product.name}</Table.Cell>

                    <Table.Cell>{product.brand ?? "-"}</Table.Cell>

                    <Table.Cell>
                      {product.totalStock}
                    </Table.Cell>

                    <Table.Cell>
                      Rs. {product.sellingPrice.toFixed(2)}
                    </Table.Cell>

                    <Table.Cell>
                      Rs. {product.buyingPrice.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack>
                        <Button colorScheme="blue">Edit</Button>
                        <Button colorScheme="red">Delete</Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Box
            w="25%"
            justifyContent="center"
            alignItems="center"
            display="flex">
            details
          </Box>
        </HStack>
      </Box>
    </>
  )

}