
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Dialog,
  HStack,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiEye,
  FiPrinter,
  FiX,
} from "react-icons/fi";

import type { Order, OrderStatus } from "@/types/order";

interface OrderTableProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
  onConfirmOrder?: (order: Order) => Promise<void> | void;
  onCancelOrder?: (order: Order) => Promise<void> | void;
  onPrintOrder?: (order: Order) => void;
}

const OrderTable = ({
  orders,
  onViewOrder,
  onConfirmOrder,
  onCancelOrder,
  onPrintOrder,
}: OrderTableProps) => {
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const formatCurrency = (amount: number) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getCustomerName = (order: Order) => {
    const customer = order.customer;

    if (!customer) return "Walk-in Customer";

    const fullName = [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return fullName || "Registered Customer";
  };

  const statusStyles: Record<
    OrderStatus,
    { label: string; colorPalette: string }
  > = {
    PENDING: {
      label: "Pending",
      colorPalette: "orange",
    },
    CONFIRMED: {
      label: "Confirmed",
      colorPalette: "blue",
    },
    COMPLETED: {
      label: "Completed",
      colorPalette: "green",
    },
    CANCELLED: {
      label: "Cancelled",
      colorPalette: "red",
    },
  };

  const paymentStyles = {
    PENDING: { label: "Pending", colorPalette: "orange" },
    PARTIAL: { label: "Partial", colorPalette: "yellow" },
    PAID: { label: "Paid", colorPalette: "green" },
    REFUNDED: { label: "Refunded", colorPalette: "red" },
  } as const;

  const handleStatusChange = (
    order: Order,
    value: string
  ) => {
    if (
      order.status === "PENDING" &&
      value === "CONFIRMED"
    ) {
      setConfirmOrder(order);
    }
  };

  const handleConfirmOrder = async () => {
    if (!confirmOrder || confirming) return;

    try {
      setConfirming(true);
      await onConfirmOrder?.(confirmOrder);
      setConfirmOrder(null);
    } catch (error) {
      console.error("Confirm order error:", error);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrder || cancelling) return;

    try {
      setCancelling(true);
      await onCancelOrder?.(cancelOrder);
      setCancelOrder(null);
    } catch (error) {
      console.error("Cancel order error:", error);
    } finally {
      setCancelling(false);
    }
  };

  const renderStatus = (order: Order) => {
    const status = statusStyles[order.status];

    if (order.status === "PENDING") {
      return (
        <NativeSelect.Root
          size="xs"
          width="108px"
          minWidth="108px"
        >
          <NativeSelect.Field
            value={order.status}
            onChange={(event) =>
              handleStatusChange(order, event.target.value)
            }
            aria-label={`Status for ${order.orderNumber}`}
            fontSize="xs"
            fontWeight="600"
            borderRadius="md"
            height="28px"
            px={2}
            bg="orange.50"
            color="orange.800"
            borderColor="orange.200"
            cursor="pointer"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirm</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      );
    }

    return (
      <Badge
        colorPalette={status.colorPalette}
        variant="subtle"
        borderRadius="md"
        px={2}
        py={1}
        fontSize="xs"
        fontWeight="600"
        whiteSpace="nowrap"
      >
        {status.label}
      </Badge>
    );
  };

  const renderActions = (order: Order) => (
    <HStack gap={1.5} justify="flex-start" flexWrap="nowrap">
      <Button
        size="xs"
        variant="outline"
        colorPalette="blue"
        onClick={() => onViewOrder?.(order)}
        title="View order"
        aria-label={`View ${order.orderNumber}`}
        minW="58px"
        height="29px"
        px={2}
      >
        <FiEye />
        View
      </Button>

      {(order.status === "PENDING" ||
        order.status === "CONFIRMED") && (
        <Button
          size="xs"
          variant="outline"
          colorPalette="red"
          onClick={() => setCancelOrder(order)}
          title="Cancel order"
          aria-label={`Cancel ${order.orderNumber}`}
          minW="65px"
          height="29px"
          px={2}
        >
          <FiX />
          Cancel
        </Button>
      )}

      <Button
        size="xs"
        variant="outline"
        colorPalette="gray"
        onClick={() => onPrintOrder?.(order)}
        title="Print invoice"
        aria-label={`Print ${order.orderNumber}`}
        minW="58px"
        height="29px"
        px={2}
      >
        <FiPrinter />
        Print
      </Button>
    </HStack>
  );

  return (
    <>
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        width="100%"
      >
        <Box overflowX="auto" width="100%">
          <Table.Root
            variant="outline"
            size="sm"
            width="100%"
            minWidth="920px"
          >
            <Table.Header>
              <Table.Row bg="gray.50">
                {[
                  { label: "ORDER", width: "135px" },
                  { label: "CUSTOMER", width: "175px" },
                  { label: "DATE", width: "120px" },
                  { label: "ITEMS", width: "65px" },
                  { label: "TOTAL", width: "135px" },
                  { label: "PAYMENT", width: "100px" },
                  { label: "STATUS", width: "120px" },
                  { label: "ACTIONS", width: "220px" },
                ].map((column) => (
                  <Table.ColumnHeader
                    key={column.label}
                    width={column.width}
                    px={3}
                    py={2.5}
                    fontSize="xs"
                    fontWeight="700"
                    color="gray.600"
                    whiteSpace="nowrap"
                  >
                    {column.label}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} py={10} textAlign="center">
                    <VStack gap={1}>
                      <Text fontSize="sm" fontWeight="600" color="gray.600">
                        No orders found
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Try changing your search or filters.
                      </Text>
                    </VStack>
                  </Table.Cell>
                </Table.Row>
              ) : (
                orders.map((order) => {
                  const payment =
                    paymentStyles[order.paymentStatus];

                  return (
                    <Table.Row
                      key={order.id}
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                    >
                      <Table.Cell px={3} py={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.800"
                          whiteSpace="nowrap"
                        >
                          {order.orderNumber}
                        </Text>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color="gray.700"
                          whiteSpace="nowrap"
                        >
                          {getCustomerName(order)}
                        </Text>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        <Text
                          fontSize="xs"
                          color="gray.600"
                          whiteSpace="nowrap"
                        >
                          {formatDate(order.createdAt)}
                        </Text>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        <Text fontSize="sm" color="gray.700">
                          {order.items?.length ?? 0}
                        </Text>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.800"
                          whiteSpace="nowrap"
                        >
                          {formatCurrency(order.totalAmount)}
                        </Text>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        <Badge
                          colorPalette={payment.colorPalette}
                          variant="subtle"
                          borderRadius="md"
                          px={2}
                          py={1}
                          fontSize="xs"
                          fontWeight="600"
                          whiteSpace="nowrap"
                        >
                          {payment.label}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        {renderStatus(order)}
                      </Table.Cell>

                      <Table.Cell px={3} py={2}>
                        {renderActions(order)}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>

      {/* Confirm order dialog */}
      <Dialog.Root
        open={confirmOrder !== null}
        onOpenChange={(details) => {
          if (!details.open && !confirming) {
            setConfirmOrder(null);
          }
        }}
        size="sm"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm Order</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {confirmOrder && (
                <VStack align="stretch" gap={3}>
                  <Text fontSize="sm" color="gray.600">
                    Are you sure you want to confirm this order?
                  </Text>

                  <Box
                    p={3}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <Text fontSize="xs" color="gray.500">
                      ORDER NUMBER
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {confirmOrder.orderNumber}
                    </Text>

                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="sm" color="gray.600">
                        Total
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        {formatCurrency(confirmOrder.totalAmount)}
                      </Text>
                    </HStack>
                  </Box>

                  <Text fontSize="xs" color="orange.700">
                    Confirming this order may allocate stock according
                    to your backend order processing rules.
                  </Text>
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                size="sm"
                variant="outline"
                disabled={confirming}
                onClick={() => setConfirmOrder(null)}
              >
                Keep Pending
              </Button>

              <Button
                size="sm"
                colorPalette="blue"
                onClick={handleConfirmOrder}
                loading={confirming}
              >
                <FiCheck />
                Confirm Order
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Cancel order dialog */}
      <Dialog.Root
        open={cancelOrder !== null}
        onOpenChange={(details) => {
          if (!details.open && !cancelling) {
            setCancelOrder(null);
          }
        }}
        size="sm"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Cancel Order</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {cancelOrder && (
                <VStack align="stretch" gap={3}>
                  <Text fontSize="sm" color="gray.600">
                    Are you sure you want to cancel this order?
                  </Text>

                  <Box
                    p={3}
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.100"
                    borderRadius="md"
                  >
                    <Text fontSize="xs" color="red.600">
                      ORDER NUMBER
                    </Text>
                    <Text fontWeight="700" fontSize="sm" color="red.800">
                      {cancelOrder.orderNumber}
                    </Text>

                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="sm" color="gray.600">
                        Current status
                      </Text>
                      <Badge colorPalette="orange">
                        {statusStyles[cancelOrder.status].label}
                      </Badge>
                    </HStack>
                  </Box>

                  <Text fontSize="xs" color="gray.600">
                    The backend will handle any stock restoration
                    required when cancelling this order.
                  </Text>
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                size="sm"
                variant="outline"
                disabled={cancelling}
                onClick={() => setCancelOrder(null)}
              >
                Keep Order
              </Button>

              <Button
                size="sm"
                colorPalette="red"
                onClick={handleCancelOrder}
                loading={cancelling}
              >
                <FiX />
                Cancel Order
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default OrderTable;
