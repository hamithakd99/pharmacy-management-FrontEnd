import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";

export type GRNItem = {
    id: number;
    productId: string;
    productName: string;
    brand?: string | null;
    receivedQuantity: number;
    buyingPrice: number;
    sellingPrice: number;
    lineBuyingTotal: number;
    lineSellingTotal: number;
};

export type GRNHistory = {
    id: number;
    batchNumber: string;
    invoiceNumber: string;
    receivedDate: string;
    paymentStatus: string;
    invoiceDiscountAmount: number;
    totalBuyingValue: number;
    totalSellingValue: number;
    items: GRNItem[];
};


export type PurchaseOrderItem = {

    id: number;
    productId: number;
    quantity: number;
    product?: {

        id: number;
        productId: string;
        name: string;
        brand?: string | null;

    };

};


export type PurchaseOrder = {

    id: number;
    orderNumber: string;
    supplierId: number;
    createdAt: string;
    status: string;
    supplier?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string | null;
    contactNumber?: string | null;
} | null;

    items: PurchaseOrderItem[];
    receivingHistory: GRNHistory[];

    summary: {
        totalOrderedItems: number;
        totalReceivedItems: number;
        totalRemainingItems: number;
        totalBuyingValue: number;
        totalSellingValue: number;
        totalGRNs: number;
    };

};


type POTableProps = {

    purchaseOrders: PurchaseOrder[];

    onView: (purchaseOrder: PurchaseOrder) => void;
    onCreateGRN: (purchaseOrder: PurchaseOrder) => void;
    onEdit: (purchaseOrder: PurchaseOrder) => void;
    onDelete: (purchaseOrder: PurchaseOrder) => void;
    onPrint: (purchaseOrder: PurchaseOrder) => void;

};


