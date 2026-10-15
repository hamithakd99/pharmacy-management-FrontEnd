import { useEffect, useState } from "react";
import api from "@/api/axios";

import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
    Skeleton,
} from "@chakra-ui/react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#0F766E",
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
];

interface ProductCategory {
    id?: number | string;
    name?: string;
    categoryName?: string;
}

interface Product {
    id: number | string;
    isActive?: boolean;
    categoryId?: number | string | null;
    category?: ProductCategory | null;
    categoryName?: string | null;
}

interface Category {
    id: number | string;
    name: string;
}

interface CategoryData {
    name: string;
    value: number;
}

export default function CategoryChart() {
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch products and actual category names together.
                const [productsResponse, categoriesResponse] =
                    await Promise.all([
                        api.get("/product/all"),
                        api.get("/category/all"),
                    ]);

                const responseData = productsResponse.data;

                const products: Product[] = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : Array.isArray(responseData?.products)
                            ? responseData.products
                            : [];

                const categories: Category[] = Array.isArray(
                    categoriesResponse.data
                )
                    ? categoriesResponse.data
                    : [];

                // Map category IDs to their actual names.
                const categoryNames = new Map<string, string>(
                    categories.map((category) => [
                        String(category.id),
                        category.name,
                    ])
                );

                // Count active products only.
                const activeProducts = products.filter(
                    (product) => product.isActive !== false
                );

                setTotalProducts(activeProducts.length);

                // Group products by their actual category names.
                const categoryCounts = new Map<string, number>();

                activeProducts.forEach((product) => {
                    const categoryName =
                        product.category?.name ??
                        product.category?.categoryName ??
                        product.categoryName ??
                        (product.categoryId != null
                            ? categoryNames.get(
                                String(product.categoryId)
                            )
                            : undefined) ??
                        "Uncategorized";

                    categoryCounts.set(
                        categoryName,
                        (categoryCounts.get(categoryName) ?? 0) + 1
                    );
                });

                const chartData = Array.from(
                    categoryCounts,
                    ([name, value]) => ({ name, value })
                ).sort((a, b) => b.value - a.value);

                setCategoryData(chartData);
            } catch (err) {
                console.error("Failed to fetch category data:", err);
                setError("Unable to load product categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, []);

    return (
        <Box
            bg="white"
            rounded="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            p={{ base: "4", md: "6" }}
            h="100%"
            minW="0"
        >
            {/* Header */}
            <Flex justify="space-between" align="center" mb="5">
                <Box>
                    <Heading size="md" color="gray.800">
                        Product Categories
                    </Heading>
                    <Text color="gray.500" fontSize="sm" mt="1">
                        Distribution of products by category
                    </Text>
                </Box>
            </Flex>

            {/* Loading */}
            {loading ? (
                <VStack align="stretch" gap="4">
                    <Skeleton height="260px" rounded="lg" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                </VStack>
            ) : error ? (
                /* Error */
                <Box py="10" textAlign="center">
                    <Text color="red.500" fontSize="sm">
                        {error}
                    </Text>
                </Box>
            ) : categoryData.length === 0 ? (
                /* Empty state */
                <Box py="10" textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                        No product categories available.
                    </Text>
                </Box>
            ) : (
                <>
                    {/* Pie Chart */}
                    <Box h="260px" w="100%" minW="0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                >
                                    {categoryData.map((item, index) => (
                                        <Cell
                                            key={item.name}
                                            fill={
                                                COLORS[index % COLORS.length]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value) => [
                                        value,
                                        "Products",
                                    ]}
                                />

                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    wrapperStyle={{ fontSize: "12px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Category List */}
                    <VStack mt="4" gap="3" align="stretch">
                        {categoryData.map((item, index) => (
                            <HStack
                                key={item.name}
                                justify="space-between"
                                gap="3"
                            >
                                <HStack gap="2" minW="0">
                                    <Box
                                        w="12px"
                                        h="12px"
                                        flexShrink={0}
                                        rounded="full"
                                        bg={
                                            COLORS[index % COLORS.length]
                                        }
                                    />

                                    <Text fontSize="sm" truncate>
                                        {item.name}
                                    </Text>
                                </HStack>

                                <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    flexShrink={0}
                                >
                                    {item.value}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </>
            )}

            {/* Total Active Products */}
            <Box
                mt="6"
                pt="4"
                borderTop="1px solid"
                borderColor="gray.100"
            >
                <Text fontSize="sm" color="gray.500">
                    Total Active Products
                </Text>

                <Heading size="lg" color="teal.600" mt="1">
                    {loading
                        ? "—"
                        : totalProducts.toLocaleString()}
                </Heading>
            </Box>
        </Box>
    );
}