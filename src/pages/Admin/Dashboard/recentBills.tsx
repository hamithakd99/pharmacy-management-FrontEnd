import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Text,
} from "@chakra-ui/react";

const bills = [

    {

        billNo: "INV-1001",

        customer: "Walk-in Customer",

        amount: 4850,

        payment: "Cash",

    },

    {

        billNo: "INV-1002",

        customer: "Nimal Perera",

        amount: 13250,

        payment: "Card",

    },

    {

        billNo: "INV-1003",

        customer: "Walk-in Customer",

        amount: 2850,

        payment: "Cash",

    },

    {

        billNo: "INV-1004",

        customer: "Kamal Silva",

        amount: 7640,

        payment: "Card",

    },

];

export default function RecentBills() {

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

                        Recent Bills

                    </Heading>

                    <Text

                        fontSize="sm"

                        color="gray.500"

                    >

                        Latest completed transactions

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

                            Bill

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Customer

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Amount

                        </Table.ColumnHeader>

                        <Table.ColumnHeader>

                            Payment

                        </Table.ColumnHeader>

                    </Table.Row>

                </Table.Header>

                <Table.Body>

                    {

                        bills.map((bill) => (

                            <Table.Row key={bill.billNo}>

                                <Table.Cell>

                                    {bill.billNo}

                                </Table.Cell>

                                <Table.Cell>

                                    {bill.customer}

                                </Table.Cell>

                                <Table.Cell>

                                    Rs. {bill.amount.toLocaleString()}

                                </Table.Cell>

                                <Table.Cell>

                                    <Badge

                                        colorPalette={

                                            bill.payment === "Cash"

                                                ? "green"

                                                : "blue"

                                        }

                                    >

                                        {bill.payment}

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