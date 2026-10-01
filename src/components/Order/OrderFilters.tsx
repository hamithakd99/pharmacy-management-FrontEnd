import {
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    Input,
    NativeSelect,
    Text,
} from "@chakra-ui/react";
import {
    FiCalendar,
    FiFilter,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi";

interface OrderFiltersProps {
    search: string;
    statusFilter: string;
    paymentFilter: string;
    dateFrom: string;
    dateTo: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPaymentChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onClear: () => void;
}

const OrderFilters = ({
    search,
    statusFilter,
    paymentFilter,
    dateFrom,
    dateTo,
    onSearchChange,
    onStatusChange,
    onPaymentChange,
    onDateFromChange,
    onDateToChange,
    onClear,
}: OrderFiltersProps) => {
    const hasFilters =
        search.trim() !== "" ||
        statusFilter !== "ALL" ||
        paymentFilter !== "ALL" ||
        dateFrom !== "" ||
        dateTo !== "";

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            p={{ base: 4, md: 5 }}
            mb={5}
            boxShadow="sm"
        >
            <Flex
                align={{ base: "flex-start", md: "center" }}
                justify="space-between"
                gap={4}
                mb={4}
                direction={{ base: "column", md: "row" }}
            >
                <HStack gap={3}>
                    <Flex
                        w="40px"
                        h="40px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg="blue.50"
                        color="blue.600"
                    >
                        <FiFilter size={19} />
                    </Flex>

                    <Box>
                        <Text
                            fontSize="md"
                            fontWeight="700"
                            color="gray.800"
                        >
                            Order History
                        </Text>

                        <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={0.5}
                        >
                            Search and filter customer orders
                        </Text>
                    </Box>
                </HStack>

                {hasFilters && (
                    <Button
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                        onClick={onClear}
                    >
                        <FiX />
                        Clear Filters
                    </Button>
                )}
            </Flex>

            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "2fr 1fr 1fr",
                    xl: "2fr 1fr 1fr 1fr 1fr",
                }}
                gap={3}
            >
                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={1.5}
                    >
                        Search Orders
                    </Text>

                    <Box position="relative">
                        <Box
                            position="absolute"
                            left="12px"
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiSearch size={17} />
                        </Box>

                        <Input
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder="Order number, customer, phone or product..."
                            pl="40px"
                            size="md"
                            borderRadius="lg"
                            bg="gray.50"
                            borderColor="gray.200"
                            _focus={{
                                bg: "white",
                                borderColor: "blue.400",
                                boxShadow:
                                    "0 0 0 1px var(--chakra-colors-blue-400)",
                            }}
                        />
                    </Box>
                </Box>

                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={1.5}
                    >
                        Order Status
                    </Text>

                    <NativeSelect.Root size="md">
                        <NativeSelect.Field
                            value={statusFilter}
                            onChange={(event) =>
                                onStatusChange(event.target.value)
                            }
                            borderRadius="lg"
                            bg="gray.50"
                            borderColor="gray.200"
                        >
                            <option value="ALL">
                                All Statuses
                            </option>
                            <option value="COMPLETED">
                                Completed
                            </option>
                            <option value="DRAFT">
                                Draft
                            </option>
                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </NativeSelect.Field>

                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Box>

                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={1.5}
                    >
                        Payment Status
                    </Text>

                    <NativeSelect.Root size="md">
                        <NativeSelect.Field
                            value={paymentFilter}
                            onChange={(event) =>
                                onPaymentChange(event.target.value)
                            }
                            borderRadius="lg"
                            bg="gray.50"
                            borderColor="gray.200"
                        >
                            <option value="ALL">
                                All Payments
                            </option>
                            <option value="PAID">
                                Paid
                            </option>
                            <option value="PENDING">
                                Pending
                            </option>
                            <option value="PARTIAL">
                                Partial
                            </option>
                            <option value="REFUNDED">
                                Refunded
                            </option>
                        </NativeSelect.Field>

                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Box>

                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={1.5}
                    >
                        From Date
                    </Text>

                    <Box position="relative">
                        <Box
                            position="absolute"
                            left="12px"
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiCalendar size={16} />
                        </Box>

                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(event) =>
                                onDateFromChange(event.target.value)
                            }
                            pl="38px"
                            size="md"
                            borderRadius="lg"
                            bg="gray.50"
                            borderColor="gray.200"
                        />
                    </Box>
                </Box>

                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={1.5}
                    >
                        To Date
                    </Text>

                    <Box position="relative">
                        <Box
                            position="absolute"
                            left="12px"
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiCalendar size={16} />
                        </Box>

                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(event) =>
                                onDateToChange(event.target.value)
                            }
                            pl="38px"
                            size="md"
                            borderRadius="lg"
                            bg="gray.50"
                            borderColor="gray.200"
                        />
                    </Box>
                </Box>
            </Grid>

            {hasFilters && (
                <Flex
                    mt={4}
                    pt={3}
                    borderTopWidth="1px"
                    borderColor="gray.100"
                    align="center"
                    justify="space-between"
                    gap={3}
                    wrap="wrap"
                >
                    <HStack
                        gap={2}
                        color="gray.500"
                    >
                        <FiRefreshCw size={14} />

                        <Text fontSize="xs">
                            Filters are applied automatically
                        </Text>
                    </HStack>

                    <Button
                        size="xs"
                        variant="outline"
                        colorPalette="gray"
                        onClick={onClear}
                    >
                        Reset
                    </Button>
                </Flex>
            )}
        </Box>
    );
};

export default OrderFilters;