export default function POTable({

    purchaseOrders,
    onView,
    onEdit,
    onDelete,
    onCreateGRN,
    onPrint

}: POTableProps) {


    function getStatusColor(
        status: string
    ) {

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


    function getStatusLabel(
        status: string
    ) {

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
        <>
            <VStack
                display={{ base: "flex", md: "none" }}
                align="stretch"
                gap={2}
            >
                {purchaseOrders.length === 0 ? (
                    <Box borderWidth="1px" rounded="lg" p={8} textAlign="center">
                        <Text color="gray.500">No purchase orders found.</Text>
                    </Box>
                ) : (
                    purchaseOrders.map((purchaseOrder) => {
                        const isLocked =
                            purchaseOrder.status === "PARTIALLY_RECEIVED" ||
                            purchaseOrder.status === "COMPLETED" ||
                            purchaseOrder.status === "CANCELLED";
                        const canCreateGRN =
                            purchaseOrder.status === "PENDING" ||
                            purchaseOrder.status === "PARTIALLY_RECEIVED";

                        return (
                            <Box
                                key={purchaseOrder.id}
                                borderWidth="1px"
                                borderColor="gray.200"
                                rounded="lg"
                                p={3}
                            >
                                <Flex justify="space-between" align="start" gap={3}>
                                    <Box minW={0}>
                                        <Text fontWeight="bold" fontSize="sm">
                                            {purchaseOrder.orderNumber}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500" truncate>
                                            {purchaseOrder.supplier
                                                ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
                                                : "No supplier"}
                                        </Text>
                                    </Box>
                                    <Badge
                                        colorPalette={getStatusColor(purchaseOrder.status)}
                                        flexShrink={0}
                                    >
                                        {getStatusLabel(purchaseOrder.status)}
                                    </Badge>
                                </Flex>

                                <Flex
                                    justify="space-between"
                                    mt={3}
                                    fontSize="xs"
                                    color="gray.600"
                                >
                                    <Text>
                                        {new Date(purchaseOrder.createdAt).toLocaleDateString("en-GB")}
                                    </Text>
                                    <Text>
                                        {purchaseOrder.items?.length ?? 0} items
                                    </Text>
                                </Flex>

                                <Flex gap={1} mt={3} flexWrap="wrap">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        colorPalette="blue"
                                        onClick={() => onView(purchaseOrder)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="xs"
                                        colorPalette="green"
                                        disabled={!canCreateGRN}
                                        onClick={() => onCreateGRN(purchaseOrder)}
                                    >
                                        GRN
                                    </Button>
                                    {purchaseOrder.status === "PENDING" && (
                                        <>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                colorPalette="orange"
                                                disabled={isLocked}
                                                onClick={() => onEdit(purchaseOrder)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                colorPalette="red"
                                                disabled={isLocked}
                                                onClick={() => onDelete(purchaseOrder)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="xs"
                                        colorPalette="gray"
                                        onClick={() => onPrint(purchaseOrder)}
                                    >
                                        Print
                                    </Button>
                                </Flex>
                            </Box>
                        );
                    })
                )}
            </VStack>

            <Table.ScrollArea
                display={{ base: "none", md: "block" }}
                borderWidth="1px"
                rounded="lg"
            >

            <Table.Root
                variant="outline"
                size="sm"
            >

                <Table.Header>

                    <Table.Row>

                        <Table.ColumnHeader>
                            PO Number
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Supplier
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Created Date
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Items
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Status
                        </Table.ColumnHeader>

                        <Table.ColumnHeader>
                            Actions
                        </Table.ColumnHeader>

                    </Table.Row>

                </Table.Header>


                <Table.Body>

                    {purchaseOrders.length === 0 ? (

                        <Table.Row>

                            <Table.Cell
                                colSpan={6}
                                textAlign="center"
                                py={10}
                            >

                                <Text
                                    color="gray.500"
                                >

                                    No purchase orders found.

                                </Text>

                            </Table.Cell>

                        </Table.Row>

                    ) : (

                        purchaseOrders.map(
                            (purchaseOrder) => {
                                const isLocked =
                                    purchaseOrder.status ===
                                    "PARTIALLY_RECEIVED" ||
                                    purchaseOrder.status ===
                                    "COMPLETED" ||
                                    purchaseOrder.status ===
                                    "CANCELLED";

                                const canCreateGRN =
                                    purchaseOrder.status ===
                                    "PENDING" ||
                                    purchaseOrder.status ===
                                    "PARTIALLY_RECEIVED";

                                return (


                                    <Table.Row
                                        key={
                                            purchaseOrder.id
                                        }
                                    >

                                        {/* PO NUMBER */}

                                        <Table.Cell>

                                            <Text
                                                fontWeight="bold"
                                            >

                                                {
                                                    purchaseOrder.orderNumber
                                                }

                                            </Text>

                                        </Table.Cell>


                                        {/* SUPPLIER */}

                                        <Table.Cell>

                                            <Text>

                                                {
                                                    purchaseOrder.supplier
                                                        ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
                                                        : "-"
                                                }

                                            </Text>

                                        </Table.Cell>


                                        {/* DATE */}

                                        <Table.Cell>

                                            {new Date(
                                                purchaseOrder.createdAt
                                            ).toLocaleDateString(
                                                "en-GB"
                                            )}

                                        </Table.Cell>


                                        {/* ITEMS */}

                                        <Table.Cell>

                                            {
                                                purchaseOrder.items
                                                    ?.length ?? 0
                                            }

                                        </Table.Cell>


                                        {/* STATUS */}

                                        <Table.Cell>

                                            <Badge
                                                colorPalette={
                                                    getStatusColor(
                                                        purchaseOrder.status
                                                    )
                                                }
                                            >

                                                {
                                                    getStatusLabel(
                                                        purchaseOrder.status
                                                    )
                                                }

                                            </Badge>

                                        </Table.Cell>


                                        {/* ACTIONS */}

                                        <Table.Cell>

                                            <HStack
                                                gap={2}
                                            >

                                                <Button

                                                    size="sm"

                                                    variant="outline"

                                                    colorPalette="blue"

                                                    onClick={() => {

                                                        onView(
                                                            purchaseOrder
                                                        )
                                                    }
                                                    }

                                                >

                                                    View

                                                </Button>

                                                <Button
                                                    size="sm"
                                                    colorPalette="green"
                                                    disabled={!canCreateGRN}
                                                    onClick={() =>
                                                        onCreateGRN(purchaseOrder)
                                                    }
                                                >
                                                    GRN
                                                </Button>


                                                {purchaseOrder.status ===
                                                    "PENDING" && (

                                                        <Button

                                                            size="sm"

                                                            variant="outline"

                                                            colorPalette="orange"

                                                            disabled={isLocked}

                                                            onClick={() =>
                                                                onEdit(
                                                                    purchaseOrder
                                                                )
                                                            }

                                                        >

                                                            Edit

                                                        </Button>

                                                    )}


                                                {purchaseOrder.status ===
                                                    "PENDING" && (

                                                        <Button

                                                            size="sm"

                                                            variant="outline"

                                                            colorPalette="red"

                                                            disabled={isLocked}

                                                            onClick={() =>
                                                                onDelete(
                                                                    purchaseOrder
                                                                )
                                                            }

                                                        >

                                                            Cancel

                                                        </Button>


                                                    )}

                                                <Button
                                                    size="sm"
                                                    colorPalette="gray"
                                                    onClick={() =>
                                                        onPrint(purchaseOrder)
                                                    }
                                                >
                                                    Print
                                                </Button>

                                            </HStack>

                                        </Table.Cell>

                                    </Table.Row>

                                )

                            }

                        )

                    )}

                </Table.Body>

            </Table.Root>

            </Table.ScrollArea>
        </>

    );

}