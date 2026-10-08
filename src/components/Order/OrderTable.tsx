import {
    Box,
    Button,
    Dialog,
    HStack,
    NativeSelect,
    Table,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
    FiCheck,
    FiEye,
    FiPrinter,
    FiX,
} from "react-icons/fi";

interface OrderCustomer {
    id: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface OrderItem {
    id: number;
    quantity: number;
}

interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED";
    paymentStatus:
        | "PENDING"
        | "PAID"
        | "PARTIAL"
        | "REFUNDED";
    paymentMethod:
        | "CASH"
        | "CARD"
        | "BANK_TRANSFER"
        | "OTHER"
        | null;
    totalAmount: number;
    customer?: OrderCustomer | null;
    items: OrderItem[];
}

interface OrderTableProps {
    orders: Order[];
    onViewOrder?: (
        order: Order
    ) => void;
    onConfirmOrder?: (
        order: Order
    ) => Promise<void> | void;
    onCancelOrder?: (
        order: Order
    ) => Promise<void> | void;
    onPrintOrder?: (
        order: Order
    ) => void;
}

const OrderTable = ({
    orders,
    onViewOrder,
    onConfirmOrder,
    onCancelOrder,
    onPrintOrder,
}: OrderTableProps) => {
    const [confirmOrder, setConfirmOrder] =
        useState<Order | null>(null);

    const [cancelOrder, setCancelOrder] =
        useState<Order | null>(null);

    const [confirming, setConfirming] =
        useState(false);

    const [cancelling, setCancelling] =
        useState(false);

    const formatCurrency = (
        amount: number
    ) => {
        return `Rs. ${Number(
            amount || 0
        ).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (
        date: string
    ) => {
        return new Date(
            date
        ).toLocaleDateString("en-LK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getCustomerName = (
        customer?: OrderCustomer | null
    ) => {
        if (!customer) {
            return "Walk-in Customer";
        }

        const name =
            `${customer.firstName || ""} ${
                customer.lastName || ""
            }`.trim();

        return (
            name || "Registered Customer"
        );
    };

    const getStatusStyle = (
        status: Order["status"]
    ) => {
        switch (status) {
            case "PENDING":
                return {
                    bg: "orange.50",
                    color: "orange.700",
                    borderColor:
                        "orange.200",
                    label: "Pending",
                };

            case "CONFIRMED":
                return {
                    bg: "blue.50",
                    color: "blue.700",
                    borderColor:
                        "blue.200",
                    label: "Confirmed",
                };

            case "COMPLETED":
                return {
                    bg: "green.50",
                    color: "green.700",
                    borderColor:
                        "green.200",
                    label: "Completed",
                };

            case "CANCELLED":
                return {
                    bg: "red.50",
                    color: "red.700",
                    borderColor:
                        "red.200",
                    label: "Cancelled",
                };

            default:
                return {
                    bg: "gray.50",
                    color: "gray.700",
                    borderColor:
                        "gray.200",
                    label: status,
                };
        }
    };

    const getPaymentStyle = (
        paymentStatus: Order["paymentStatus"]
    ) => {
        switch (paymentStatus) {
            case "PENDING":
                return {
                    bg: "orange.50",
                    color: "orange.700",
                    borderColor:
                        "orange.200",
                };

            case "PARTIAL":
                return {
                    bg: "yellow.50",
                    color: "yellow.700",
                    borderColor:
                        "yellow.200",
                };

            case "PAID":
                return {
                    bg: "green.50",
                    color: "green.700",
                    borderColor:
                        "green.200",
                };

            case "REFUNDED":
                return {
                    bg: "red.50",
                    color: "red.700",
                    borderColor:
                        "red.200",
                };

            default:
                return {
                    bg: "gray.50",
                    color: "gray.700",
                    borderColor:
                        "gray.200",
                };
        }
    };

    const handleStatusChange = (
        order: Order,
        newStatus: string
    ) => {
        if (
            order.status === "PENDING" &&
            newStatus === "CONFIRMED"
        ) {
            setConfirmOrder(order);
        }
    };

    const handleConfirmOrder =
        async () => {
            if (
                !confirmOrder ||
                confirming
            ) {
                return;
            }

            try {
                setConfirming(true);

                await onConfirmOrder?.(
                    confirmOrder
                );

                setConfirmOrder(null);
            } catch (error) {
                console.error(
                    "Confirm Order Dialog Error:",
                    error
                );
            } finally {
                setConfirming(false);
            }
        };

    const handleCancelOrder =
        async () => {
            if (
                !cancelOrder ||
                cancelling
            ) {
                return;
            }

            try {
                setCancelling(true);

                await onCancelOrder?.(
                    cancelOrder
                );

                setCancelOrder(null);
            } catch (error) {
                console.error(
                    "Cancel Order Dialog Error:",
                    error
                );
            } finally {
                setCancelling(false);
            }
        };

    const renderStatus = (
        order: Order
    ) => {
        const style =
            getStatusStyle(
                order.status
            );

        if (
            order.status === "PENDING"
        ) {
            return (
                <NativeSelect.Root
                    size="sm"
                    width="145px"
                >
                    <NativeSelect.Field
                        value={
                            order.status
                        }
                        onChange={(
                            event
                        ) =>
                            handleStatusChange(
                                order,
                                event.target
                                    .value
                            )
                        }
                        bg={style.bg}
                        color={
                            style.color
                        }
                        borderColor={
                            style.borderColor
                        }
                        borderRadius="full"
                        fontWeight="700"
                        fontSize="xs"
                        cursor="pointer"
                    >
                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>
                    </NativeSelect.Field>

                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            );
        }

        return (
            <Box
                display="inline-flex"
                alignItems="center"
                px={3}
                py={1.5}
                borderRadius="full"
                bg={style.bg}
                color={style.color}
                border="1px solid"
                borderColor={
                    style.borderColor
                }
                fontSize="xs"
                fontWeight="700"
                whiteSpace="nowrap"
            >
                {style.label}
            </Box>
        );
    };

    const renderActions = (
        order: Order
    ) => {
        return (
            <HStack
                gap={2}
                justify="center"
                flexWrap="nowrap"
                whiteSpace="nowrap"
            >
                <Button
                    size="sm"
                    variant="outline"
                    colorPalette="blue"
                    onClick={() =>
                        onViewOrder?.(
                            order
                        )
                    }
                >
                    <FiEye />
                    View
                </Button>

                {(order.status ===
                    "PENDING" ||
                    order.status ===
                        "CONFIRMED") && (
                    <Button
                        size="sm"
                        variant="outline"
                        colorPalette="red"
                        onClick={() =>
                            setCancelOrder(
                                order
                            )
                        }
                    >
                        <FiX />
                        Cancel
                    </Button>
                )}

                <Button
                    size="sm"
                    variant="outline"
                    colorPalette="gray"
                    onClick={() =>
                        onPrintOrder?.(
                            order
                        )
                    }
                >
                    <FiPrinter />
                    Print
                </Button>
            </HStack>
        );
    };

    return (
        <>
            <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
            >
                <Box
                    overflowX="auto"
                    width="100%"
                >
                    <Table.Root
                        variant="outline"
                        width="100%"
                    >
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    ORDER
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    CUSTOMER
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    DATE
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    ITEMS
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    TOTAL
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    PAYMENT
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                >
                                    STATUS
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    px={4}
                                    py={4}
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="gray.600"
                                    whiteSpace="nowrap"
                                    textAlign="center"
                                >
                                    ACTIONS
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {orders.length ===
                            0 ? (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={8}
                                        py={12}
                                        textAlign="center"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                        >
                                            No orders
                                            found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                orders.map(
                                    (
                                        order
                                    ) => {
                                        const paymentStyle =
                                            getPaymentStyle(
                                                order.paymentStatus
                                            );

                                        return (
                                            <Table.Row
                                                key={
                                                    order.id
                                                }
                                                _hover={{
                                                    bg: "gray.50",
                                                }}
                                            >
                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                        color="gray.800"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {
                                                            order.orderNumber
                                                        }
                                                    </Text>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Box>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="600"
                                                            color="gray.800"
                                                        >
                                                            {getCustomerName(
                                                                order.customer
                                                            )}
                                                        </Text>

                                                        {order
                                                            .customer
                                                            ?.phone && (
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.500"
                                                                mt={
                                                                    0.5
                                                                }
                                                            >
                                                                {
                                                                    order
                                                                        .customer
                                                                        .phone
                                                                }
                                                            </Text>
                                                        )}
                                                    </Box>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.600"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </Text>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.700"
                                                        fontWeight="600"
                                                    >
                                                        {
                                                            order
                                                                .items
                                                                ?.length
                                                        }
                                                    </Text>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                        color="gray.800"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {formatCurrency(
                                                            order.totalAmount
                                                        )}
                                                    </Text>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    <Box
                                                        display="inline-flex"
                                                        alignItems="center"
                                                        px={
                                                            3
                                                        }
                                                        py={
                                                            1.5
                                                        }
                                                        borderRadius="full"
                                                        bg={
                                                            paymentStyle.bg
                                                        }
                                                        color={
                                                            paymentStyle.color
                                                        }
                                                        border="1px solid"
                                                        borderColor={
                                                            paymentStyle.borderColor
                                                        }
                                                        fontSize="xs"
                                                        fontWeight="700"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {
                                                            order.paymentStatus
                                                        }
                                                    </Box>
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                >
                                                    {renderStatus(
                                                        order
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell
                                                    px={
                                                        4
                                                    }
                                                    py={
                                                        4
                                                    }
                                                    whiteSpace="nowrap"
                                                >
                                                    {renderActions(
                                                        order
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    }
                                )
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>

            {/* Confirm Order Dialog */}

            <Dialog.Root
                open={
                    confirmOrder !==
                    null
                }
                onOpenChange={(
                    details
                ) => {
                    if (
                        !details.open &&
                        !confirming
                    ) {
                        setConfirmOrder(
                            null
                        );
                    }
                }}
                size="md"
            >
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Confirm Order
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            {confirmOrder && (
                                <Box>
                                    <Box
                                        p={
                                            4
                                        }
                                        bg="blue.50"
                                        border="1px solid"
                                        borderColor="blue.100"
                                        borderRadius="lg"
                                        mb={
                                            5
                                        }
                                    >
                                        <HStack
                                            align="flex-start"
                                            gap={
                                                3
                                            }
                                        >
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                w="38px"
                                                h="38px"
                                                borderRadius="full"
                                                bg="blue.100"
                                                color="blue.600"
                                                flexShrink={
                                                    0
                                                }
                                            >
                                                <FiCheck />
                                            </Box>

                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                    color="blue.800"
                                                >
                                                    Ready to
                                                    confirm
                                                </Text>

                                                <Text
                                                    mt={
                                                        1
                                                    }
                                                    fontSize="xs"
                                                    color="blue.700"
                                                    lineHeight="1.6"
                                                >
                                                    Please
                                                    review
                                                    the
                                                    order
                                                    before
                                                    confirming
                                                    it.
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Box>

                                    <Box
                                        p={
                                            4
                                        }
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                        mb={
                                            4
                                        }
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color="gray.500"
                                        >
                                            ORDER
                                            NUMBER
                                        </Text>

                                        <Text
                                            mt={
                                                1
                                            }
                                            fontSize="md"
                                            fontWeight="700"
                                            color="gray.800"
                                        >
                                            {
                                                confirmOrder.orderNumber
                                            }
                                        </Text>
                                    </Box>

                                    <HStack
                                        justify="space-between"
                                        p={
                                            4
                                        }
                                        bg="gray.50"
                                        borderRadius="lg"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            Order
                                            Total
                                        </Text>

                                        <Text
                                            fontSize="md"
                                            fontWeight="700"
                                            color="gray.800"
                                        >
                                            {formatCurrency(
                                                confirmOrder.totalAmount
                                            )}
                                        </Text>
                                    </HStack>

                                    <Box
                                        mt={
                                            4
                                        }
                                        p={
                                            4
                                        }
                                        bg="orange.50"
                                        border="1px solid"
                                        borderColor="orange.100"
                                        borderRadius="lg"
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="orange.800"
                                        >
                                            Stock
                                            will be
                                            allocated
                                        </Text>

                                        <Text
                                            mt={
                                                1
                                            }
                                            fontSize="xs"
                                            color="orange.700"
                                            lineHeight="1.6"
                                        >
                                            Confirming
                                            this
                                            order
                                            will
                                            allocate
                                            stock
                                            according
                                            to the
                                            FEFO
                                            process
                                            and
                                            reduce
                                            the
                                            available
                                            stock
                                            quantity.
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                disabled={
                                    confirming
                                }
                                onClick={() =>
                                    setConfirmOrder(
                                        null
                                    )
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                colorPalette="blue"
                                onClick={
                                    handleConfirmOrder
                                }
                                loading={
                                    confirming
                                }
                                loadingText="Confirming..."
                            >
                                <FiCheck />
                                Confirm Order
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

            {/* Cancel Order Dialog */}

            <Dialog.Root
                open={
                    cancelOrder !==
                    null
                }
                onOpenChange={(
                    details
                ) => {
                    if (
                        !details.open &&
                        !cancelling
                    ) {
                        setCancelOrder(
                            null
                        );
                    }
                }}
                size="md"
            >
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Cancel Order
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            {cancelOrder && (
                                <Box>
                                    <Box
                                        p={
                                            4
                                        }
                                        bg="red.50"
                                        border="1px solid"
                                        borderColor="red.100"
                                        borderRadius="lg"
                                        mb={
                                            5
                                        }
                                    >
                                        <HStack
                                            align="flex-start"
                                            gap={
                                                3
                                            }
                                        >
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                w="38px"
                                                h="38px"
                                                borderRadius="full"
                                                bg="red.100"
                                                color="red.600"
                                                flexShrink={
                                                    0
                                                }
                                            >
                                                <FiX />
                                            </Box>

                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                    color="red.800"
                                                >
                                                    Cancel
                                                    this
                                                    order?
                                                </Text>

                                                <Text
                                                    mt={
                                                        1
                                                    }
                                                    fontSize="xs"
                                                    color="red.700"
                                                    lineHeight="1.6"
                                                >
                                                    This
                                                    action
                                                    cannot
                                                    be
                                                    undone
                                                    after
                                                    the
                                                    order
                                                    is
                                                    cancelled.
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Box>

                                    <Box
                                        p={
                                            4
                                        }
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color="gray.500"
                                        >
                                            ORDER
                                            NUMBER
                                        </Text>

                                        <Text
                                            mt={
                                                1
                                            }
                                            fontSize="md"
                                            fontWeight="700"
                                            color="gray.800"
                                        >
                                            {
                                                cancelOrder.orderNumber
                                            }
                                        </Text>

                                        <HStack
                                            mt={
                                                4
                                            }
                                            justify="space-between"
                                        >
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                Current
                                                Status
                                            </Text>

                                            <Text
                                                fontSize="sm"
                                                fontWeight="700"
                                                color={
                                                    cancelOrder.status ===
                                                    "CONFIRMED"
                                                        ? "blue.700"
                                                        : "orange.700"
                                                }
                                            >
                                                {
                                                    cancelOrder.status
                                                }
                                            </Text>
                                        </HStack>
                                    </Box>

                                    <Box
                                        mt={
                                            4
                                        }
                                        p={
                                            4
                                        }
                                        bg="gray.50"
                                        borderRadius="lg"
                                    >
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            lineHeight="1.6"
                                        >
                                            {cancelOrder.status ===
                                            "CONFIRMED"
                                                ? "The allocated stock will be returned to inventory."
                                                : "No stock will be restored because stock has not been allocated yet."}
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                disabled={
                                    cancelling
                                }
                                onClick={() =>
                                    setCancelOrder(
                                        null
                                    )
                                }
                            >
                                Keep Order
                            </Button>

                            <Button
                                colorPalette="red"
                                onClick={
                                    handleCancelOrder
                                }
                                loading={
                                    cancelling
                                }
                                loadingText="Cancelling..."
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