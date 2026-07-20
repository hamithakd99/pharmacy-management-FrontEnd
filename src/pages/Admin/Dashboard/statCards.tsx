import {
    Box,
    Flex,
    Grid,
    GridItem,
    HStack,
    Icon,
    Stat,
    Text,
} from "@chakra-ui/react";

import {
    MdInventory2,
    MdAttachMoney,
    MdShoppingCart,
    MdWarningAmber,
    MdAccessTimeFilled,
    MdReceiptLong,
} from "react-icons/md";

import type { IconType } from "react-icons";

type DashboardCard = {

    title: string;

    value: string;

    subtitle: string;

    color: string;

    bg: string;

    icon: IconType;

};

export default function StatCards() {

    const cards: DashboardCard[] = [

        {

            title: "Total Products",

            value: "1,258",

            subtitle: "Products Available",

            color: "blue.500",

            bg: "blue.50",

            icon: MdInventory2,

        },

        {

            title: "Inventory Value",

            value: "Rs. 4.56 M",

            subtitle: "Current Stock Value",

            color: "green.500",

            bg: "green.50",

            icon: MdAttachMoney,

        },

        {

            title: "Today's Sales",

            value: "Rs. 84,250",

            subtitle: "Today's Revenue",

            color: "teal.500",

            bg: "teal.50",

            icon: MdShoppingCart,

        },

        {

            title: "Bills Today",

            value: "42",

            subtitle: "Bills Generated",

            color: "purple.500",

            bg: "purple.50",

            icon: MdReceiptLong,

        },

        {

            title: "Low Stock",

            value: "15",

            subtitle: "Need Reorder",

            color: "orange.500",

            bg: "orange.50",

            icon: MdWarningAmber,

        },

        {

            title: "Expiring Soon",

            value: "8",

            subtitle: "Within 30 Days",

            color: "red.500",

            bg: "red.50",

            icon: MdAccessTimeFilled,

        },

    ];

    return (

        <Grid

            templateColumns={{

                base: "1fr",

                md: "repeat(2,1fr)",

                xl: "repeat(3,1fr)",

                "2xl": "repeat(6,1fr)"

            }}

            gap="5"

        >

            {cards.map((card) => (

                <GridItem key={card.title}>

                    <Box

                        bg="white"

                        rounded="xl"

                        p="5"

                        border="1px solid"

                        borderColor="gray.200"

                        boxShadow="sm"

                        transition="0.25s"

                        cursor="pointer"

                        _hover={{

                            transform: "translateY(-4px)",

                            boxShadow: "lg",

                        }}

                    >

                        <Flex

                            justify="space-between"

                            align="center"

                        >

                            <Box>

                                <Text

                                    fontSize="sm"

                                    color="gray.500"

                                >

                                    {card.title}

                                </Text>

                                <Stat.Root>

                                    <Stat.ValueText

                                        fontSize="3xl"

                                        fontWeight="bold"

                                    >

                                        {card.value}

                                    </Stat.ValueText>

                                </Stat.Root>

                                <Text

                                    fontSize="sm"

                                    color="gray.500"

                                >

                                    {card.subtitle}

                                </Text>

                            </Box>

                            <HStack

                                w="60px"

                                h="60px"

                                rounded="full"

                                bg={card.bg}

                                justify="center"

                            >

                                <Icon

                                    as={card.icon}

                                    boxSize={7}

                                    color={card.color}

                                />

                            </HStack>

                        </Flex>

                    </Box>

                </GridItem>

            ))}

        </Grid>

    );

}