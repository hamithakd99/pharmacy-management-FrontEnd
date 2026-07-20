import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Progress,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";

const products = [

    {
        rank: 1,
        name: "Panadol 500mg",
        sold: 425,
        revenue: 63750,
    },

    {
        rank: 2,
        name: "Vitamin C 1000mg",
        sold: 360,
        revenue: 54000,
    },

    {
        rank: 3,
        name: "Amoxicillin 500mg",
        sold: 295,
        revenue: 88500,
    },

    {
        rank: 4,
        name: "Cetirizine 10mg",
        sold: 210,
        revenue: 31500,
    },

    {
        rank: 5,
        name: "Paracetamol Syrup",
        sold: 185,
        revenue: 46250,
    },

];

const highestSold = Math.max(
    ...products.map((p) => p.sold)
);

export default function TopSellingProducts() {

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

                        Top Selling Products

                    </Heading>

                    <Text

                        fontSize="sm"

                        color="gray.500"

                    >

                        Best performing products

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

                            Rank

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Product

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Sold

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Revenue

                        </Table.ColumnHeader>

                    </Table.Row>

                </Table.Header>

                <Table.Body>

                    {

                        products.map((product) => (

                            <Table.Row

                                key={product.rank}

                            >

                                <Table.Cell>

                                    {

                                        product.rank === 1 ?

                                            <Badge colorPalette="yellow">

                                                🥇 #1

                                            </Badge>

                                            :

                                            product.rank === 2 ?

                                                <Badge colorPalette="gray">

                                                    🥈 #2

                                                </Badge>

                                                :

                                                product.rank === 3 ?

                                                    <Badge colorPalette="orange">

                                                        🥉 #3

                                                    </Badge>

                                                    :

                                                    <Badge>

                                                        #{product.rank}

                                                    </Badge>

                                    }

                                </Table.Cell>


                                <Table.Cell>

                                    <VStack

                                        align="start"

                                        gap="1"

                                    >

                                        <Text

                                            fontWeight="600"

                                        >

                                            {product.name}

                                        </Text>

                                        <Progress.Root

                                            value={

                                                product.sold /

                                                highestSold *

                                                100

                                            }

                                            size="xs"

                                            width="180px"

                                        >

                                            <Progress.Track>

                                                <Progress.Range />

                                            </Progress.Track>

                                        </Progress.Root>

                                    </VStack>

                                </Table.Cell>


                                <Table.Cell>

                                    {product.sold}

                                </Table.Cell>


                                <Table.Cell>

                                    Rs.

                                    {" "}

                                    {product.revenue.toLocaleString()}

                                </Table.Cell>

                            </Table.Row>

                        ))

                    }

                </Table.Body>

            </Table.Root>

        </Box>

    );

}