
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Badge,
  Box,
  Flex,
  Heading,
  Table,
  Text,
  Skeleton,
  VStack,
  HStack,
} from "@chakra-ui/react";

interface Customer {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
}

interface Order {
  id: number | string;
  orderNumber?: string | null;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentMethod?: string | null;
  customer?: Customer | null;
  customerName?: string | null;
}

const getOrders = (data: any): Order[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  return [];
};

const formatCurrency = (amount: number) =>
  `Rs. ${(Number(amount) || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPaymentMethod = (method?: string | null) => {
  if (!method) return "Not specified";

  const labels: Record<string, string> = {
    CASH: "Cash",
    CARD: "Card",
    BANK_TRANSFER: "Bank Transfer",
    OTHER: "Other",
  };

  return labels[method.toUpperCase()] ?? method.replaceAll("_", " ");
};

const getPaymentColor = (method?: string | null) => {
  switch (method?.toUpperCase()) {
    case "CASH":
      return "green";
    case "CARD":
      return "blue";
    case "BANK_TRANSFER":
      return "purple";
    default:
      return "gray";
  }
};

export default function RecentBills() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchRecentBills = async () => {
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

        const allOrders = getOrders(response.data);

        const confirmedOrders = allOrders
          .filter((order) => order.status === "CONFIRMED")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        if (!cancelled) {
          setOrders(confirmedOrders);
        }
      } catch (err) {
        console.error("Failed to load recent bills:", err);

        if (!cancelled) {
          setError("Unable to load recent bills.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecentBills();

    return () => {
      cancelled = true;
    };
  }, []);

  const getCustomerName = (order: Order) => {
    const customer = order.customer;

    if (!customer) {
      return "Walk-in Customer";
    }

    const fullName = [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      fullName ||
      customer.name?.trim() ||
      order.customerName?.trim() ||
      "Walk-in Customer"
    );
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
            <Heading size="md">Recent Bills</Heading>

            {!loading && (
              <Badge colorPalette="teal" variant="subtle">
                {orders.length}
              </Badge>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.500">
            Latest confirmed sales transactions
          </Text>
        </Box>

        <Text fontSize="xs" color="gray.500">
          Latest 5 transactions
        </Text>
      </Flex>

      {loading ? (
        <VStack align="stretch" gap="4">
          <Skeleton height="36px" />
          <Skeleton height="48px" />
          <Skeleton height="48px" />
          <Skeleton height="48px" />
        </VStack>
      ) : error ? (
        <Box
          p="4"
          rounded="lg"
          bg="red.50"
          color="red.600"
        >
          <Text fontSize="sm">{error}</Text>
        </Box>
      ) : orders.length === 0 ? (
        <Box py="10" textAlign="center">
          <Text fontWeight="600" color="gray.700">
            No confirmed bills yet
          </Text>

          <Text fontSize="sm" color="gray.500" mt="1">
            Confirmed transactions will appear here.
          </Text>
        </Box>
      ) : (
        <Box w="100%" overflowX="auto">
          <Table.Root size="sm" minW="600px">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader py="3">
                  Bill
                </Table.ColumnHeader>

                <Table.ColumnHeader py="3">
                  Customer
                </Table.ColumnHeader>

                <Table.ColumnHeader py="3" textAlign="end">
                  Amount
                </Table.ColumnHeader>

                <Table.ColumnHeader py="3">
                  Payment
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell py="4">
                    <VStack align="start" gap="1">
                      <Text
                        fontWeight="600"
                        fontSize="sm"
                        color="teal.700"
                      >
                        {order.orderNumber || `Order #${order.id}`}
                      </Text>

                      <Text fontSize="xs" color="gray.500">
                        {Number.isNaN(
                          new Date(order.createdAt).getTime()
                        )
                          ? "Date unavailable"
                          : new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                      </Text>
                    </VStack>
                  </Table.Cell>

                  <Table.Cell py="4">
                    <Text fontSize="sm" fontWeight="medium">
                      {getCustomerName(order)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell py="4" textAlign="end">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      whiteSpace="nowrap"
                    >
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell py="4">
                    <Badge
                      colorPalette={getPaymentColor(
                        order.paymentMethod
                      )}
                      variant="subtle"
                      rounded="md"
                      px="2"
                      py="1"
                    >
                      {formatPaymentMethod(order.paymentMethod)}
                    </Badge>
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
