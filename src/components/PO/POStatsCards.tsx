import {
    Box,
    Flex,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

import {
    LuClipboardList,
    LuClock,
    LuCircleCheck,
    LuCircleX,
} from "react-icons/lu";


type POStatusCardsProps = {

    totalOrders: number;

    pendingOrders: number;

    partiallyReceivedOrders: number;

    completedOrders: number;

    cancelledOrders: number;

};


export default function POStatusCards({

    totalOrders,

    pendingOrders,

    partiallyReceivedOrders,

    completedOrders,

    cancelledOrders,

}: POStatusCardsProps) {

    return (

        <SimpleGrid
            columns={{
                base: 2,
                sm: 2,
                md: 3,
                xl: 6,
            }}
            gap={{ base: 2, sm: 3, md: 4 }}
            mb={{ base: 4, md: 6 }}
            width="100%"
        >

            {/* =====================================================
                TOTAL ORDERS
            ===================================================== */}

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="lg"
                p={{ base: 3, sm: 5 }}
                boxShadow="sm"
                minW={0}
            >

                <Flex
                    justify="space-between"
                    align="start"
                >

                    <Box>

                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.500"
                            mb={1}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                            lineHeight="short"
                        >
                            Total Orders
                        </Text>

                        <Text
                            fontSize={{ base: "xl", sm: "3xl" }}
                            fontWeight="bold"
                            color="gray.800"
                            lineHeight="1"
                        >
                            {totalOrders}
                        </Text>

                    </Box>

                    <Box
                        p={{ base: 2, sm: 3 }}
                        rounded="full"
                        bg="blue.50"
                        color="blue.500"
                    >
                        <LuClipboardList size={18} />
                    </Box>

                </Flex>

            </Box>


            {/* =====================================================
                PENDING
            ===================================================== */}

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="lg"
                p={{ base: 3, sm: 5 }}
                boxShadow="sm"
                minW={0}
            >

                <Flex
                    justify="space-between"
                    align="start"
                >

                    <Box>

                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.500"
                            mb={1}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                            lineHeight="short"
                        >
                            Pending
                        </Text>

                        <Text
                            fontSize={{ base: "xl", sm: "3xl" }}
                            fontWeight="bold"
                            color="orange.500"
                            lineHeight="1"
                        >
                            {pendingOrders}
                        </Text>

                    </Box>

                    <Box
                        p={{ base: 2, sm: 3 }}
                        rounded="full"
                        bg="orange.50"
                        color="orange.500"
                    >
                        <LuClock size={18} />
                    </Box>

                </Flex>

            </Box>



            {/* =====================================================
                PARTIALLY RECEIVED
            ===================================================== */}

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="lg"
                p={{ base: 3, sm: 5 }}
                boxShadow="sm"
                minW={0}
            >

                <Flex
                    justify="space-between"
                    align="start"
                >

                    <Box>

                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.500"
                            mb={1}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                            lineHeight="short"
                        >
                            Partially Received
                        </Text>

                        <Text
                            fontSize={{ base: "xl", sm: "3xl" }}
                            fontWeight="bold"
                            color="purple.500"
                            lineHeight="1"
                        >
                            {partiallyReceivedOrders}
                        </Text>

                    </Box>

                    <Box
                        p={{ base: 2, sm: 3 }}
                        rounded="full"
                        bg="purple.50"
                        color="purple.500"
                    >
                        <LuCircleCheck size={18} />
                    </Box>

                </Flex>

            </Box>


            {/* =====================================================
                COMPLETED
            ===================================================== */}

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="lg"
                p={{ base: 3, sm: 5 }}
                boxShadow="sm"
                minW={0}
            >

                <Flex
                    justify="space-between"
                    align="start"
                >

                    <Box>

                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.500"
                            mb={1}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                            lineHeight="short"
                        >
                            Completed
                        </Text>

                        <Text
                            fontSize={{ base: "xl", sm: "3xl" }}
                            fontWeight="bold"
                            color="green.500"
                            lineHeight="1"
                        >
                            {completedOrders}
                        </Text>

                    </Box>

                    <Box
                        p={{ base: 2, sm: 3 }}
                        rounded="full"
                        bg="green.50"
                        color="green.500"
                    >
                        <LuCircleCheck size={18} />
                    </Box>

                </Flex>

            </Box>


            {/* =====================================================
                CANCELLED
            ===================================================== */}

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="lg"
                p={{ base: 3, sm: 5 }}
                boxShadow="sm"
                minW={0}
            >

                <Flex
                    justify="space-between"
                    align="start"
                >

                    <Box>

                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.500"
                            mb={1}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                            lineHeight="short"
                        >
                            Cancelled
                        </Text>

                        <Text
                            fontSize={{ base: "xl", sm: "3xl" }}
                            fontWeight="bold"
                            color="red.500"
                            lineHeight="1"
                        >
                            {cancelledOrders}
                        </Text>

                    </Box>

                    <Box
                        p={{ base: 2, sm: 3 }}
                        rounded="full"
                        bg="red.50"
                        color="red.500"
                    >
                        <LuCircleX size={18} />
                    </Box>

                </Flex>

            </Box>

        </SimpleGrid>

    );

}