import {Badge, Box, Button, Dialog, Flex, Heading, Portal, Table, Text, VStack } from "@chakra-ui/react";

import type { PurchaseOrder } from "./POTable";
import POReceivingHistory from "./POReceivingHistory";

type POViewDialogProps = {
    open: boolean;
    onClose: () => void;
    purchaseOrder: PurchaseOrder | null;
};

export default function POViewDialog({
    open,
    onClose,
    purchaseOrder,
}: POViewDialogProps) {

    function getStatusColor(status: string) {
        switch (status) {
            case "PENDING":
                return "orange";
            case "PARTIALLY_RECEIVED":
                return "blue";
            case "COMPLETED":
                return "green";
            case "CANCELLED":
                return "red";
            default:
                return "gray";
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case "PENDING":
                return "Pending";
            case "PARTIALLY_RECEIVED":
                return "Partially Received";
            case "COMPLETED":
                return "Completed";
            case "CANCELLED":
                return "Cancelled";
            default:
                return status;
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) {
                    onClose();
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="1050px"
                        maxH="90vh"
                        rounded="xl"
                        overflow="hidden"
                    >
                        {/* ================= HEADER ================= */}

                        <Dialog.Header
                            px={6}
                            py={4}
                            borderBottomWidth="1px"
                            borderColor="gray.200"
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                                width="100%"
                                gap={4}
                            >
                                <Box>
                                    <Dialog.Title
                                        fontSize="xl"
                                        fontWeight="700"
                                    >
                                        Purchase Order Details
                                    </Dialog.Title>

                                    {purchaseOrder && (
                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                            mt={0.5}
                                        >
                                            {purchaseOrder.orderNumber}
                                        </Text>
                                    )}
                                </Box>

                                {purchaseOrder && (
                                    <Badge
                                        colorPalette={getStatusColor(
                                            purchaseOrder.status
                                        )}
                                        px={3}
                                        py={1.5}
                                        rounded="full"
                                        fontSize="xs"
                                    >
                                        {getStatusLabel(
                                            purchaseOrder.status
                                        )}
                                    </Badge>
                                )}
                            </Flex>
                        </Dialog.Header>

                        {/* ================= BODY ================= */}

                        <Dialog.Body
                            px={6}
                            py={5}
                            overflowY="auto"
                        >
                            {!purchaseOrder ? (
                                <Text color="gray.500">
                                    No purchase order selected.
                                </Text>
                            ) : (
                                <VStack
                                    align="stretch"
                                    gap={5}
                                >
                                    {/* ================= PO INFORMATION ================= */}

                                    <Box>
                                        <Heading
                                            size="sm"
                                            mb={3}
                                            color="gray.700"
                                        >
                                            Purchase Order Information
                                        </Heading>

                                        <Flex
                                            gap={3}
                                            wrap="wrap"
                                        >
                                            {/* PO NUMBER */}

                                            <Box
                                                bg="gray.50"
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                rounded="lg"
                                                px={4}
                                                py={3}
                                                flex="1"
                                                minW="190px"
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    PO Number
                                                </Text>

                                                <Text
                                                    fontWeight="700"
                                                    fontSize="sm"
                                                >
                                                    {
                                                        purchaseOrder.orderNumber
                                                    }
                                                </Text>
                                            </Box>

                                            {/* SUPPLIER */}

                                            <Box
                                                bg="gray.50"
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                rounded="lg"
                                                px={4}
                                                py={3}
                                                flex="1"
                                                minW="190px"
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Supplier
                                                </Text>

                                                <Text
                                                    fontWeight="700"
                                                    fontSize="sm"
                                                >
                                                    {purchaseOrder.supplier
                                                        ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
                                                        : "-"}
                                                </Text>
                                            </Box>

                                            {/* CREATED DATE */}

                                            <Box
                                                bg="gray.50"
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                rounded="lg"
                                                px={4}
                                                py={3}
                                                flex="1"
                                                minW="190px"
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Created Date
                                                </Text>

                                                <Text
                                                    fontWeight="700"
                                                    fontSize="sm"
                                                >
                                                    {new Date(
                                                        purchaseOrder.createdAt
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </Text>
                                            </Box>

                                            {/* STATUS */}

                                            <Box
                                                bg="gray.50"
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                rounded="lg"
                                                px={4}
                                                py={3}
                                                flex="1"
                                                minW="190px"
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Status
                                                </Text>

                                                <Badge
                                                    colorPalette={getStatusColor(
                                                        purchaseOrder.status
                                                    )}
                                                    px={2.5}
                                                    py={1}
                                                    rounded="full"
                                                    fontSize="xs"
                                                >
                                                    {getStatusLabel(
                                                        purchaseOrder.status
                                                    )}
                                                </Badge>
                                            </Box>
                                        </Flex>
                                    </Box>

                                    {/* ================= ORDERED PRODUCTS ================= */}

                                    <Box>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            mb={3}
                                        >
                                            <Heading
                                                size="sm"
                                                color="gray.700"
                                            >
                                                Ordered Products
                                            </Heading>

                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {purchaseOrder.items.length}{" "}
                                                item
                                                {purchaseOrder.items.length !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </Text>
                                        </Flex>

                                        <Table.ScrollArea
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                            rounded="lg"
                                            overflowX="auto"
                                        >
                                            <Table.Root
                                                variant="outline"
                                                size="sm"
                                                minW="650px"
                                            >
                                                <Table.Header>
                                                    <Table.Row bg="gray.50">
                                                        <Table.ColumnHeader
                                                            w="50px"
                                                        >
                                                            #
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>
                                                            Product ID
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>
                                                            Product
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>
                                                            Brand
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader textAlign="center">
                                                            Quantity
                                                        </Table.ColumnHeader>
                                                    </Table.Row>
                                                </Table.Header>

                                                <Table.Body>
                                                    {purchaseOrder.items.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <Table.Row
                                                                key={
                                                                    item.id
                                                                }
                                                                _hover={{
                                                                    bg: "gray.50",
                                                                }}
                                                            >
                                                                <Table.Cell
                                                                    color="gray.500"
                                                                >
                                                                    {
                                                                        index +
                                                                        1
                                                                    }
                                                                </Table.Cell>

                                                                <Table.Cell
                                                                    fontWeight="600"
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.productId ??
                                                                        "-"
                                                                    }
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <Text
                                                                        fontWeight="500"
                                                                    >
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.name ??
                                                                            "-"
                                                                        }
                                                                    </Text>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.brand ??
                                                                        "-"
                                                                    }
                                                                </Table.Cell>

                                                                <Table.Cell textAlign="center">
                                                                    <Badge
                                                                        colorPalette="blue"
                                                                        variant="subtle"
                                                                        px={3}
                                                                        rounded="full"
                                                                    >
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </Badge>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                </Table.Body>
                                            </Table.Root>
                                        </Table.ScrollArea>
                                    </Box>

                                    {/* ================= GRN HISTORY ================= */}

                                    <POReceivingHistory
                                        receivingHistory={
                                            purchaseOrder.receivingHistory ??
                                            []
                                        }
                                    />

                                    {/* ================= TOTAL ================= */}

                                    <Flex
                                        justify="flex-end"
                                        mt={-1}
                                    >
                                        <Box
                                            bg="blue.50"
                                            borderWidth="1px"
                                            borderColor="blue.100"
                                            px={6}
                                            py={3}
                                            rounded="lg"
                                            minW="150px"
                                            textAlign="center"
                                        >
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={0.5}
                                            >
                                                Total Items
                                            </Text>

                                            <Text
                                                fontSize="xl"
                                                fontWeight="700"
                                                color="blue.700"
                                            >
                                                {
                                                    purchaseOrder.items
                                                        .length
                                                }
                                            </Text>
                                        </Box>
                                    </Flex>
                                </VStack>
                            )}
                        </Dialog.Body>

                        {/* ================= FOOTER ================= */}

                        <Dialog.Footer
                            px={6}
                            py={3}
                            borderTopWidth="1px"
                            borderColor="gray.200"
                        >
                            <Button
                                colorPalette="blue"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}