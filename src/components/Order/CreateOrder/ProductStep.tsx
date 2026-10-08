import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Button, Flex, Heading, HStack, Input, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import {
    FiCheck,
    FiMinus,
    FiPackage,
    FiPlus,
    FiSearch,
    FiShoppingCart,
    FiTrash2,
} from "react-icons/fi";

interface StockBatch {
    batchNumber: string;
}

interface StockBatchItem {
    id: number;
    availableQuantity: number;
    sellingPrice: number;
    expiryDate: string;
    stockBatch?: StockBatch;
}

interface Product {
    id: number;
    productId: string;
    name: string;
    brand?: string | null;
    sellingPrice?: number;
    totalStock?: number;
    stockBatchItems?: StockBatchItem[];
}

export interface SelectedProduct {
    allocationId: string;
    productId: number;
    productCode: string;
    name: string;
    brand?: string | null;
    batchId: number;
    batchNumber?: string;
    expiryDate: string;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
}

interface ProductStepProps {
    selectedProducts: SelectedProduct[];
    onProductsChange: (products: SelectedProduct[]) => void;
}

const ProductStep = ({
    selectedProducts,
    onProductsChange,
}: ProductStepProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/product/all`
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.products || [];

                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Unable to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getAvailableStock = (product: Product) => {
        if (product.stockBatchItems?.length) {
            return product.stockBatchItems.reduce(
                (total, batch) =>
                    total + Number(batch.availableQuantity || 0),
                0
            );
        }

        if (typeof product.totalStock === "number") {
            return Math.max(0, product.totalStock);
        }

        return 0;
    };

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return products;
        }

        return products.filter((product) => {
            return (
                product.name?.toLowerCase().includes(keyword) ||
                product.productId?.toLowerCase().includes(keyword) ||
                product.brand?.toLowerCase().includes(keyword)
            );
        });
    }, [products, search]);

    const getSelectedQuantity = (productId: number) => {
        return selectedProducts
            .filter((item) => item.productId === productId)
            .reduce(
                (total, item) => total + item.quantity,
                0
            );
    };

    const addProduct = (product: Product) => {
        const availableBatches = (product.stockBatchItems || [])
            .filter(
                (batch) =>
                    Number(batch.availableQuantity || 0) > 0 &&
                    new Date(batch.expiryDate) > new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.expiryDate).getTime() -
                    new Date(b.expiryDate).getTime()
            );

        const availableStock = availableBatches.reduce(
            (total, batch) =>
                total + Number(batch.availableQuantity || 0),
            0
        );

        if (availableStock <= 0) {
            return;
        }

        const existingQuantity = getSelectedQuantity(product.id);

        if (existingQuantity >= availableStock) {
            return;
        }

        const requestedQuantity = existingQuantity + 1;

        const remainingToAllocate = requestedQuantity;

        const allocations: SelectedProduct[] = [];

        let remaining = remainingToAllocate;

        for (const batch of availableBatches) {
            if (remaining <= 0) {
                break;
            }

            const batchAvailable = Number(
                batch.availableQuantity || 0
            );

            const allocatedQuantity = Math.min(
                remaining,
                batchAvailable
            );

            if (allocatedQuantity <= 0) {
                continue;
            }

            allocations.push({
                allocationId:
                    `${product.id}-${batch.id}`,
                productId: product.id,
                productCode: product.productId,
                name: product.name,
                brand: product.brand || "",
                batchId: batch.id,
                batchNumber:
                    batch.stockBatch?.batchNumber,
                expiryDate: batch.expiryDate,
                quantity: allocatedQuantity,
                sellingPrice: Number(
                    batch.sellingPrice || 0
                ),
                lineTotal:
                    allocatedQuantity *
                    Number(batch.sellingPrice || 0)
            });

            remaining -= allocatedQuantity;
        }

        if (remaining > 0) {
            return;
        }

        onProductsChange(
            [
                ...selectedProducts.filter(
                    (item) =>
                        item.productId !== product.id
                ),
                ...allocations
            ]
        );
    };

    const updateQuantity = (
        productId: number,
        quantity: number
    ) => {
        if (quantity <= 0) {
            removeProduct(productId);
            return;
        }

        const product = products.find(
            (item) => item.id === productId
        );

        if (!product) {
            return;
        }

        const availableBatches = (product.stockBatchItems || [])
            .filter(
                (batch) =>
                    Number(batch.availableQuantity || 0) > 0 &&
                    new Date(batch.expiryDate) > new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.expiryDate).getTime() -
                    new Date(b.expiryDate).getTime()
            );

        const totalAvailable = availableBatches.reduce(
            (total, batch) =>
                total + Number(batch.availableQuantity || 0),
            0
        );

        const requestedQuantity = Math.min(
            quantity,
            totalAvailable
        );

        let remaining = requestedQuantity;

        const allocations: SelectedProduct[] = [];

        for (const batch of availableBatches) {
            if (remaining <= 0) {
                break;
            }

            const batchAvailable = Number(
                batch.availableQuantity || 0
            );

            const allocatedQuantity = Math.min(
                remaining,
                batchAvailable
            );

            if (allocatedQuantity <= 0) {
                continue;
            }

            allocations.push({
                allocationId:
                    `${product.id}-${batch.id}`,
                productId: product.id,
                productCode: product.productId,
                name: product.name,
                brand: product.brand || "",
                batchId: batch.id,
                batchNumber:
                    batch.stockBatch?.batchNumber,
                expiryDate: batch.expiryDate,
                quantity: allocatedQuantity,
                sellingPrice: Number(
                    batch.sellingPrice || 0
                ),
                lineTotal:
                    allocatedQuantity *
                    Number(batch.sellingPrice || 0)
            });

            remaining -= allocatedQuantity;
        }

        onProductsChange([
            ...selectedProducts.filter(
                (item) => item.productId !== productId
            ),
            ...allocations
        ]);
    };

    const removeProduct = (productId: number) => {
        onProductsChange(
            selectedProducts.filter(
                (item) => item.productId !== productId
            )
        );
    };

    const totalItems = selectedProducts.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = selectedProducts.reduce(
        (total, item) => total + item.lineTotal,
        0
    );

    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <Box>
            <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
                mb={6}
            >
                <Box>
                    <Heading size="md" color="gray.800">
                        Add Products
                    </Heading>
                    <Text mt={1} fontSize="sm" color="gray.500">
                        Search and add products to this customer order.
                    </Text>
                </Box>

                <Flex
                    align="center"
                    gap={2}
                    px={4}
                    py={2}
                    bg="blue.50"
                    border="1px solid"
                    borderColor="blue.100"
                    borderRadius="lg"
                >
                    <FiShoppingCart color="#2563EB" />
                    <Text fontSize="sm" fontWeight="600" color="blue.700">
                        {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </Text>
                </Flex>
            </Flex>

            <Box mb={6}>
                <Box position="relative">
                    <Box
                        position="absolute"
                        left="14px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                        zIndex={1}
                    >
                        <FiSearch />
                    </Box>

                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by product name, ID or brand..."
                        pl="42px"
                        h="46px"
                        bg="white"
                        borderColor="gray.200"
                        _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                    />
                </Box>

                <Flex
                    justify="space-between"
                    align="center"
                    mt={3}
                    fontSize="xs"
                    color="gray.500"
                >
                    <Text>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1
                            ? "product"
                            : "products"}{" "}
                        found
                    </Text>

                    {search && (
                        <Button
                            variant="ghost"
                            size="xs"
                            colorPalette="blue"
                            onClick={() => setSearch("")}
                        >
                            Clear search
                        </Button>
                    )}
                </Flex>
            </Box>

            {loading ? (
                <Flex
                    minH="220px"
                    align="center"
                    justify="center"
                    direction="column"
                    gap={3}
                >
                    <Spinner size="lg" color="blue.500" />
                    <Text fontSize="sm" color="gray.500">
                        Loading products...
                    </Text>
                </Flex>
            ) : error ? (
                <Box
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="red.200"
                    bg="red.50"
                    borderRadius="lg"
                >
                    <Text fontSize="sm" color="red.600">
                        {error}
                    </Text>
                </Box>
            ) : filteredProducts.length === 0 ? (
                <Box
                    py={12}
                    textAlign="center"
                    border="1px dashed"
                    borderColor="gray.300"
                    borderRadius="lg"
                    bg="gray.50"
                >
                    <FiPackage
                        size={32}
                        style={{
                            margin: "0 auto 12px",
                            color: "#9CA3AF",
                        }}
                    />
                    <Text fontWeight="600" color="gray.600">
                        No products found
                    </Text>
                    <Text mt={1} fontSize="sm" color="gray.400">
                        Try searching with another product name or ID.
                    </Text>
                </Box>
            ) : (
                <Box>
                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                        mb={3}
                    >
                        Available Products
                    </Text>

                    <SimpleGrid
                        columns={{ base: 1, md: 2, xl: 3 }}
                        gap={4}
                    >
                        {filteredProducts.map((product) => {
                            const availableStock =
                                getAvailableStock(product);

                            const selectedQuantity =
                                getSelectedQuantity(product.id);

                            const isSelected = selectedQuantity > 0;
                            const isOutOfStock = availableStock <= 0;

                            return (
                                <Box
                                    key={product.id}
                                    position="relative"
                                    border="1px solid"
                                    borderColor={
                                        isSelected
                                            ? "blue.300"
                                            : "gray.200"
                                    }
                                    borderRadius="lg"
                                    bg="white"
                                    p={4}
                                    transition="all 0.2s"
                                    boxShadow={
                                        isSelected ? "md" : "sm"
                                    }
                                    _hover={{
                                        borderColor: isOutOfStock
                                            ? "gray.200"
                                            : "blue.300",
                                        boxShadow: isOutOfStock
                                            ? "sm"
                                            : "md",
                                        transform: isOutOfStock
                                            ? "none"
                                            : "translateY(-1px)",
                                    }}
                                >
                                    {isSelected && (
                                        <Flex
                                            position="absolute"
                                            top={3}
                                            right={3}
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

                                    <Box pr={isSelected ? 8 : 0}>
                                        <Text
                                            fontSize="xs"
                                            color="blue.600"
                                            fontWeight="600"
                                            mb={1}
                                        >
                                            {product.productId}
                                        </Text>

                                        <Text
                                            fontSize="md"
                                            fontWeight="700"
                                            color="gray.800"
                                            lineHeight="1.3"
                                        >
                                            {product.name}
                                        </Text>

                                        {product.brand && (
                                            <Text
                                                mt={1}
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {product.brand}
                                            </Text>
                                        )}
                                    </Box>

                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        mt={4}
                                        pt={3}
                                        borderTop="1px solid"
                                        borderColor="gray.100"
                                    >
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Selling Price
                                            </Text>
                                            <Text
                                                fontSize="md"
                                                fontWeight="700"
                                                color="gray.800"
                                            >
                                                {formatCurrency(
                                                    Number(
                                                        product.sellingPrice ||
                                                        0
                                                    )
                                                )}
                                            </Text>
                                        </Box>

                                        <Box textAlign="right">
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Available
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="700"
                                                color={
                                                    isOutOfStock
                                                        ? "red.500"
                                                        : availableStock <= 10
                                                            ? "orange.500"
                                                            : "green.600"
                                                }
                                            >
                                                {availableStock}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    {isSelected ? (
                                        <Flex
                                            align="center"
                                            justify="space-between"
                                            mt={4}
                                            gap={2}
                                        >
                                            <HStack
                                                gap={1}
                                                border="1px solid"
                                                borderColor="gray.200"
                                                borderRadius="md"
                                                p={1}
                                            >
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    disabled={
                                                        selectedQuantity <= 1
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            product.id,
                                                            selectedQuantity - 1
                                                        )
                                                    }
                                                >
                                                    <FiMinus />
                                                </Button>

                                                <Text
                                                    minW="28px"
                                                    textAlign="center"
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {selectedQuantity}
                                                </Text>

                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    disabled={
                                                        selectedQuantity >=
                                                        availableStock
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            product.id,
                                                            selectedQuantity + 1
                                                        )
                                                    }
                                                >
                                                    <FiPlus />
                                                </Button>
                                            </HStack>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                onClick={() =>
                                                    removeProduct(product.id)
                                                }
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        </Flex>
                                    ) : (
                                        <Button
                                            mt={4}
                                            w="full"
                                            size="sm"
                                            colorPalette="blue"
                                            disabled={isOutOfStock}
                                            onClick={() =>
                                                addProduct(product)
                                            }
                                        >
                                            <FiPlus />
                                            {isOutOfStock
                                                ? "Out of Stock"
                                                : "Add Product"}
                                        </Button>
                                    )}
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                </Box>
            )}

            <Box
                mt={8}
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
                    justify="space-between"
                    align="center"
                >
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.800"
                        >
                            Selected Products
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            Products included in this order
                        </Text>
                    </Box>

                    <Text
                        fontSize="sm"
                        fontWeight="700"
                        color="blue.600"
                    >
                        {formatCurrency(subtotal)}
                    </Text>
                </Flex>

                {selectedProducts.length === 0 ? (
                    <Flex
                        minH="150px"
                        align="center"
                        justify="center"
                        direction="column"
                        gap={2}
                        px={5}
                    >
                        <FiShoppingCart
                            size={28}
                            style={{ color: "#9CA3AF" }}
                        />
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.500"
                        >
                            No products selected
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            Add products from the list above.
                        </Text>
                    </Flex>
                ) : (
                    <Box>
                        {selectedProducts.map((item, index) => (
                            <Flex
                                key={item.allocationId}
                                px={5}
                                py={4}
                                align={{
                                    base: "flex-start",
                                    md: "center",
                                }}
                                justify="space-between"
                                gap={4}
                                direction={{
                                    base: "column",
                                    md: "row",
                                }}
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

                                <HStack gap={6}>
                                    <Box textAlign="right">
                                        <Text
                                            fontSize="xs"
                                            color="gray.400"
                                        >
                                            Unit Price
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="gray.700"
                                        >
                                            {formatCurrency(
                                                item.sellingPrice
                                            )}
                                        </Text>
                                    </Box>

                                    <HStack
                                        gap={1}
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="md"
                                        p={1}
                                    >
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            disabled={item.quantity <= 1}
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            <FiMinus />
                                        </Button>

                                        <Text
                                            minW="28px"
                                            textAlign="center"
                                            fontSize="sm"
                                            fontWeight="700"
                                        >
                                            {item.quantity}
                                        </Text>

                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            disabled={
                                                item.quantity >=
                                                getAvailableStock(
                                                    products.find(
                                                        (product) =>
                                                            product.id ===
                                                            item.productId
                                                    ) || {
                                                        id: item.productId,
                                                        productId: item.productCode,
                                                        name: item.name,
                                                        totalStock: 0,
                                                    }
                                                )
                                            }
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <FiPlus />
                                        </Button>
                                    </HStack>

                                    <Box
                                        minW={{ base: "auto", md: "110px" }}
                                        textAlign="right"
                                    >
                                        <Text
                                            fontSize="xs"
                                            color="gray.400"
                                        >
                                            Total
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="gray.800"
                                        >
                                            {formatCurrency(item.lineTotal)}
                                        </Text>
                                    </Box>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() =>
                                            removeProduct(item.productId)
                                        }
                                    >
                                        <FiTrash2 />
                                    </Button>
                                </HStack>
                            </Flex>
                        ))}
                    </Box>
                )}

                {selectedProducts.length > 0 && (
                    <Flex
                        px={5}
                        py={4}
                        bg="gray.50"
                        borderTop="1px solid"
                        borderColor="gray.200"
                        justify="flex-end"
                    >
                        <Box textAlign="right">
                            <Text fontSize="xs" color="gray.500">
                                Order Subtotal
                            </Text>
                            <Text
                                fontSize="xl"
                                fontWeight="800"
                                color="gray.900"
                            >
                                {formatCurrency(subtotal)}
                            </Text>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default ProductStep;