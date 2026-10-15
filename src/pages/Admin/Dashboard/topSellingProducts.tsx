
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
  VStack,
  Skeleton,
} from "@chakra-ui/react";

interface OrderItem {
  id: number | string;
  quantity: number;
  sellingPrice: number;
  lineTotal?: number;
  product?: {
    id?: number | string;
    productId?: string;
    name?: string;
  } | null;
}

interface Order {
  id: number | string;
  status: string;
  items?: OrderItem[];
}

interface TopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
}

const formatCurrency = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getOrders = (responseData: any): Order[] => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.orders)) return responseData.orders;
  if (Array.isArray(responseData?.data?.orders)) {
    return responseData.data.orders;
  }
  return [];
};

export default function TopSellingProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/order`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        const orders = getOrders(response.data);

        // Only CONFIRMED orders are included.
        const confirmedOrders = orders.filter(
          (order) => order.status === "CONFIRMED"
        );

        const productMap = new Map<string, TopProduct>();

        confirmedOrders.forEach((order) => {
          (order.items ?? []).forEach((item) => {
            const productId = String(
              item.product?.id ?? item.product?.productId ?? item.id
            );

            const productName =
              item.product?.name?.trim() || "Unknown Product";

            const quantity = Number(item.quantity) || 0;

            const revenue =
              item.lineTotal != null
                ? Number(item.lineTotal) || 0
                : (Number(item.sellingPrice) || 0) * quantity;

            const existing = productMap.get(productId);

            if (existing) {
              existing.sold += quantity;
              existing.revenue += revenue;
            } else {
              productMap.set(productId, {
                id: productId,
                name: productName,
                sold: quantity,
                revenue,
              });
            }
          });
        });

        const topProducts = Array.from(productMap.values())
          .filter((product) => product.sold > 0)
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);

        if (!cancelled) {
          setProducts(topProducts);
        }
      } catch (err) {
        console.error("Failed to load top-selling products:", err);

        if (!cancelled) {
          setError("Unable to load top-selling products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTopProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const highestSold = Math.max(
    ...products.map((product) => product.sold),
    1
  );

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
        gap="2"
        mb="5"
      >
        <Box>
          <Heading size="md">Top Selling Products</Heading>
          <Text fontSize="sm" color="gray.500" mt="1">
            Best-performing products by confirmed sales
          </Text>
        </Box>

        <Badge colorPalette="teal" fontSize="xs">
          Top 5
        </Badge>
      </Flex>

      {loading ? (
        <VStack align="stretch" gap="4">
          <Skeleton height="40px" />
          <Skeleton height="55px" />
          <Skeleton height="55px" />
          <Skeleton height="55px" />
        </VStack>
      ) : error ? (
        <Box py="8" textAlign="center">
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        </Box>
      ) : products.length === 0 ? (
        <Box py="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            No confirmed sales available yet.
          </Text>
        </Box>
      ) : (
        <Box w="100%" overflowX="auto">
          <Table.Root size="sm" minW="520px">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Rank</Table.ColumnHeader>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Sold
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Revenue
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {products.map((product, index) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    {index === 0 ? (
                      <Badge colorPalette="yellow">🥇 #1</Badge>
                    ) : index === 1 ? (
                      <Badge colorPalette="gray">🥈 #2</Badge>
                    ) : index === 2 ? (
                      <Badge colorPalette="orange">🥉 #3</Badge>
                    ) : (
                      <Badge>#{index + 1}</Badge>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <VStack align="start" gap="2">
                      <Text fontWeight="600" fontSize="sm">
                        {product.name}
                      </Text>

                      <Box w="100%" maxW="180px">
                        <Progress.Root
                          value={(product.sold / highestSold) * 100}
                          size="xs"
                          colorPalette="teal"
                        >
                          <Progress.Track>
                            <Progress.Range />
                          </Progress.Track>
                        </Progress.Root>
                      </Box>
                    </VStack>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text fontWeight="medium">
                      {product.sold.toLocaleString()}
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text fontWeight="medium" whiteSpace="nowrap">
                      {formatCurrency(product.revenue)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
