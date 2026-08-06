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

import axios from "axios";
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

        axios.get(

            import.meta.env.VITE_BACKEND_URL +

            "/stock-batch/" +

            batchNumber

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

                    <Dialog.Content maxW="1000px">

                        <Dialog.CloseTrigger asChild>

                            <CloseButton />

                        </Dialog.CloseTrigger>

                        <Dialog.Header>

                            <Dialog.Title>

                                Goods Received Note

                            </Dialog.Title>

                        </Dialog.Header>

                        <Dialog.Body>

                            {

                                batch && (

                                    <>

                                        <Flex
                                            gap={10}
                                            wrap="wrap"
                                            mb={8}
                                        >

                                            <VStack
                                                align="start"
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
                                            >

                                                <Text>

                                                    <b>

                                                        Supplier

                                                    </b>

                                                </Text>

                                                <Text>

                                                    {

                                                        batch.supplier
                                                            .firstName

                                                    }

                                                    {" "}

                                                    {

                                                        batch.supplier
                                                            .lastName

                                                    }

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

                                                            Selling

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

                                                                        Rs.

                                                                        {

                                                                            item.sellingPrice.toFixed(
                                                                                2
                                                                            )

                                                                        }

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