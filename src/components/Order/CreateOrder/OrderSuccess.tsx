import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import {
    FiCheckCircle,
    FiEye,
    FiPlus,
} from "react-icons/fi";

interface OrderSuccessProps {
    orderNumber: string;
    totalAmount: number;
    onViewOrder: () => void;
    onCreateAnother: () => void;
}

const OrderSuccess = ({
    orderNumber,
    totalAmount,
    onViewOrder,
    onCreateAnother,
}: OrderSuccessProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <Flex
            minH="500px"
            align="center"
            justify="center"
            px={4}
        >
            <Box
                w="full"
                maxW="600px"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                boxShadow="sm"
                p={{ base: 6, md: 10 }}
                textAlign="center"
            >
                <Flex
                    w="72px"
                    h="72px"
                    mx="auto"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="green.50"
                    color="green.600"
                    mb={5}
                >
                    <FiCheckCircle size={40} />
                </Flex>

                <Heading
                    size="lg"
                    color="gray.800"
                >
                    Order Created Successfully!
                </Heading>

                <Text
                    mt={2}
                    fontSize="sm"
                    color="gray.500"
                >
                    The order has been successfully created and is waiting
                    for confirmation.
                </Text>

                <Box
                    mt={7}
                    p={5}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                >
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.500"
                    >
                        ORDER NUMBER
                    </Text>

                    <Text
                        mt={1}
                        fontSize="xl"
                        fontWeight="800"
                        color="blue.600"
                    >
                        {orderNumber}
                    </Text>

                    <Flex
                        mt={5}
                        pt={4}
                        borderTop="1px solid"
                        borderColor="gray.200"
                        justify="space-between"
                    >
                        <Text
                            fontSize="sm"
                            color="gray.600"
                        >
                            Total Amount
                        </Text>

                        <Text
                            fontSize="lg"
                            fontWeight="800"
                            color="gray.800"
                        >
                            {formatCurrency(totalAmount)}
                        </Text>
                    </Flex>

                    <Flex
                        mt={4}
                        justify="center"
                    >
                        <Box
                            px={4}
                            py={1.5}
                            borderRadius="full"
                            bg="orange.100"
                            color="orange.700"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            PENDING
                        </Box>
                    </Flex>
                </Box>

                <Flex
                    mt={7}
                    gap={3}
                    direction={{ base: "column", sm: "row" }}
                    justify="center"
                >
                    <Button
                        variant="outline"
                        colorPalette="blue"
                        onClick={onViewOrder}
                    >
                        <FiEye />
                        View Order
                    </Button>

                    <Button
                        colorPalette="blue"
                        onClick={onCreateAnother}
                    >
                        <FiPlus />
                        Create Another Order
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
};

export default OrderSuccess;