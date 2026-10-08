import {
    Box,
    Flex,
    Heading,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import {
    FiCheckCircle,
    FiCreditCard,
    FiPackage,
    FiUser,
} from "react-icons/fi";
import type { SelectedProduct } from "./ProductStep";
import type { Customer } from "./CustomerStep";
import type { OrderDetails } from "./OrderDetailsStep";


interface OrderPreviewProps {
    customer: Customer | null;
    isWalkInCustomer: boolean;
    selectedProducts: SelectedProduct[];
    orderDetails: OrderDetails;
    onCreateOrder: () => void;
    creatingOrder: boolean;
}

const OrderPreview = ({
    customer,
    isWalkInCustomer,
    selectedProducts,
    orderDetails
}: OrderPreviewProps) => {
    const subtotal = selectedProducts.reduce(
        (total, item) => total + Number(item.lineTotal || 0),
        0
    );

    const discountAmount = Math.min(
        Math.max(0, Number(orderDetails.discountAmount || 0)),
        subtotal
    );

    const totalAmount = Math.max(0, subtotal - discountAmount);

    const totalItems = selectedProducts.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const getCustomerName = () => {
        if (isWalkInCustomer || !customer) {
            return "Walk-in Customer";
        }

        const fullName = `${customer.firstName || ""} ${customer.lastName || ""
            }`.trim();

        return fullName || "Registered Customer";
    };

    const getPaymentMethod = () => {
        switch (orderDetails.paymentMethod) {
            case "CASH":
                return "Cash";
            case "CARD":
                return "Card";
            case "BANK_TRANSFER":
                return "Bank Transfer";
            case "OTHER":
                return "Other";
            default:
                return "Not selected";
        }
    };

    const getPaymentStatus = () => {
        switch (orderDetails.paymentStatus) {
            case "PAID":
                return "Paid";
            case "PARTIAL":
                return "Partial";
            case "PENDING":
                return "Pending";
            default:
                return "Pending";
        }
    };

    return (
        <Box>
            <Box mb={6}>
                <Heading size="md" color="gray.800">
                    Review Order
                </Heading>
                <Text mt={1} fontSize="sm" color="gray.500">
                    Please review all order information before creating the
                    order.
                </Text>
            </Box>

            <Box
                border="1px solid"
                borderColor="blue.100"
                borderRadius="xl"
                bg="blue.50"
                p={{ base: 4, md: 5 }}
                mb={5}
            >
                <Flex
                    align={{ base: "flex-start", md: "center" }}
                    justify="space-between"
                    gap={4}
                    direction={{ base: "column", md: "row" }}
                >
                    <Flex align="center" gap={3}>
                        <Flex
                            w="44px"
                            h="44px"
                            align="center"
                            justify="center"
                            borderRadius="full"
                            bg="blue.600"
                            color="white"
                        >
                            <FiCheckCircle size={21} />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="blue.900"
                            >
                                Ready to Create Order
                            </Text>
                            <Text
                                mt={1}
                                fontSize="xs"
                                color="blue.700"
                            >
                                Review the details below before continuing.
                            </Text>
                        </Box>
                    </Flex>

                    <Box
                        px={4}
                        py={2}
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

            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                gap={5}
                mb={5}
            >
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="white"
                    overflow="hidden"
                >
                    <Flex
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        align="center"
                        gap={3}
                    >
                        <Flex
                            w="38px"
                            h="38px"
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg="blue.50"
                            color="blue.600"
                        >
                            <FiUser />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Customer
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Customer information
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={5}>
                        <Flex
                            justify="space-between"
                            align="flex-start"
                            gap={4}
                        >
                            <Box>
                                <Text
                                    fontSize="md"
                                    fontWeight="700"
                                    color="gray.800"
                                >
                                    {getCustomerName()}
                                </Text>

                                {isWalkInCustomer ? (
                                    <Text
                                        mt={1}
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Walk-in customer
                                    </Text>
                                ) : (
                                    <Box mt={1}>
                                        {customer?.contactNumber && (
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {customer.contactNumber}
                                            </Text>
                                        )}

                                        {customer?.email && (
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {customer.email}
                                            </Text>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                bg={
                                    isWalkInCustomer
                                        ? "gray.100"
                                        : "blue.50"
                                }
                                color={
                                    isWalkInCustomer
                                        ? "gray.600"
                                        : "blue.700"
                                }
                                fontSize="xs"
                                fontWeight="600"
                            >
                                {isWalkInCustomer
                                    ? "Walk-in"
                                    : "Registered"}
                            </Box>
                        </Flex>
                    </Box>
                </Box>

                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="white"
                    overflow="hidden"
                >
                    <Flex
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        align="center"
                        gap={3}
                    >
                        <Flex
                            w="38px"
                            h="38px"
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg="green.50"
                            color="green.600"
                        >
                            <FiCheckCircle />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Order Status
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Initial status
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={5}>
                        <Flex align="center" gap={3}>
                            <Box
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                bg="orange.100"
                                color="orange.700"
                                fontSize="xs"
                                fontWeight="700"
                            >
                                PENDING
                            </Box>

                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Waiting for confirmation
                            </Text>
                        </Flex>
                    </Box>
                </Box>
            </SimpleGrid>

            <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                mb={5}
            >
                <Flex
                    px={5}
                    py={4}
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    align="center"
                    justify="space-between"
                >
                    <Flex align="center" gap={3}>
                        <Flex
                            w="38px"
                            h="38px"
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg="purple.50"
                            color="purple.600"
                        >
                            <FiPackage />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Order Items
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                {totalItems}{" "}
                                {totalItems === 1
                                    ? "item"
                                    : "items"}
                            </Text>
                        </Box>
                    </Flex>
                </Flex>

                <Box overflowX="auto">
                    <Box minW="700px">
                        <Flex
                            px={5}
                            py={3}
                            bg="gray.50"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <Text
                                flex={1}
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.500"
                            >
                                PRODUCT
                            </Text>

                            <Text
                                w="100px"
                                textAlign="right"
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.500"
                            >
                                PRICE
                            </Text>

                            <Text
                                w="90px"
                                textAlign="center"
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.500"
                            >
                                QTY
                            </Text>

                            <Text
                                w="130px"
                                textAlign="right"
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.500"
                            >
                                TOTAL
                            </Text>
                        </Flex>

                        {selectedProducts.map((item, index) => (
                            <Flex
                                key={item.allocationId}
                                px={5}
                                py={4}
                                align="center"
                                borderBottom={
                                    index <
                                        selectedProducts.length - 1
                                        ? "1px solid"
                                        : "none"
                                }
                                borderColor="gray.100"
                            >
                                <Box flex={1}>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="blue.600"
                                    >
                                        {item.productCode}
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                    >
                                        {item.name}
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        {item.brand || "-"}
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        color="purple.600"
                                        fontWeight="600"
                                        mt={1}
                                    >
                                        Batch: {item.batchNumber || "-"}
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Expiry: {new Date(item.expiryDate).toLocaleDateString("en-GB")}
                                    </Text>

                                </Box>

                                <Text
                                    w="100px"
                                    textAlign="right"
                                    fontSize="sm"
                                    color="gray.600"
                                >
                                    {formatCurrency(
                                        item.sellingPrice
                                    )}
                                </Text>

                                <Text
                                    w="90px"
                                    textAlign="center"
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="gray.700"
                                >
                                    {item.quantity}
                                </Text>

                                <Text
                                    w="130px"
                                    textAlign="right"
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.800"
                                >
                                    {formatCurrency(
                                        item.lineTotal
                                    )}
                                </Text>
                            </Flex>
                        ))}
                    </Box>
                </Box>
            </Box>

            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                gap={5}
            >
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="white"
                    overflow="hidden"
                >
                    <Flex
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        align="center"
                        gap={3}
                    >
                        <Flex
                            w="38px"
                            h="38px"
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg="blue.50"
                            color="blue.600"
                        >
                            <FiCreditCard />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Payment
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Payment information
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={5}>
                        <SimpleGrid columns={2} gap={4}>
                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.400"
                                >
                                    Payment Status
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="sm"
                                    fontWeight="700"
                                    color={
                                        orderDetails.paymentStatus ===
                                            "PAID"
                                            ? "green.600"
                                            : orderDetails.paymentStatus ===
                                                "PARTIAL"
                                                ? "orange.600"
                                                : "gray.700"
                                    }
                                >
                                    {getPaymentStatus()}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    fontSize="xs"
                                    color="gray.400"
                                >
                                    Payment Method
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.700"
                                >
                                    {getPaymentMethod()}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Box>

                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="white"
                    overflow="hidden"
                >
                    <Box
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                    >
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.800"
                        >
                            Order Summary
                        </Text>

                        <Text
                            mt={1}
                            fontSize="xs"
                            color="gray.500"
                        >
                            Final amount
                        </Text>
                    </Box>

                    <Box p={5}>
                        <Flex
                            justify="space-between"
                            mb={3}
                        >
                            <Text
                                fontSize="sm"
                                color="gray.600"
                            >
                                Subtotal
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.800"
                            >
                                {formatCurrency(subtotal)}
                            </Text>
                        </Flex>

                        <Flex
                            justify="space-between"
                            mb={4}
                        >
                            <Text
                                fontSize="sm"
                                color="gray.600"
                            >
                                Discount
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={
                                    discountAmount > 0
                                        ? "red.500"
                                        : "gray.600"
                                }
                            >
                                - {formatCurrency(discountAmount)}
                            </Text>
                        </Flex>

                        <Box
                            borderTop="1px solid"
                            borderColor="gray.200"
                            pt={4}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.700"
                                >
                                    Total Amount
                                </Text>

                                <Text
                                    fontSize="2xl"
                                    fontWeight="800"
                                    color="gray.900"
                                >
                                    {formatCurrency(totalAmount)}
                                </Text>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </SimpleGrid>

            <Box
                mt={5}
                px={5}
                py={4}
                border="1px solid"
                borderColor="orange.200"
                borderRadius="lg"
                bg="orange.50"
            >
                <Flex
                    align={{ base: "flex-start", md: "center" }}
                    gap={3}
                >
                    <FiCheckCircle color="#EA580C" />

                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="orange.800"
                        >
                            Order will be created as PENDING
                        </Text>

                        <Text
                            mt={1}
                            fontSize="xs"
                            color="orange.700"
                        >
                            Stock will not be deducted at this stage.
                            Stock allocation will happen when the order
                            is confirmed.
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Flex
                justify="flex-end"
                mt={6}
                gap={3}
            >
                {/* <Button
                    colorPalette="blue"
                    size="lg"
                    onClick={onCreateOrder}
                    loading={creatingOrder}
                    loadingText="Creating Order..."
                >
                    Create Order
                </Button> */}
            </Flex>
        </Box>
    );
};

export default OrderPreview;