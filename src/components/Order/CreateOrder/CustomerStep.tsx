import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Spinner,
    Text,
} from "@chakra-ui/react";
import {
    FiCheck,
    FiChevronRight,
    FiMail,
    FiPhone,
    FiSearch,
    FiUser,
    FiUserPlus,
    FiUsers,
} from "react-icons/fi";

export interface Customer {
    id: number;
    userId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    contactNumber?: string;
    city?: string;
    role?: string;
}

interface CustomerStepProps {
    selectedCustomer: Customer | null;
    isWalkInCustomer: boolean;
    onSelectCustomer: (customer: Customer) => void;
    onWalkInCustomer: () => void;
}

const CustomerStep = ({
    selectedCustomer,
    isWalkInCustomer,
    onSelectCustomer,
    onWalkInCustomer,
}: CustomerStepProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/external/all-external-users`
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.users ||
                      response.data?.externalUsers ||
                      [];

                const customerList = data.filter(
                    (user: Customer) => user.role === "CUSTOMER"
                );

                setCustomers(customerList);
            } catch (error) {
                console.error("Failed to load customers:", error);
                setError("Unable to load registered customers.");
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return customers;
        }

        return customers.filter((customer) => {
            const fullName =
                `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();

            return (
                fullName.includes(value) ||
                customer.firstName?.toLowerCase().includes(value) ||
                customer.lastName?.toLowerCase().includes(value) ||
                customer.email?.toLowerCase().includes(value) ||
                customer.contactNumber?.toLowerCase().includes(value) ||
                customer.city?.toLowerCase().includes(value) ||
                customer.userId?.toLowerCase().includes(value)
            );
        });
    }, [customers, search]);

    const getInitials = (customer: Customer) => {
        const first = customer.firstName?.charAt(0) || "";
        const last = customer.lastName?.charAt(0) || "";

        return `${first}${last}`.toUpperCase() || "C";
    };

    const getCustomerName = (customer: Customer) => {
        return (
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            "Unnamed Customer"
        );
    };

    return (
        <Box>
            <Box mb={6}>
                <Heading size="md" color="gray.800">
                    Select Customer
                </Heading>
                <Text mt={1} fontSize="sm" color="gray.500">
                    Select a registered customer or continue as a walk-in
                    customer.
                </Text>
            </Box>

            <Flex
                gap={4}
                direction={{ base: "column", md: "row" }}
                mb={6}
            >
                <Box
                    flex={1}
                    as="button"
                    textAlign="left"
                    border="2px solid"
                    borderColor={
                        !isWalkInCustomer ? "blue.500" : "gray.200"
                    }
                    borderRadius="xl"
                    bg={!isWalkInCustomer ? "blue.50" : "white"}
                    p={5}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                        borderColor: "blue.400",
                        bg: "blue.50",
                    }}
                    onClick={() => {
                        if (customers.length > 0) {
                            const firstCustomer = customers[0];

                            if (isWalkInCustomer) {
                                onSelectCustomer(firstCustomer);
                            }
                        }
                    }}
                >
                    <Flex align="center" justify="space-between">
                        <Flex align="center" gap={4}>
                            <Flex
                                w="46px"
                                h="46px"
                                align="center"
                                justify="center"
                                borderRadius="lg"
                                bg="blue.100"
                                color="blue.600"
                            >
                                <FiUsers size={21} />
                            </Flex>

                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.800"
                                >
                                    Registered Customer
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Select from existing customers
                                </Text>
                            </Box>
                        </Flex>

                        {!isWalkInCustomer && (
                            <Flex
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                bg="blue.600"
                                color="white"
                                align="center"
                                justify="center"
                            >
                                <FiCheck size={14} />
                            </Flex>
                        )}
                    </Flex>
                </Box>

                <Box
                    flex={1}
                    as="button"
                    textAlign="left"
                    border="2px solid"
                    borderColor={
                        isWalkInCustomer ? "green.500" : "gray.200"
                    }
                    borderRadius="xl"
                    bg={isWalkInCustomer ? "green.50" : "white"}
                    p={5}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                        borderColor: "green.400",
                        bg: "green.50",
                    }}
                    onClick={onWalkInCustomer}
                >
                    <Flex align="center" justify="space-between">
                        <Flex align="center" gap={4}>
                            <Flex
                                w="46px"
                                h="46px"
                                align="center"
                                justify="center"
                                borderRadius="lg"
                                bg="green.100"
                                color="green.600"
                            >
                                <FiUserPlus size={21} />
                            </Flex>

                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.800"
                                >
                                    Walk-in Customer
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Customer is not registered
                                </Text>
                            </Box>
                        </Flex>

                        {isWalkInCustomer && (
                            <Flex
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                bg="green.600"
                                color="white"
                                align="center"
                                justify="center"
                            >
                                <FiCheck size={14} />
                            </Flex>
                        )}
                    </Flex>
                </Box>
            </Flex>

            {!isWalkInCustomer && (
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    overflow="hidden"
                    bg="white"
                >
                    <Box
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            gap={4}
                        >
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.800"
                                >
                                    Registered Customers
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    {customers.length} registered{" "}
                                    {customers.length === 1
                                        ? "customer"
                                        : "customers"}
                                </Text>
                            </Box>

                            <Box
                                position="relative"
                                w={{ base: "100%", md: "320px" }}
                            >
                                <Box
                                    position="absolute"
                                    left="13px"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    color="gray.400"
                                    zIndex={1}
                                >
                                    <FiSearch />
                                </Box>

                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search customer..."
                                    pl="40px"
                                    bg="white"
                                    h="42px"
                                />
                            </Box>
                        </Flex>
                    </Box>

                    <Box>
                        {loading ? (
                            <Flex
                                minH="220px"
                                align="center"
                                justify="center"
                                direction="column"
                                gap={3}
                            >
                                <Spinner
                                    size="lg"
                                    color="blue.500"
                                />
                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                >
                                    Loading customers...
                                </Text>
                            </Flex>
                        ) : error ? (
                            <Box
                                p={8}
                                textAlign="center"
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="red.600"
                                >
                                    {error}
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Please refresh the page and try
                                    again.
                                </Text>
                            </Box>
                        ) : filteredCustomers.length === 0 ? (
                            <Flex
                                minH="220px"
                                align="center"
                                justify="center"
                                direction="column"
                                gap={3}
                                px={5}
                            >
                                <Flex
                                    w="52px"
                                    h="52px"
                                    align="center"
                                    justify="center"
                                    borderRadius="full"
                                    bg="gray.100"
                                    color="gray.400"
                                >
                                    <FiUsers size={22} />
                                </Flex>

                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="gray.600"
                                >
                                    {search
                                        ? "No customers found"
                                        : "No registered customers"}
                                </Text>

                                <Text
                                    fontSize="xs"
                                    color="gray.400"
                                    textAlign="center"
                                >
                                    {search
                                        ? "Try searching with another name, phone number or email."
                                        : "There are currently no registered customers."}
                                </Text>

                                {search && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorPalette="blue"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </Flex>
                        ) : (
                            <Box maxH="360px" overflowY="auto">
                                {filteredCustomers.map(
                                    (customer) => {
                                        const isSelected =
                                            selectedCustomer?.id ===
                                            customer.id;

                                        return (
                                            <Box
                                                key={customer.id}
                                                as="button"
                                                w="100%"
                                                textAlign="left"
                                                px={5}
                                                py={4}
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                                bg={
                                                    isSelected
                                                        ? "blue.50"
                                                        : "white"
                                                }
                                                cursor="pointer"
                                                transition="all 0.15s"
                                                _hover={{
                                                    bg: "gray.50",
                                                }}
                                                onClick={() =>
                                                    onSelectCustomer(
                                                        customer
                                                    )
                                                }
                                            >
                                                <Flex
                                                    align="center"
                                                    gap={4}
                                                >
                                                    <Flex
                                                        w="42px"
                                                        h="42px"
                                                        flexShrink={0}
                                                        align="center"
                                                        justify="center"
                                                        borderRadius="full"
                                                        bg={
                                                            isSelected
                                                                ? "blue.600"
                                                                : "gray.100"
                                                        }
                                                        color={
                                                            isSelected
                                                                ? "white"
                                                                : "gray.600"
                                                        }
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {getInitials(
                                                            customer
                                                        )}
                                                    </Flex>

                                                    <Box flex={1}>
                                                        <Flex
                                                            align="center"
                                                            gap={2}
                                                        >
                                                            <Text
                                                                fontSize="sm"
                                                                fontWeight="700"
                                                                color="gray.800"
                                                            >
                                                                {getCustomerName(
                                                                    customer
                                                                )}
                                                            </Text>

                                                            {isSelected && (
                                                                <Box
                                                                    px={2}
                                                                    py="2px"
                                                                    borderRadius="full"
                                                                    bg="blue.100"
                                                                    color="blue.700"
                                                                    fontSize="10px"
                                                                    fontWeight="700"
                                                                >
                                                                    SELECTED
                                                                </Box>
                                                            )}
                                                        </Flex>

                                                        <Flex
                                                            mt={1}
                                                            gap={4}
                                                            flexWrap="wrap"
                                                        >
                                                            {customer.contactNumber && (
                                                                <HStack
                                                                    gap={1}
                                                                    color="gray.500"
                                                                >
                                                                    <FiPhone
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    <Text fontSize="xs">
                                                                        {
                                                                            customer.contactNumber
                                                                        }
                                                                    </Text>
                                                                </HStack>
                                                            )}

                                                            {customer.email && (
                                                                <HStack
                                                                    gap={1}
                                                                    color="gray.500"
                                                                >
                                                                    <FiMail
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    <Text fontSize="xs">
                                                                        {
                                                                            customer.email
                                                                        }
                                                                    </Text>
                                                                </HStack>
                                                            )}

                                                            {customer.city && (
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.500"
                                                                >
                                                                    {
                                                                        customer.city
                                                                    }
                                                                </Text>
                                                            )}
                                                        </Flex>
                                                    </Box>

                                                    <Flex
                                                        w="32px"
                                                        h="32px"
                                                        align="center"
                                                        justify="center"
                                                        borderRadius="md"
                                                        color={
                                                            isSelected
                                                                ? "blue.600"
                                                                : "gray.400"
                                                        }
                                                        bg={
                                                            isSelected
                                                                ? "blue.100"
                                                                : "gray.50"
                                                        }
                                                    >
                                                        {isSelected ? (
                                                            <FiCheck />
                                                        ) : (
                                                            <FiChevronRight />
                                                        )}
                                                    </Flex>
                                                </Flex>
                                            </Box>
                                        );
                                    }
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            {isWalkInCustomer && (
                <Box
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="xl"
                    bg="green.50"
                    p={5}
                >
                    <Flex
                        align={{ base: "flex-start", md: "center" }}
                        justify="space-between"
                        gap={4}
                    >
                        <Flex align="center" gap={4}>
                            <Flex
                                w="44px"
                                h="44px"
                                align="center"
                                justify="center"
                                borderRadius="lg"
                                bg="green.100"
                                color="green.600"
                            >
                                <FiUser size={20} />
                            </Flex>

                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="green.800"
                                >
                                    Walk-in Customer Selected
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="green.700"
                                >
                                    This order will be created without
                                    a registered customer.
                                </Text>
                            </Box>
                        </Flex>

                        <Box
                            px={3}
                            py={1.5}
                            borderRadius="full"
                            bg="green.100"
                            color="green.700"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            WALK-IN
                        </Box>
                    </Flex>
                </Box>
            )}

            {!isWalkInCustomer && selectedCustomer && (
                <Box
                    mt={4}
                    px={5}
                    py={4}
                    border="1px solid"
                    borderColor="blue.200"
                    borderRadius="lg"
                    bg="blue.50"
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        gap={4}
                    >
                        <Box>
                            <Text
                                fontSize="xs"
                                color="blue.600"
                                fontWeight="600"
                            >
                                Selected Customer
                            </Text>

                            <Text
                                mt={1}
                                fontSize="sm"
                                fontWeight="700"
                                color="blue.900"
                            >
                                {getCustomerName(selectedCustomer)}
                            </Text>
                        </Box>

                        <FiCheck color="#2563EB" />
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default CustomerStep;