import {
    Badge,
    Box,
    Button,
    Dialog,
    Flex,
    Heading,
    Portal,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";

import type {
    PurchaseOrder,
} from "./POTable";


type POViewDialogProps = {

    open: boolean;

    onClose: () => void;

    purchaseOrder:
        PurchaseOrder | null;

};


export default function POViewDialog({

    open,

    onClose,

    purchaseOrder,

}: POViewDialogProps) {


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
                        maxW="900px"
                        maxH="90vh"
                    >

                        {/* HEADER */}

                        <Dialog.Header>

                            <Flex
                                justify="space-between"
                                align="center"
                                width="100%"
                            >

                                <Box>

                                    <Dialog.Title>

                                        Purchase Order Details

                                    </Dialog.Title>

                                    {purchaseOrder && (

                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                            mt={1}
                                        >

                                            {
                                                purchaseOrder.orderNumber
                                            }

                                        </Text>

                                    )}

                                </Box>

                                {purchaseOrder && (

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

                                )}

                            </Flex>

                        </Dialog.Header>


                        {/* BODY */}

                        <Dialog.Body>

                            {!purchaseOrder ? (

                                <Text>
                                    No purchase order selected.
                                </Text>

                            ) : (

                                <VStack
                                    align="stretch"
                                    gap={6}
                                >

                                    {/* PO INFORMATION */}

                                    <Box>

                                        <Heading
                                            size="sm"
                                            mb={4}
                                        >

                                            Purchase Order Information

                                        </Heading>


                                        <Flex
                                            gap={6}
                                            wrap="wrap"
                                        >

                                            <Box
                                                minW="200px"
                                            >

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    PO Number
                                                </Text>

                                                <Text
                                                    fontWeight="bold"
                                                >

                                                    {
                                                        purchaseOrder.orderNumber
                                                    }

                                                </Text>

                                            </Box>


                                            <Box
                                                minW="200px"
                                            >

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    Supplier
                                                </Text>

                                                <Text
                                                    fontWeight="bold"
                                                >

                                                    {
                                                        purchaseOrder.supplier
                                                            ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
                                                            : "-"
                                                    }

                                                </Text>

                                            </Box>


                                            <Box
                                                minW="200px"
                                            >

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    Created Date
                                                </Text>

                                                <Text
                                                    fontWeight="bold"
                                                >

                                                    {new Date(
                                                        purchaseOrder.createdAt
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}

                                                </Text>

                                            </Box>


                                            <Box
                                                minW="200px"
                                            >

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    Status
                                                </Text>

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

                                            </Box>

                                        </Flex>

                                    </Box>


                                    {/* PRODUCTS */}

                                    <Box>

                                        <Heading
                                            size="sm"
                                            mb={4}
                                        >

                                            Ordered Products

                                        </Heading>


                                        <Table.ScrollArea
                                            borderWidth="1px"
                                            rounded="md"
                                        >

                                            <Table.Root
                                                variant="outline"
                                            >

                                                <Table.Header>

                                                    <Table.Row>

                                                        <Table.ColumnHeader>
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

                                                        <Table.ColumnHeader>
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
                                                            >

                                                                <Table.Cell>

                                                                    {
                                                                        index + 1
                                                                    }

                                                                </Table.Cell>


                                                                <Table.Cell
                                                                    fontWeight="medium"
                                                                >

                                                                    {
                                                                        item.product
                                                                            ?.productId ??
                                                                        "-"
                                                                    }

                                                                </Table.Cell>


                                                                <Table.Cell>

                                                                    {
                                                                        item.product
                                                                            ?.name ??
                                                                        "-"
                                                                    }

                                                                </Table.Cell>


                                                                <Table.Cell>

                                                                    {
                                                                        item.product
                                                                            ?.brand ??
                                                                        "-"
                                                                    }

                                                                </Table.Cell>


                                                                <Table.Cell
                                                                    fontWeight="bold"
                                                                >

                                                                    {
                                                                        item.quantity
                                                                    }

                                                                </Table.Cell>

                                                            </Table.Row>

                                                        )
                                                    )}

                                                </Table.Body>

                                            </Table.Root>

                                        </Table.ScrollArea>

                                    </Box>


                                    {/* TOTAL */}

                                    <Flex
                                        justify="flex-end"
                                    >

                                        <Box
                                            bg="gray.50"
                                            p={4}
                                            rounded="md"
                                        >

                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >

                                                Total Items

                                            </Text>

                                            <Text
                                                fontSize="xl"
                                                fontWeight="bold"
                                            >

                                                {
                                                    purchaseOrder.items.length
                                                }

                                            </Text>

                                        </Box>

                                    </Flex>

                                </VStack>

                            )}

                        </Dialog.Body>


                        {/* FOOTER */}

                        <Dialog.Footer>

                            <Button
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