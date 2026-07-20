import {
    Box,
    Flex,
    Heading,
    HStack,
    NativeSelect,
    Text,
} from "@chakra-ui/react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const monthlySales = [

    {
        month: "Jan",
        sales: 420000,
    },

    {
        month: "Feb",
        sales: 510000,
    },

    {
        month: "Mar",
        sales: 475000,
    },

    {
        month: "Apr",
        sales: 620000,
    },

    {
        month: "May",
        sales: 710000,
    },

    {
        month: "Jun",
        sales: 685000,
    },

    {
        month: "Jul",
        sales: 835000,
    },

    {
        month: "Aug",
        sales: 910000,
    },

    {
        month: "Sep",
        sales: 865000,
    },

    {
        month: "Oct",
        sales: 990000,
    },

    {
        month: "Nov",
        sales: 1085000,
    },

    {
        month: "Dec",
        sales: 1180000,
    },

];

export default function SalesChart() {

    return (

        <Box

            bg="white"

            rounded="xl"

            border="1px solid"

            borderColor="gray.200"

            p="6"

            boxShadow="sm"

        >

            <Flex

                justify="space-between"

                align="center"

                mb="6"

                flexWrap="wrap"

                gap="3"

            >

                <Box>

                    <Heading

                        size="md"

                    >

                        Monthly Sales

                    </Heading>

                    <Text

                        color="gray.500"

                        fontSize="sm"

                    >

                        Revenue generated during the year

                    </Text>

                </Box>


                <HStack>

                    <NativeSelect.Root
                        width="140px"
                    >

                        <NativeSelect.Field>

                            <option>

                                2026

                            </option>

                            <option>

                                2025

                            </option>

                            <option>

                                2024

                            </option>

                        </NativeSelect.Field>

                        <NativeSelect.Indicator />

                    </NativeSelect.Root>

                </HStack>

            </Flex>



            <Box

                h="350px"

            >

                <ResponsiveContainer

                    width="100%"

                    height="100%"

                >

                    <AreaChart

                        data={monthlySales}

                    >

                        <defs>

                            <linearGradient

                                id="sales"

                                x1="0"

                                y1="0"

                                x2="0"

                                y2="1"

                            >

                                <stop

                                    offset="5%"

                                    stopColor="#0F766E"

                                    stopOpacity={0.35}

                                />

                                <stop

                                    offset="95%"

                                    stopColor="#0F766E"

                                    stopOpacity={0}

                                />

                            </linearGradient>

                        </defs>


                        <CartesianGrid

                            strokeDasharray="3 3"

                            vertical={false}

                        />


                        <XAxis

                            dataKey="month"

                        />


                        <YAxis

                            tickFormatter={(value) =>

                                `${value / 1000}K`

                            }

                        />


                        <Tooltip

                            formatter={(value) => {

                                const numericValue = Array.isArray(value) ? value[0] : value;

                                return `Rs. ${Number(numericValue ?? 0).toLocaleString()}`;

                            }}

                        />


                        <Area

                            type="monotone"

                            dataKey="sales"

                            stroke="#0F766E"

                            strokeWidth={3}

                            fill="url(#sales)"

                            activeDot={{

                                r: 6,

                            }}

                        />

                    </AreaChart>

                </ResponsiveContainer>

            </Box>

        </Box>

    );

}