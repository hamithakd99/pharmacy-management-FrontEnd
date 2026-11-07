import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import {
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiPackage,
    FiUser,
} from "react-icons/fi";
import type { SelectedProduct } from "./ProductStep";
import type { Customer } from "./CustomerStep";


export interface OrderDetails {
    discountAmount: number;
    paymentStatus: "PENDING" | "PAID" | "PARTIAL";
    paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "CHEQUE" | null;
}

interface OrderDetailsStepProps {
    customer: Customer | null;
    isWalkInCustomer: boolean;
    selectedProducts: SelectedProduct[];
    orderDetails: OrderDetails;
    onOrderDetailsChange: (details: OrderDetails) => void;
}

const OrderDetailsStep = ({
    customer,
    isWalkInCustomer,
    selectedProducts,
    orderDetails,
    onOrderDetailsChange,
}: OrderDetailsStepProps) => {
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

    const updateDetails = (changes: Partial<OrderDetails>) => {
        onOrderDetailsChange({
            ...orderDetails,
            ...changes,
        });
    };

    return (
        <Box>
            <Box mb={6}>
                <Heading size="md" color="gray.800">
                    Order Details
                </Heading>
                <Text mt={1} fontSize="sm" color="gray.500">
                    Review the order information and set the payment details.
                </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 3, md: 5 }}>
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="white"
                    overflow="hidden"
                >
                    <Flex
                        px={4}
                        py={3}
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
                            <Text fontSize="xs" color="gray.500">
                                Customer information
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={{ base: 3, sm: 5 }}>
                        <Flex
                            justify="space-between"
                            align="center"
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
                                        No registered customer selected
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
                            <Text fontSize="xs" color="gray.500">
                                Initial order status
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={{ base: 3, sm: 5 }}>
                        <Flex align="center" gap={3}>
                            <Flex
                                w="42px"
                                h="42px"
                                align="center"
                                justify="center"
                                borderRadius="lg"
                                bg="orange.50"
                                color="orange.600"
                            >
                                <FiClock />
                            </Flex>

                            <Box>
                                <Text
                                    fontSize="md"
                                    fontWeight="700"
                                    color="orange.600"
                                >
                                    PENDING
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Waiting for order confirmation
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </SimpleGrid>

            <Box
                mt={5}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
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
                        w="32px"
                        h="32px"
                        align="center"
                        justify="center"
                        borderRadius="md"
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
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                            {totalItems}{" "}
                            {totalItems === 1 ? "item" : "items"} selected
                        </Text>
                    </Box>
                </Flex>

                <Box>
                    {selectedProducts.map((item, index) => (
                        <Box
                            key={item.allocationId}
                            px={4}
                            py={{ base: 3, md: 2.5 }}
                            borderBottom={
                                index < selectedProducts.length - 1
                                    ? "1px solid"
                                    : "none"
                            }
                            borderColor="gray.100"
                            _hover={{ bg: "gray.50" }}
                            transition="background-color 0.2s"
                        >
                            <SimpleGrid
                                columns={{ base: 2, md: 4 }}
                                templateColumns={{
                                    base: "minmax(0, 1fr) minmax(0, 1fr)",
                                    md: "minmax(0, 1fr) 85px 125px 125px",
                                }}
                                alignItems="center"
                                gap={{ base: 3, md: 4 }}
                            >
                                <Box minW={0} gridColumn={{ base: "1 / -1", md: "auto" }}>
                                    <Flex align="center" gap={2} minW={0}>
                                        <Text
                                            fontSize="xs"
                                            fontWeight="700"
                                            color="blue.600"
                                            whiteSpace="nowrap"
                                        >
                                            {item.productCode}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="gray.800"
                                            truncate
                                        >
                                            {item.name}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        align="center"
                                        gap={2}
                                        mt={0.5}
                                        wrap="wrap"
                                    >
                                        <Text fontSize="xs" color="gray.500">
                                            {item.brand || "No brand"}
                                        </Text>
                                        {/* <Text fontSize="xs" color="gray.300">
                                            |
                                        </Text> */}
                                        {/* <Text
                                            fontSize="xs"
                                            color="purple.600"
                                            fontWeight="600"
                                        >
                                            Batch: {item.batchNumber || "-"}
                                        </Text> */}
                                        <Text fontSize="xs" color="gray.300">
                                            |
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Expiry:{" "}
                                            {new Date(
                                                item.expiryDate
                                            ).toLocaleDateString("en-GB")}
                                        </Text>
                                    </Flex>
                                </Box>

                                <Box
                                    textAlign={{ base: "left", md: "right" }}
                                >
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Quantity
                                    </Text>
                                    <Text
                                        mt={0.5}
                                        fontSize="md"
                                        fontWeight="700"
                                        color="gray.700"
                                    >
                                        {item.quantity}
                                    </Text>
                                </Box>

                                <Box
                                    textAlign={{ base: "left", md: "right" }}
                                >
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Unit Price
                                    </Text>
                                    <Text
                                        mt={0.5}
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="gray.700"
                                    >
                                        {formatCurrency(
                                            item.sellingPrice
                                        )}
                                    </Text>
                                </Box>

                                <Box
                                    minW={0}
                                    textAlign={{ base: "left", md: "right" }}
                                >
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Total
                                    </Text>
                                    <Text
                                        mt={0.5}
                                        fontSize="sm"
                                        fontWeight="700"
                                        color="blue.700"
                                    >
                                        {formatCurrency(
                                            item.lineTotal
                                        )}
                                    </Text>
                                </Box>
                            </SimpleGrid>
                        </Box>
                    ))}
                </Box>
            </Box>

            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                gap={{ base: 3, md: 5 }}
                mt={5}
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
                                Payment Details
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                Select payment information
                            </Text>
                        </Box>
                    </Flex>

                    <Box p={{ base: 3, sm: 5 }}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                            mb={3}
                        >
                            Payment Status
                        </Text>

                        <SimpleGrid columns={3} gap={2} mb={5}>
                            {(
                                ["PENDING", "PAID", "PARTIAL"] as const
                            ).map((status) => {
                                const isActive =
                                    orderDetails.paymentStatus === status;

                                return (
                                    <Button
                                        key={status}
                                        h="42px"
                                        size="sm"
                                        variant={
                                            isActive
                                                ? "solid"
                                                : "outline"
                                        }
                                        colorPalette={
                                            isActive
                                                ? status === "PAID"
                                                    ? "green"
                                                    : status === "PARTIAL"
                                                        ? "orange"
                                                        : "blue"
                                                : "gray"
                                        }
                                        onClick={() =>
                                            updateDetails({
                                                paymentStatus: status,
                                            })
                                        }
                                    >
                                        {status}
                                    </Button>
                                );
                            })}
                        </SimpleGrid>

                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                            mb={3}
                        >
                            Payment Method
                        </Text>

                        <SimpleGrid columns={{ base: 2, md: 2 }} gap={2}>
                            {(
                                [
                                    ["CASH", "Cash"],
                                    ["CARD", "Card"],
                                    ["BANK_TRANSFER", "Bank Transfer"],
                                    ["CHEQUE", "Cheque"],
                                ] as const
                            ).map(([value, label]) => {
                                const isActive =
                                    orderDetails.paymentMethod === value;

                                return (
                                    <Button
                                        key={value}
                                        h="42px"
                                        size="sm"
                                        variant={
                                            isActive
                                                ? "solid"
                                                : "outline"
                                        }
                                        colorPalette={
                                            isActive ? "blue" : "gray"
                                        }
                                        onClick={() =>
                                            updateDetails({
                                                paymentMethod: value,
                                            })
                                        }
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </SimpleGrid>

                        {orderDetails.paymentStatus !== "PENDING" &&
                            !orderDetails.paymentMethod && (
                                <Text
                                    mt={3}
                                    fontSize="xs"
                                    color="orange.600"
                                >
                                    Please select a payment method.
                                </Text>
                            )}
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
                        justify="space-between"
                    >
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Order Summary
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                Final amount calculation
                            </Text>
                        </Box>

                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="blue.600"
                        >
                            {totalItems} items
                        </Text>
                    </Flex>

                    <Box p={5}>
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={4}
                        >
                            <Text fontSize="sm" color="gray.600">
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
                            align="center"
                            gap={4}
                            mb={4}
                        >
                            <Box>
                                <Text
                                    fontSize="sm"
                                    color="gray.600"
                                >
                                    Discount
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.400"
                                >
                                    Enter discount amount
                                </Text>
                            </Box>

                            <Input
                                type="number"
                                min={0}
                                max={subtotal}
                                value={
                                    orderDetails.discountAmount || ""
                                }
                                onChange={(event) => {
                                    const value = Number(
                                        event.target.value
                                    );

                                    updateDetails({
                                        discountAmount:
                                            Number.isFinite(value)
                                                ? Math.max(0, value)
                                                : 0,
                                    });
                                }}
                                w="130px"
                                textAlign="right"
                                bg="white"
                            />
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
                                <Box>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="gray.600"
                                    >
                                        Total Amount
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="xs"
                                        color="gray.400"
                                    >
                                        After discount
                                    </Text>
                                </Box>

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
        </Box>
    );
};

export default OrderDetailsStep;