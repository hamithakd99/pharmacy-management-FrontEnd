import { Button, HStack, Text } from "@chakra-ui/react";
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
  );
}