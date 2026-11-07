import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";

export interface Product {
  id: number;
  productId: string;
  name: string;
  brand?: string | null;
  totalStock: number;
  buyingPrice: number;
  sellingPrice: number;
  reorderLevel: number;
}

type ProductTableProps = {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
  <>
    <Box display={{ base: "block", md: "none" }} mt={3}>
      {products.length === 0 ? (
        <Box borderWidth="1px" rounded="lg" p={8} textAlign="center">
          <Text color="gray.500">No Products Found</Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={2}>
          {products.map((product) => (
            <Box
              key={product.id}
              borderWidth="1px"
              borderColor="gray.200"
              rounded="lg"
              p={3}
            >
              <Flex justify="space-between" align="start" gap={3}>
                <Box minW={0}>
                  <Text fontSize="xs" color="gray.500">
                    {product.productId}
                  </Text>
                  <Text fontWeight="semibold" fontSize="sm" truncate>
                    {product.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" truncate>
                    {product.brand ?? "No brand"}
                  </Text>
                </Box>
                <Text fontWeight="bold" fontSize="sm" flexShrink={0}>
                  {product.totalStock}
                </Text>
              </Flex>

              <Flex justify="space-between" align="end" mt={3} gap={2}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Rs. {product.sellingPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Buy: Rs. {product.buyingPrice.toFixed(2)}
                  </Text>
                </Box>
                <HStack gap={1} flexShrink={0}>
                  <Button size="xs" colorPalette="teal" onClick={() => onView(product)}>
                    View
                  </Button>
                  <Button size="xs" colorPalette="blue" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button size="xs" colorPalette="red" onClick={() => onDelete(product)}>
                    Delete
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>

    <Box display={{ base: "none", md: "block" }}>
  <Table.Root variant="outline" colorPalette="blue" mt={4}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product ID</Table.ColumnHeader>

          <Table.ColumnHeader>Product Name</Table.ColumnHeader>

          <Table.ColumnHeader>Brand</Table.ColumnHeader>

          <Table.ColumnHeader textAlign="center">
            Current Stock
          </Table.ColumnHeader>

          <Table.ColumnHeader textAlign="end">
            Selling Price
          </Table.ColumnHeader>

          <Table.ColumnHeader textAlign="center">
            Actions
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {products.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6} textAlign="center" py={10}>
              <Text color="gray.500">No Products Found</Text>
            </Table.Cell>
          </Table.Row>
        ) : (
          products.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.productId}</Table.Cell>

              <Table.Cell>{product.name}</Table.Cell>

              <Table.Cell>{product.brand ?? "-"}</Table.Cell>

              <Table.Cell textAlign="center">
                {product.totalStock}
              </Table.Cell>

              <Table.Cell textAlign="end">
                <Text fontWeight="bold">
                  Rs. {product.sellingPrice.toFixed(2)}
                </Text>

                <Text fontSize="xs" color="gray.500">
                  Buy : Rs. {product.buyingPrice.toFixed(2)}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <HStack justify="center">
                  <Button
                    size="sm"
                    colorPalette="teal"
                    onClick={() => onView(product)}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    colorPalette="blue"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    colorPalette="red"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
      </Box>
    </>
  );
}