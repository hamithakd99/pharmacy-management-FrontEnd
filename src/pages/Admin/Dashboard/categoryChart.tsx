import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
} from "@chakra-ui/react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const categoryData = [

    {
        name: "Pain Relief",
        value: 320,
    },

    {
        name: "Antibiotics",
        value: 210,
    },

    {
        name: "Vitamins",
        value: 180,
    },

    {
        name: "Skin Care",
        value: 95,
    },

    {
        name: "Others",
        value: 75,
    },

];

const COLORS = [

    "#0F766E",
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",

];

export default function CategoryChart() {

    const totalProducts = categoryData.reduce(

        (sum, item) => sum + item.value,

        0

    );

    return (

        <Box

            bg="white"

            rounded="xl"

            border="1px solid"

            borderColor="gray.200"

            boxShadow="sm"

            p="6"

            h="100%"

        >

            <Flex

                justify="space-between"

                align="center"

                mb="5"

            >

                <Box>

                    <Heading

                        size="md"

                    >

                        Product Categories

                    </Heading>

                    <Text

                        color="gray.500"

                        fontSize="sm"

                    >

                        Distribution of products

                    </Text>

                </Box>

            </Flex>



            <Box

                h="260px"

            >

                <ResponsiveContainer

                    width="100%"

                    height="100%"

                >

                    <PieChart>

                        <Pie

                            data={categoryData}

                            dataKey="value"

                            nameKey="name"

                            innerRadius={60}

                            outerRadius={90}

                            paddingAngle={3}

                        >

                            {

                                categoryData.map(

                                    (

                                        _,

                                        index

                                    ) => (

                                        <Cell

                                            key={index}

                                            fill={COLORS[index]}

                                        />

                                    )

                                )

                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </Box>



            <VStack

                mt="4"

                gap="3"

                align="stretch"

            >

                {

                    categoryData.map(

                        (

                            item,

                            index

                        ) => (

                            <HStack

                                key={item.name}

                                justify="space-between"

                            >

                                <HStack>

                                    <Box

                                        w="12px"

                                        h="12px"

                                        rounded="full"

                                        bg={COLORS[index]}

                                    />

                                    <Text

                                        fontSize="sm"

                                    >

                                        {item.name}

                                    </Text>

                                </HStack>

                                <Text

                                    fontWeight="600"

                                >

                                    {item.value}

                                </Text>

                            </HStack>

                        )

                    )

                }

            </VStack>



            <Box

                mt="6"

                pt="4"

                borderTop="1px solid"

                borderColor="gray.100"

            >

                <Text

                    fontSize="sm"

                    color="gray.500"

                >

                    Total Products

                </Text>

                <Heading

                    size="lg"

                    color="teal.600"

                >

                    {totalProducts}

                </Heading>

            </Box>

        </Box>

    );

}