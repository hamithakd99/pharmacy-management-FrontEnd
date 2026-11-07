import api from "@/api/axios";
import {
    Badge,
    Box,
    Button,
    CloseButton,
    Dialog,
    Flex,
    HStack,
    Portal,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

type Props = {

    open: boolean;

    batchNumber?: string;

    onClose: () => void;

};

export default function GRNViewDialog({

    open,

    batchNumber,

    onClose,

}: Props) {

    const [batch, setBatch] = useState<any>();

    useEffect(() => {

        if (!batchNumber) return;

        api.get("/stock-batch/" + batchNumber

        ).then((response) => {

            setBatch(response.data.data);

        });

    }, [batchNumber]);

    return (

        <Dialog.Root
            open={open}
            onOpenChange={(e) => {

                if (!e.open) {

                    onClose();

                }

            }}
        >

            <Portal>

                <Dialog.Backdrop />

                <Dialog.Positioner>

                    <Dialog.Content
                        w="calc(100% - 1rem)"
                        maxW={{ base: "calc(100vw - 1rem)", md: "1000px" }}
                        maxH="calc(100vh - 1rem)"
                        overflow="hidden"
                    >

                        <Dialog.CloseTrigger asChild>

                            <CloseButton />

                        </Dialog.CloseTrigger>

                        <Dialog.Header
                            px={{ base: 4, sm: 6 }}
                            py={{ base: 3, sm: 4 }}
                            pr={{ base: 12, sm: 14 }}
                        >

                            <Dialog.Title fontSize={{ base: "lg", sm: "xl" }}>

                                Goods Received Note

                            </Dialog.Title>

                        </Dialog.Header>

                        <Dialog.Body
                            px={{ base: 3, sm: 6 }}
                            py={{ base: 3, sm: 5 }}
                            overflowY="auto"
                        >

                            {

                                batch && (

                                    <>

                                        <Flex
                                            gap={{ base: 4, sm: 10 }}
                                            wrap="wrap"
                                            mb={{ base: 5, sm: 8 }}
                                        >

                                            <VStack
                                                align="start"
                                                minW={{ base: "100%", sm: "180px" }}
                                            >

                                                <Text>

                                                    <b>Batch Number</b>

                                                </Text>

                                                <Text>

                                                    {batch.batchNumber}

                                                </Text>

                                                <Text>

                                                    <b>

                                                        Invoice Number

                                                    </b>

                                                </Text>

                                                <Text>

                                                    {batch.invoiceNumber}

                                                </Text>

                                                <Text>

                                                    <b>

                                                        Purchase Order

                                                    </b>

                                                </Text>

                                                <Text>

                                                    {

                                                        batch.purchaseOrder
                                                            ?.orderNumber

                                                        ??

                                                        "-"

                                                    }

                                                </Text>

                                            </VStack>

                                            <VStack
                                                align="start"
                                                minW={{ base: "100%", sm: "180px" }}
                                            >

                                                <Text>

                                                    <b>

                                                        Supplier

                                                    </b>

                                                </Text>

                                                <Text>

                                                    {batch.supplier
                                                        ? `${batch.supplier.firstName} ${batch.supplier.lastName}`
                                                        : batch.source === "OPENING_STOCK"
                                                            ? "Opening Stock"
                                                            : "N/A"}

                                                </Text>

                                                <Text>

                                                    <b>

                                                        Received Date

                                                    </b>

                                                </Text>

                                                <Text>

                                                    {

                                                        new Date(

                                                            batch.receivedDate

                                                        ).toLocaleDateString()

                                                    }

                                                </Text>

                                                <Text>

                                                    <b>

                                                        Payment Status

                                                    </b>

                                                </Text>

                                                <Badge

                                                    colorPalette={

                                                        batch.paymentStatus ===
                                                            "PAID"

                                                            ? "green"

                                                            : "orange"

                                                    }

                                                >

                                                    {

                                                        batch.paymentStatus

                                                    }

                                                </Badge>

                                            </VStack>

                                            <VStack
                                                align="start"
                                                minW={{ base: "100%", sm: "180px" }}
                                            >

                                                <Text>

                                                    <b>

                                                        Discount

                                                    </b>

                                                </Text>

                                                <Text>

                                                    Rs.

                                                    {

                                                        batch.invoiceDiscountAmount.toFixed(
                                                            2
                                                        )

                                                    }

                                                </Text>

                                            </VStack>

                                        </Flex>

                                        <Box>

                                            <Table.Root
                                                variant="outline"
                                                minW="700px"
                                            >

                                                <Table.Header>

                                                    <Table.Row>

                                                        <Table.ColumnHeader>

                                                            Product

                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>

                                                            Qty

                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>

                                                            Buying

                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>
                                                            Wholesale Price
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>
                                                            Retail Price
                                                        </Table.ColumnHeader>

                                                        <Table.ColumnHeader>

                                                            Expiry

                                                        </Table.ColumnHeader>

                                                    </Table.Row>

                                                </Table.Header>

                                                <Table.Body>

                                                    {

                                                        batch.items.map(

                                                            (item: any) => (

                                                                <Table.Row
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >

                                                                    <Table.Cell>

                                                                        {

                                                                            item.product
                                                                                .name

                                                                        }

                                                                    </Table.Cell>

                                                                    <Table.Cell>

                                                                        {

                                                                            item.receivedQuantity

                                                                        }

                                                                    </Table.Cell>

                                                                    <Table.Cell>

                                                                        Rs.

                                                                        {

                                                                            item.buyingPrice.toFixed(
                                                                                2
                                                                            )

                                                                        }

                                                                    </Table.Cell>

                                                                    <Table.Cell>
                                                                        Rs. {Number(item.sellingPrice ?? 0).toFixed(2)}
                                                                    </Table.Cell>

                                                                    <Table.Cell>
                                                                        {item.retailPrice != null
                                                                            ? `Rs. ${Number(item.retailPrice).toFixed(2)}`
                                                                            : "-"}
                                                                    </Table.Cell>

                                                                    <Table.Cell>

                                                                        {

                                                                            new Date(

                                                                                item.expiryDate

                                                                            ).toLocaleDateString()

                                                                        }

                                                                    </Table.Cell>

                                                                </Table.Row>

                                                            )

                                                        )

                                                    }

                                                </Table.Body>

                                            </Table.Root>

                                        </Box>

                                    </>

                                )

                            }

                        </Dialog.Body>

                        <Dialog.Footer>

                            <HStack>

                                <Button
                                    onClick={onClose}
                                >

                                    Close

                                </Button>

                            </HStack>

                        </Dialog.Footer>

                    </Dialog.Content>

                </Dialog.Positioner>

            </Portal>

        </Dialog.Root>

    );

}