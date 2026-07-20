import {
    Badge,
    Box,
    Button,
    Heading,
    Progress,
    Table,
    Text,
    Flex,
} from "@chakra-ui/react";

const products = [

    {
        productId: "MED001",
        name: "Panadol 500mg",
        stock: 8,
        reorder: 50,
    },

    {
        productId: "MED045",
        name: "Vitamin C",
        stock: 4,
        reorder: 40,
    },

    {
        productId: "MED078",
        name: "Amoxicillin",
        stock: 2,
        reorder: 30,
    },

    {
        productId: "MED120",
        name: "Cetirizine",
        stock: 9,
        reorder: 25,
    },

    {
        productId: "MED155",
        name: "Paracetamol Syrup",
        stock: 5,
        reorder: 20,
    },

];

export default function LowStockTable() {

    return (

        <Box

            bg="white"

            p="6"

            rounded="xl"

            border="1px solid"

            borderColor="gray.200"

            boxShadow="sm"

        >

            <Flex

                justify="space-between"

                align="center"

                mb="5"

            >

                <Box>

                    <Heading size="md">

                        Low Stock Products

                    </Heading>

                    <Text

                        fontSize="sm"

                        color="gray.500"

                    >

                        Products that require reordering

                    </Text>

                </Box>

                <Button

                    size="sm"

                    variant="outline"

                >

                    View All

                </Button>

            </Flex>


            <Table.Root>

                <Table.Header>

                    <Table.Row>

                        <Table.ColumnHeader>

                            Product

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Stock

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Status

                        </Table.ColumnHeader>

                    </Table.Row>

                </Table.Header>

                <Table.Body>

                    {

                        products.map((product) => (

                            <Table.Row key={product.productId}>

                                <Table.Cell>

                                    <Text

                                        fontWeight="600"

                                    >

                                        {product.name}

                                    </Text>

                                    <Text

                                        fontSize="xs"

                                        color="gray.500"

                                    >

                                        {product.productId}

                                    </Text>

                                </Table.Cell>


                                <Table.Cell>

                                    <Progress.Root

                                        value={

                                            product.stock /

                                            product.reorder *

                                            100

                                        }

                                        maxW="140px"

                                    >

                                        <Progress.Track>

                                            <Progress.Range />

                                        </Progress.Track>

                                    </Progress.Root>

                                    <Text

                                        fontSize="xs"

                                        mt="1"

                                    >

                                        {product.stock} / {product.reorder}

                                    </Text>

                                </Table.Cell>


                                <Table.Cell>

                                    <Badge

                                        colorPalette={

                                            product.stock <= 3

                                                ? "red"

                                                : "orange"

                                        }

                                    >

                                        {

                                            product.stock <= 3

                                                ? "Critical"

                                                : "Low"

                                        }

                                    </Badge>

                                </Table.Cell>

                            </Table.Row>

                        ))

                    }

                </Table.Body>

            </Table.Root>

        </Box>

    );

}