import {
    Badge,
    Box,
    Flex,
    HStack,
    Progress,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    FiArrowUp,
    FiPackage,
    FiShoppingBag,
    FiTrendingUp,
} from "react-icons/fi";

interface TopSellingProduct {
    productId: number;
    name: string;
    quantity: number;
    sales: number;
}

interface TopSellingProductsProps {
    products: TopSellingProduct[];
}

const TopSellingProducts = ({
    products,
}: TopSellingProductsProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const maxQuantity =
        products.length > 0
            ? Math.max(...products.map((product) => product.quantity))
            : 0;

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
        >
            <Flex
                px={{ base: 4, md: 5 }}
                py={4}
                align="center"
                justify="space-between"
                borderBottomWidth="1px"
                borderColor="gray.100"
            >
                <HStack gap={3}>
                    <Flex
                        w="42px"
                        h="42px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg="purple.50"
                        color="purple.600"
                    >
                        <FiTrendingUp size={20} />
                    </Flex>

                    <Box>
                        <Text
                            fontSize="lg"
                            fontWeight="700"
                            color="gray.800"
                        >
                            Top Selling Products
                        </Text>

                        <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={0.5}
                        >
                            Best performing products
                        </Text>
                    </Box>
                </HStack>

                <Badge
                    colorPalette="purple"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                >
                    Top {products.length}
                </Badge>
            </Flex>

            {products.length === 0 ? (
                <Flex
                    minH="300px"
                    align="center"
                    justify="center"
                    px={5}
                >
                    <VStack gap={3}>
                        <Flex
                            w="56px"
                            h="56px"
                            align="center"
                            justify="center"
                            borderRadius="full"
                            bg="gray.100"
                            color="gray.500"
                        >
                            <FiPackage size={24} />
                        </Flex>

                        <Box textAlign="center">
                            <Text
                                fontWeight="600"
                                color="gray.700"
                            >
                                No sales data yet
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={1}
                            >
                                Product sales will appear here after orders
                                are completed.
                            </Text>
                        </Box>
                    </VStack>
                </Flex>
            ) : (
                <VStack
                    align="stretch"
                    gap={0}
                    divideY="1px"
                    divideColor="gray.100"
                >
                    {products.map((product, index) => {
                        const progressValue =
                            maxQuantity > 0
                                ? (product.quantity / maxQuantity) * 100
                                : 0;

                        return (
                            <Box
                                key={product.productId}
                                px={{ base: 4, md: 5 }}
                                py={4}
                                _hover={{
                                    bg: "gray.50",
                                }}
                                transition="background 0.2s"
                            >
                                <Flex
                                    align="center"
                                    gap={3}
                                >
                                    <Flex
                                        w="34px"
                                        h="34px"
                                        flexShrink={0}
                                        align="center"
                                        justify="center"
                                        borderRadius="lg"
                                        bg={
                                            index === 0
                                                ? "purple.100"
                                                : "gray.100"
                                        }
                                        color={
                                            index === 0
                                                ? "purple.700"
                                                : "gray.600"
                                        }
                                        fontWeight="700"
                                        fontSize="sm"
                                    >
                                        {index + 1}
                                    </Flex>

                                    <Flex
                                        w="40px"
                                        h="40px"
                                        flexShrink={0}
                                        align="center"
                                        justify="center"
                                        borderRadius="lg"
                                        bg="gray.100"
                                        color="gray.500"
                                    >
                                        <FiShoppingBag size={18} />
                                    </Flex>

                                    <Box
                                        flex="1"
                                        minW={0}
                                    >
                                        <Flex
                                            align="center"
                                            justify="space-between"
                                            gap={3}
                                        >
                                            <Box minW={0}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                    color="gray.800"
                                                    overflow="hidden"
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                >
                                                    {product.name}
                                                </Text>

                                                <HStack
                                                    gap={2}
                                                    mt={1}
                                                >
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                    >
                                                        {product.quantity}{" "}
                                                        units sold
                                                    </Text>

                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.300"
                                                    >
                                                        •
                                                    </Text>

                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                    >
                                                        {formatCurrency(
                                                            product.sales
                                                        )}
                                                    </Text>
                                                </HStack>
                                            </Box>

                                            <HStack
                                                gap={1}
                                                color="green.600"
                                                flexShrink={0}
                                            >
                                                <FiArrowUp size={13} />

                                                <Text
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                >
                                                    Selling
                                                </Text>
                                            </HStack>
                                        </Flex>

                                        <Progress.Root
                                            value={progressValue}
                                            size="sm"
                                            mt={3}
                                            borderRadius="full"
                                        >
                                            <Progress.Track
                                                bg="gray.100"
                                                borderRadius="full"
                                            >
                                                <Progress.Range
                                                    bg="purple.500"
                                                    borderRadius="full"
                                                />
                                            </Progress.Track>
                                        </Progress.Root>
                                    </Box>
                                </Flex>
                            </Box>
                        );
                    })}
                </VStack>
            )}

            {products.length > 0 && (
                <Flex
                    px={5}
                    py={3}
                    align="center"
                    gap={2}
                    borderTopWidth="1px"
                    borderColor="gray.100"
                    bg="gray.50"
                >
                    <FiTrendingUp
                        size={14}
                        color="currentColor"
                    />

                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        Ranked by quantity sold from completed orders
                    </Text>
                </Flex>
            )}
        </Box>
    );
};

export default TopSellingProducts;