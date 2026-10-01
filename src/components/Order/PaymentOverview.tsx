import { Box, Circle, Flex, HStack, Progress, SimpleGrid, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiClock, FiRefreshCcw, FiCreditCard } from "react-icons/fi";

interface PaymentOverviewProps {
    paidOrders: number;
    pendingPayments: number;
    partialPayments: number;
    refundedOrders: number;
    totalOrders: number;
    totalSales: number;
    pendingPaymentAmount: number;
}

const PaymentOverview = ({
    paidOrders,
    pendingPayments,
    partialPayments,
    refundedOrders,
    totalOrders,
    totalSales,
    pendingPaymentAmount
}: PaymentOverviewProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString("en-LK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };

    const getPercentage = (value: number) => {
        if (totalOrders === 0) {
            return 0;
        }

        return Math.round((value / totalOrders) * 100);
    };

    const paymentData = [
        {
            label: "Paid",
            count: paidOrders,
            percentage: getPercentage(paidOrders),
            icon: FiCheckCircle,
            color: "green",
            description: "Fully paid orders"
        },
        {
            label: "Pending",
            count: pendingPayments,
            percentage: getPercentage(pendingPayments),
            icon: FiClock,
            color: "orange",
            description: "Payment still pending"
        },
        {
            label: "Partial",
            count: partialPayments,
            percentage: getPercentage(partialPayments),
            icon: FiCreditCard,
            color: "purple",
            description: "Partially paid orders"
        },
        {
            label: "Refunded",
            count: refundedOrders,
            percentage: getPercentage(refundedOrders),
            icon: FiRefreshCcw,
            color: "red",
            description: "Refunded orders"
        }
    ];

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="2xl"
            boxShadow="sm"
            p={{ base: 5, md: 6 }}
            h="100%"
        >
            <Flex
                justify="space-between"
                align="flex-start"
                gap={4}
            >
                <Box>
                    <Text
                        fontSize="lg"
                        fontWeight="700"
                        color="gray.800"
                    >
                        Payment Overview
                    </Text>

                    <Text
                        mt={1}
                        fontSize="sm"
                        color="gray.500"
                    >
                        Monitor payment collection status
                    </Text>
                </Box>

                <Flex
                    w="42px"
                    h="42px"
                    align="center"
                    justify="center"
                    borderRadius="xl"
                    bg="blue.50"
                    color="blue.600"
                >
                    <FiCreditCard size={20} />
                </Flex>
            </Flex>

            <SimpleGrid
                columns={{
                    base: 1,
                    sm: 2
                }}
                gap={3}
                mt={6}
            >
                {paymentData.map((payment) => {
                    const Icon = payment.icon;

                    return (
                        <Box
                            key={payment.label}
                            p={4}
                            borderRadius="xl"
                            bg={`${payment.color}.50`}
                            border="1px solid"
                            borderColor={`${payment.color}.100`}
                        >
                            <Flex
                                justify="space-between"
                                align="flex-start"
                                gap={3}
                            >
                                <HStack gap={2}>
                                    <Circle
                                        size="30px"
                                        bg="white"
                                        color={`${payment.color}.600`}
                                    >
                                        <Icon size={15} />
                                    </Circle>

                                    <Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="gray.700"
                                        >
                                            {payment.label}
                                        </Text>

                                        <Text
                                            fontSize="xs"
                                            color="gray.500"
                                        >
                                            {payment.description}
                                        </Text>
                                    </Box>
                                </HStack>

                                <Text
                                    fontSize="lg"
                                    fontWeight="700"
                                    color={`${payment.color}.600`}
                                >
                                    {payment.count}
                                </Text>
                            </Flex>

                            <Box mt={4}>
                                <Flex
                                    justify="space-between"
                                    mb={1.5}
                                >
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Orders
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        fontWeight="600"
                                        color="gray.600"
                                    >
                                        {payment.percentage}%
                                    </Text>
                                </Flex>

                                <Progress.Root
                                    value={payment.percentage}
                                    size="xs"
                                    colorPalette={
                                        payment.color
                                    }
                                    borderRadius="full"
                                    bg="white"
                                >
                                    <Progress.Track>
                                        <Progress.Range />
                                    </Progress.Track>
                                </Progress.Root>
                            </Box>
                        </Box>
                    );
                })}
            </SimpleGrid>

            <Box
                mt={5}
                p={4}
                borderRadius="xl"
                bg="gray.50"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    mb={3}
                >
                    <Box>
                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.500"
                            textTransform="uppercase"
                        >
                            Total Sales
                        </Text>

                        <Text
                            mt={1}
                            fontSize="xl"
                            fontWeight="700"
                            color="gray.800"
                        >
                            {formatCurrency(totalSales)}
                        </Text>
                    </Box>

                    <Box textAlign="right">
                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.500"
                            textTransform="uppercase"
                        >
                            Pending Amount
                        </Text>

                        <Text
                            mt={1}
                            fontSize="lg"
                            fontWeight="700"
                            color="orange.500"
                        >
                            {formatCurrency(
                                pendingPaymentAmount
                            )}
                        </Text>
                    </Box>
                </Flex>

                <Progress.Root
                    value={
                        totalSales > 0
                            ? Math.min(
                                  100,
                                  ((totalSales -
                                      pendingPaymentAmount) /
                                      totalSales) *
                                      100
                              )
                            : 0
                    }
                    size="sm"
                    colorPalette="green"
                    borderRadius="full"
                    bg="gray.200"
                >
                    <Progress.Track>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>

                <Flex
                    justify="space-between"
                    mt={2}
                >
                    <Text
                        fontSize="xs"
                        color="gray.400"
                    >
                        Collected
                    </Text>

                    <Text
                        fontSize="xs"
                        color="gray.400"
                    >
                        Pending collection
                    </Text>
                </Flex>
            </Box>

            <Box
                mt={4}
                pt={4}
                borderTop="1px solid"
                borderColor="gray.100"
            >
                <Flex
                    justify="space-between"
                    align="center"
                >
                    <HStack gap={2}>
                        <Circle
                            size="8px"
                            bg="green.400"
                        />

                        <Text
                            fontSize="xs"
                            color="gray.500"
                        >
                            Payment tracking
                        </Text>
                    </HStack>

                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                    >
                        {paidOrders} paid orders
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default PaymentOverview;