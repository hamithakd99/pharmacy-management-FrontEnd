import {
    Badge,
    Box,
    Card,
    HStack,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";


type GRNItem = {

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


type GRNHistory = {

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


type Props = {
    receivingHistory: GRNHistory[];
};


export default function POReceivingHistory({
    receivingHistory,
}: Props) {

    // =====================================================
    // NO GRN YET
    // =====================================================

    if (
        !receivingHistory ||
        receivingHistory.length === 0
    ) {

        return (

            <Card.Root mt={6}>

                <Card.Body>

                    <Text
                        color="gray.500"
                        textAlign="center"
                    >

                        No GRN history available.

                    </Text>

                </Card.Body>

            </Card.Root>

        );

    }


    return (

        <Box mt={6}>
            <HStack
                justify="space-between"
                mb={4}
            >

                <Text
                    fontSize="lg"
                    fontWeight="bold"
                >
                    GRN / Receiving History
                </Text>


                <Badge
                    colorPalette="blue"
                    px={3}
                    py={1}
                    rounded="full"
                >

                    {receivingHistory.length} GRN
                    {receivingHistory.length !== 1
                        ? "s"
                        : ""}

                </Badge>

            </HStack>

            <VStack
                align="stretch"
                gap={4}
            >

                {receivingHistory.map(
                    (grn) => (

                        <Card.Root
                            key={grn.id}
                            variant="outline"
                        >
                            <Card.Header>

                                <HStack
                                    justify="space-between"
                                    align="start"
                                    wrap="wrap"
                                >

                                    <Box>

                                        <Text
                                            fontWeight="bold"
                                            fontSize="md"
                                        >

                                            Batch:
                                            {" "}
                                            {grn.batchNumber}

                                        </Text>


                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                        >

                                            Invoice:
                                            {" "}
                                            {grn.invoiceNumber}

                                        </Text>


                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                        >

                                            Received:
                                            {" "}

                                            {new Date(
                                                grn.receivedDate
                                            ).toLocaleDateString()}

                                        </Text>

                                    </Box>


                                    <Badge
                                        colorPalette={
                                            grn.paymentStatus ===
                                                "PAID"
                                                ? "green"
                                                : "orange"
                                        }
                                    >

                                        {
                                            grn.paymentStatus
                                        }

                                    </Badge>

                                </HStack>

                            </Card.Header>

                            <Card.Body
                                overflowX="auto"
                                pt={0}
                            >

                                <Table.Root
                                    size="sm"
                                    variant="outline"
                                    minW="750px"
                                >

                                    <Table.Header>

                                        <Table.Row>

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
                                                Received
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Buying
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Selling
                                            </Table.ColumnHeader>

                                        </Table.Row>

                                    </Table.Header>


                                    <Table.Body>

                                        {grn.items.map(
                                            (item) => (

                                                <Table.Row
                                                    key={item.id}
                                                >

                                                    <Table.Cell>

                                                        <Text
                                                            fontWeight="medium"
                                                        >

                                                            {
                                                                item.productId
                                                            }

                                                        </Text>

                                                    </Table.Cell>


                                                    <Table.Cell>

                                                        {
                                                            item.productName
                                                        }

                                                    </Table.Cell>


                                                    <Table.Cell>

                                                        {
                                                            item.brand ||
                                                            "-"
                                                        }

                                                    </Table.Cell>


                                                    <Table.Cell>

                                                        <Text
                                                            fontWeight="bold"
                                                        >

                                                            {
                                                                item.receivedQuantity
                                                            }

                                                        </Text>

                                                    </Table.Cell>


                                                    <Table.Cell>

                                                        Rs.{" "}

                                                        {
                                                            item.buyingPrice.toLocaleString()
                                                        }

                                                    </Table.Cell>


                                                    <Table.Cell>

                                                        Rs.{" "}

                                                        {
                                                            item.sellingPrice.toLocaleString()
                                                        }

                                                    </Table.Cell>

                                                </Table.Row>

                                            )
                                        )}

                                    </Table.Body>

                                </Table.Root>

                                <HStack
                                    justify="flex-end"
                                    gap={6}
                                    mt={4}
                                    flexWrap="wrap"
                                >

                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                    >

                                        Buying Total:

                                        {" "}

                                        <Text
                                            as="span"
                                            fontWeight="bold"
                                            color="gray.800"
                                        >

                                            Rs.{" "}

                                            {grn.totalBuyingValue.toLocaleString()}

                                        </Text>

                                    </Text>


                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                    >

                                        Selling Total:

                                        {" "}

                                        <Text
                                            as="span"
                                            fontWeight="bold"
                                            color="gray.800"
                                        >

                                            Rs.{" "}

                                            {grn.totalSellingValue.toLocaleString()}

                                        </Text>

                                    </Text>

                                </HStack>

                            </Card.Body>

                        </Card.Root>

                    )
                )}

            </VStack>

        </Box>

    );

}