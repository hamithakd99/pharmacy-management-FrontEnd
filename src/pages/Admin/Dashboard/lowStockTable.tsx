
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Badge,
  Box,
  Flex,
  Heading,
  Progress,
  Table,
  Text,
  Skeleton,
  VStack,
  HStack,
} from "@chakra-ui/react";

interface StockBatchItem {
  availableQuantity: number;
  expiryDate?: string;
}

interface Product {
  id: number | string;
  productId: string;
  name: string;
  isActive?: boolean;
  reorderLevel?: number;
  totalStock?: number;
  stockBatchItems?: StockBatchItem[];
}

interface LowStockProduct {
  id: string;
  productId: string;
  name: string;
  stock: number;
  reorderLevel: number;
}

const getProducts = (data: any): Product[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

export default function LowStockTable() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product/all`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        const allProducts = getProducts(response.data);

        const lowStockProducts = allProducts
          .filter((product) => product.isActive !== false)
          .map((product) => {
            const stock =
              product.totalStock ??
              product.stockBatchItems?.reduce(
                (total, batch) =>
                  total + (Number(batch.availableQuantity) || 0),
                0
              ) ??
              0;

            return {
              id: String(product.id),
              productId: product.productId,
              name: product.name,
              stock: Number(stock) || 0,
              reorderLevel: Number(product.reorderLevel ?? 10),
            };
          })
          .filter(
            (product) => product.stock <= product.reorderLevel
          )
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);

        if (!cancelled) {
          setProducts(lowStockProducts);
        }
      } catch (err) {
        console.error("Failed to load low-stock products:", err);

        if (!cancelled) {
          setError("Unable to load stock information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLowStockProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const getStockStatus = (product: LowStockProduct) => {
    if (product.stock <= 0) {
      return { label: "Out of stock", color: "red" as const };
    }

    if (product.stock <= product.reorderLevel * 0.25) {
      return { label: "Critical", color: "red" as const };
    }

    return { label: "Low stock", color: "orange" as const };
  };

  return (
    <Box
      bg="white"
      p={{ base: "4", md: "6" }}
      rounded="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      minW="0"
      w="100%"
    >
      <Flex
        justify="space-between"
        align={{ base: "start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap="3"
        mb="5"
      >
        <Box>
          <HStack gap="2" mb="1">
            <Heading size="md">Low Stock Products</Heading>
            {!loading && (
              <Badge colorPalette="orange" variant="subtle">
                {products.length}
              </Badge>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.500">
            Products that need replenishment
          </Text>
        </Box>

        <Text fontSize="xs" color="gray.500">
          Showing top {products.length}
        </Text>
      </Flex>

      {loading ? (
        <VStack align="stretch" gap="4">
          <Skeleton height="36px" />
          <Skeleton height="58px" />
          <Skeleton height="58px" />
          <Skeleton height="58px" />
        </VStack>
      ) : error ? (
        <Box
          p="4"
          bg="red.50"
          color="red.600"
          rounded="lg"
        >
          <Text fontSize="sm">{error}</Text>
        </Box>
      ) : products.length === 0 ? (
        <Box
          py="10"
          textAlign="center"
          bg="green.50"
          rounded="lg"
        >
          <Text fontWeight="600" color="green.700">
            All products are sufficiently stocked
          </Text>
          <Text fontSize="sm" color="gray.500" mt="1">
            No products are currently below their reorder level.
          </Text>
        </Box>
      ) : (
        <Box w="100%" overflowX="auto">
          <Table.Root size="sm" minW="460px">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader py="3">
                  Product
                </Table.ColumnHeader>

                <Table.ColumnHeader py="3">
                  Available Stock
                </Table.ColumnHeader>

                <Table.ColumnHeader py="3">
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {products.map((product) => {
                const status = getStockStatus(product);

                const stockPercentage =
                  product.reorderLevel > 0
                    ? Math.min(
                        (product.stock / product.reorderLevel) * 100,
                        100
                      )
                    : product.stock > 0
                      ? 100
                      : 0;

                return (
                  <Table.Row key={product.id}>
                    <Table.Cell py="4">
                      <VStack align="start" gap="1">
                        <Text
                          fontWeight="600"
                          fontSize="sm"
                          color="gray.800"
                        >
                          {product.name}
                        </Text>

                        <Text fontSize="xs" color="gray.500">
                          {product.productId}
                        </Text>
                      </VStack>
                    </Table.Cell>

                    <Table.Cell py="4">
                      <Box minW="90px" maxW="140px">
                        <Progress.Root
                          value={stockPercentage}
                          size="sm"
                          colorPalette={status.color}
                          rounded="full"
                        >
                          <Progress.Track bg="gray.100">
                            <Progress.Range rounded="full" />
                          </Progress.Track>
                        </Progress.Root>

                        <Text
                          fontSize="xs"
                          color="gray.600"
                          mt="2"
                          whiteSpace="nowrap"
                        >
                          <Text as="span" fontWeight="600">
                            {product.stock.toLocaleString()}
                          </Text>
                          {" / "}
                          {product.reorderLevel.toLocaleString()} units
                        </Text>
                      </Box>
                    </Table.Cell>

                    <Table.Cell py="4">
                      <Badge
                        colorPalette={status.color}
                        variant="subtle"
                        rounded="md"
                        px="2"
                        py="1"
                      >
                        {status.label}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
