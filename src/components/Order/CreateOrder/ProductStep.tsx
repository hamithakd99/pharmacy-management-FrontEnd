
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Spinner,
    Text,
} from "@chakra-ui/react";

import {
    FiCheck,
    FiMinus,
    FiPackage,
    FiPlus,
    FiSearch,
    FiShoppingCart,
    FiTrash2,
} from "react-icons/fi";

import api from "@/api/axios";

interface StockBatch {
    batchNumber: string;
}

interface StockBatchItem {
    id: number;
    availableQuantity: number;
    sellingPrice: number;
    retailPrice?: number | null;
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
    freeIssueQuantity: number;
    sellingPrice: number;
    lineTotal: number;
}

interface ProductStepProps {
    selectedProducts: SelectedProduct[];
    onProductsChange: (products: SelectedProduct[]) => void;
    saleType: "WHOLESALE" | "RETAIL";
    onSaleTypeChange: (saleType: "WHOLESALE" | "RETAIL") => void;
}

const ProductStep = ({
    selectedProducts,
    onProductsChange,
    saleType,
    onSaleTypeChange,
}: ProductStepProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [quantityDrafts, setQuantityDrafts] = useState<
        Record<number, string>
    >({});

    // --------------------------------------------------
    // FETCH PRODUCTS
    // --------------------------------------------------

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/product/all");
                const responseData = response.data;

                const data = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : Array.isArray(responseData?.products)
                            ? responseData.products
                            : [];

                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);

                setError(
                    "Unable to load products. Please try again."
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // --------------------------------------------------
    // STOCK HELPERS
    // --------------------------------------------------

    const getAvailableBatches = (product: Product) => {
        return (product.stockBatchItems || [])
            .filter(
                (batch) =>
                    Number(batch.availableQuantity || 0) > 0 &&
                    new Date(batch.expiryDate).getTime() > Date.now()
            )
            .sort(
                (a, b) =>
                    new Date(a.expiryDate).getTime() -
                    new Date(b.expiryDate).getTime()
            );
    };

    const getAvailableStock = (product: Product) => {
        if (product.stockBatchItems) {
            return getAvailableBatches(product).reduce(
                (total, batch) =>
                    total + Number(batch.availableQuantity || 0),
                0
            );
        }

        return Math.max(0, Number(product.totalStock || 0));
    };

    const getSelectedQuantity = (productId: number) => {
        return selectedProducts
            .filter((item) => item.productId === productId)
            .reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );
    };

    const getSelectedFreeIssueQuantity = (productId: number) => {
        return selectedProducts
            .filter((item) => item.productId === productId)
            .reduce(
                (total, item) =>
                    total + Number(item.freeIssueQuantity || 0),
                0
            );
    };

    const getRemainingStock = (product: Product) => {
        const availableStock = getAvailableStock(product);

        const paidQuantity = getSelectedQuantity(product.id);

        const freeIssueQuantity =
            getSelectedFreeIssueQuantity(product.id);

        return Math.max(
            0,
            availableStock - paidQuantity - freeIssueQuantity
        );
    };

    // --------------------------------------------------
    // PRICE HELPERS
    // --------------------------------------------------

    const getBatchPrice = (batch: StockBatchItem) => {
        if (saleType === "RETAIL") {
            return Number(batch.retailPrice ?? 0);
        }

        return Number(batch.sellingPrice ?? 0);
    };

    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // --------------------------------------------------
    // FILTER PRODUCTS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // BUILD FEFO ALLOCATIONS
    // --------------------------------------------------

    const buildAllocations = (
        product: Product,
        requestedQuantity: number,
        freeIssueQuantity: number
    ): SelectedProduct[] => {
        const availableBatches = getAvailableBatches(product);

        const allocations: SelectedProduct[] = [];

        let remaining = requestedQuantity;

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

            const batchPrice = getBatchPrice(batch);

            allocations.push({
                allocationId: `${product.id}-${batch.id}`,
                productId: product.id,
                productCode: product.productId,
                name: product.name,
                brand: product.brand || "",
                batchId: batch.id,
                batchNumber: batch.stockBatch?.batchNumber,
                expiryDate: batch.expiryDate,
                quantity: allocatedQuantity,
                freeIssueQuantity: 0,
                sellingPrice: batchPrice,
                lineTotal: allocatedQuantity * batchPrice,
            });

            remaining -= allocatedQuantity;
        }

        if (remaining > 0) {
            return [];
        }

        // Free issue quantity belongs to the product,
        // so store it only in the first batch allocation.
        if (allocations.length > 0) {
            allocations[0].freeIssueQuantity =
                freeIssueQuantity;
        }

        return allocations;
    };

    // --------------------------------------------------
    // REPLACE PRODUCT ALLOCATIONS
    // --------------------------------------------------

    const replaceProductAllocations = (
        productId: number,
        allocations: SelectedProduct[]
    ) => {
        const firstIndex = selectedProducts.findIndex(
            (item) => item.productId === productId
        );

        const remainingItems = selectedProducts.filter(
            (item) => item.productId !== productId
        );

        const itemsBefore = selectedProducts
            .slice(
                0,
                firstIndex === -1
                    ? selectedProducts.length
                    : firstIndex
            )
            .filter((item) => item.productId !== productId);

        const insertIndex =
            firstIndex === -1
                ? remainingItems.length
                : itemsBefore.length;

        remainingItems.splice(
            insertIndex,
            0,
            ...allocations
        );

        onProductsChange(remainingItems);
    };

    // --------------------------------------------------
    // ADD PRODUCT
    // --------------------------------------------------

    const addProduct = (product: Product) => {
        const availableStock = getAvailableStock(product);

        const existingQuantity =
            getSelectedQuantity(product.id);

        const existingFreeIssue =
            getSelectedFreeIssueQuantity(product.id);

        if (
            existingQuantity + existingFreeIssue >=
            availableStock
        ) {
            return;
        }

        const requestedQuantity = existingQuantity + 1;

        const allocations = buildAllocations(
            product,
            requestedQuantity,
            existingFreeIssue
        );

        if (allocations.length === 0) {
            return;
        }

        replaceProductAllocations(
            product.id,
            allocations
        );
    };

    // --------------------------------------------------
    // UPDATE PAID QUANTITY
    // --------------------------------------------------

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

        const totalAvailable = getAvailableStock(product);

        const freeIssueQuantity =
            getSelectedFreeIssueQuantity(productId);

        const maxPaidQuantity = Math.max(
            0,
            totalAvailable - freeIssueQuantity
        );

        const requestedQuantity = Math.min(
            Math.floor(quantity),
            maxPaidQuantity
        );

        if (requestedQuantity <= 0) {
            return;
        }

        const allocations = buildAllocations(
            product,
            requestedQuantity,
            freeIssueQuantity
        );

        if (allocations.length === 0) {
            return;
        }

        replaceProductAllocations(
            productId,
            allocations
        );
    };

    // --------------------------------------------------
    // UPDATE FREE ISSUE QUANTITY
    // --------------------------------------------------

    const updateFreeIssueQuantity = (
        productId: number,
        freeIssueQuantity: number
    ) => {
        const product = products.find(
            (item) => item.id === productId
        );

        if (!product) {
            return;
        }

        const paidQuantity = getSelectedQuantity(productId);

        const totalAvailable = getAvailableStock(product);

        const maxFreeIssueQuantity = Math.max(
            0,
            totalAvailable - paidQuantity
        );

        const safeQuantity = Math.min(
            Math.max(0, Math.floor(freeIssueQuantity)),
            maxFreeIssueQuantity
        );

        const updatedProducts = selectedProducts.map(
            (item) => {
                if (item.productId !== productId) {
                    return item;
                }

                return {
                    ...item,
                    freeIssueQuantity: 0,
                };
            }
        );

        const firstIndex = updatedProducts.findIndex(
            (item) => item.productId === productId
        );

        if (firstIndex !== -1) {
            updatedProducts[firstIndex] = {
                ...updatedProducts[firstIndex],
                freeIssueQuantity: safeQuantity,
            };
        }

        onProductsChange(updatedProducts);
    };

    // --------------------------------------------------
    // CHANGE SALE TYPE
    // --------------------------------------------------

    const handleSaleTypeChange = (
        nextSaleType: "WHOLESALE" | "RETAIL"
    ) => {
        onSaleTypeChange(nextSaleType);

        const updatedProducts = selectedProducts.map(
            (item) => {
                const product = products.find(
                    (p) => p.id === item.productId
                );

                const batch = product?.stockBatchItems?.find(
                    (b) => b.id === item.batchId
                );

                if (!batch) {
                    return item;
                }

                const nextPrice =
                    nextSaleType === "RETAIL"
                        ? Number(batch.retailPrice ?? 0)
                        : Number(batch.sellingPrice ?? 0);

                return {
                    ...item,
                    sellingPrice: nextPrice,
                    lineTotal: item.quantity * nextPrice,
                };
            }
        );

        onProductsChange(updatedProducts);
    };

    // --------------------------------------------------
    // REMOVE PRODUCT
    // --------------------------------------------------

    const removeProduct = (productId: number) => {
        onProductsChange(
            selectedProducts.filter(
                (item) => item.productId !== productId
            )
        );

        setQuantityDrafts((previous) => {
            const next = { ...previous };
            delete next[productId];
            return next;
        });
    };

    // --------------------------------------------------
    // TOTALS
    // --------------------------------------------------

    const totalItems = selectedProducts.reduce(
        (total, item) =>
            total +
            item.quantity +
            (item.freeIssueQuantity || 0),
        0
    );

    const totalPaidItems = selectedProducts.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalFreeIssueItems = selectedProducts.reduce(
        (total, item) =>
            total + (item.freeIssueQuantity || 0),
        0
    );

    const subtotal = selectedProducts.reduce(
        (total, item) => total + item.lineTotal,
        0
    );

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <Box>
            {/* HEADER */}

            <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
                mb={{ base: 4, md: 6 }}
            >
                <Box>
                    <Heading size="md" color="gray.800">
                        Add Products
                    </Heading>

                    <Flex
                        gap={2}
                        mt={3}
                        mb={4}
                        align="center"
                        wrap="wrap"
                    >
                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="600"
                        >
                            Sale Type:
                        </Text>

                        <Button
                            size="sm"
                            colorPalette={
                                saleType === "WHOLESALE"
                                    ? "blue"
                                    : "gray"
                            }
                            variant={
                                saleType === "WHOLESALE"
                                    ? "solid"
                                    : "outline"
                            }
                            onClick={() =>
                                handleSaleTypeChange("WHOLESALE")
                            }
                        >
                            Wholesale
                        </Button>

                        <Button
                            size="sm"
                            colorPalette={
                                saleType === "RETAIL"
                                    ? "blue"
                                    : "gray"
                            }
                            variant={
                                saleType === "RETAIL"
                                    ? "solid"
                                    : "outline"
                            }
                            onClick={() =>
                                handleSaleTypeChange("RETAIL")
                            }
                        >
                            Retail
                        </Button>
                    </Flex>

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

                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="blue.700"
                    >
                        {totalItems}{" "}
                        {totalItems === 1 ? "Item" : "Items"}
                    </Text>
                </Flex>
            </Flex>

            {/* SEARCH */}

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
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by product name, ID or brand..."
                        pl="42px"
                        h={{ base: "42px", sm: "46px" }}
                        bg="white"
                        borderColor="gray.200"
                        _focus={{
                            borderColor: "blue.500",
                            boxShadow:
                                "0 0 0 1px var(--chakra-colors-blue-500)",
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

            {/* PRODUCT LIST */}

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
                    p={{ base: 4, sm: 6 }}
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

                            const remainingStock =
                                getRemainingStock(product);

                            const isSelected =
                                selectedQuantity > 0;

                            const isOutOfStock =
                                remainingStock <= 0;

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
                                                {saleType === "RETAIL"
                                                    ? "Retail Price"
                                                    : "Wholesale Price"}
                                            </Text>

                                            <Text
                                                fontSize="md"
                                                fontWeight="700"
                                                color="gray.800"
                                            >
                                                {(() => {
                                                    const firstAvailableBatch =
                                                        getAvailableBatches(
                                                            product
                                                        )[0];

                                                    if (
                                                        !firstAvailableBatch
                                                    ) {
                                                        return "N/A";
                                                    }

                                                    if (
                                                        saleType === "RETAIL" &&
                                                        firstAvailableBatch.retailPrice ==
                                                            null
                                                    ) {
                                                        return "Retail price not set";
                                                    }

                                                    return formatCurrency(
                                                        getBatchPrice(
                                                            firstAvailableBatch
                                                        )
                                                    );
                                                })()}
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
                                                {remainingStock}
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
                                                    disabled={isOutOfStock}
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

            {/* SELECTED PRODUCTS */}

            <Box
                mt={6}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
            >
                {/* HEADER */}

                <Flex
                    px={4}
                    py={3}
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    justify="space-between"
                    align="center"
                    gap={3}
                >
                    <Box>
                        <Heading size="sm" color="gray.800">
                            Selected Products
                        </Heading>

                        <Text
                            fontSize="xs"
                            color="gray.500"
                            mt={1}
                        >
                            {selectedProducts.length} batch allocation(s)
                        </Text>
                    </Box>

                    <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="700"
                        color="blue.600"
                        whiteSpace="nowrap"
                    >
                        {formatCurrency(subtotal)}
                    </Text>
                </Flex>

                {/* EMPTY STATE */}

                {selectedProducts.length === 0 ? (
                    <Flex
                        minH="110px"
                        align="center"
                        justify="center"
                        direction="column"
                        gap={2}
                        p={4}
                    >
                        <FiShoppingCart
                            size={24}
                            style={{ color: "#9CA3AF" }}
                        />

                        <Text fontSize="sm" color="gray.500">
                            No products selected
                        </Text>
                    </Flex>
                ) : (
                    <Box>
                        {selectedProducts.map((item, index) => {
                            const product = products.find(
                                (p) => p.id === item.productId
                            );

                            const batch =
                                product?.stockBatchItems?.find(
                                    (b) => b.id === item.batchId
                                );

                            const maxBatchStock = Number(
                                batch?.availableQuantity ??
                                item.quantity
                            );

                            const firstProductRow =
                                selectedProducts.findIndex(
                                    (p) =>
                                        p.productId === item.productId
                                ) === index;

                            const totalProductStock = product
                                ? getAvailableStock(product)
                                : item.quantity;

                            const currentProductQuantity =
                                getSelectedQuantity(item.productId);

                            const currentFreeIssueQuantity =
                                getSelectedFreeIssueQuantity(
                                    item.productId
                                );

                            const maxPaidQuantity = Math.max(
                                1,
                                totalProductStock -
                                    currentFreeIssueQuantity
                            );

                            const maxFreeIssueQuantity = Math.max(
                                0,
                                totalProductStock -
                                    currentProductQuantity
                            );

                            return (
                                <Box
                                    key={item.allocationId}
                                    px={3}
                                    py={3}
                                    borderBottom={
                                        index <
                                        selectedProducts.length - 1
                                            ? "1px solid"
                                            : "none"
                                    }
                                    borderColor="gray.100"
                                >
                                    <Flex
                                        align="center"
                                        gap={{ base: 3, md: 4 }}
                                        direction={{
                                            base: "column",
                                            md: "row",
                                        }}
                                    >
                                        {/* PRODUCT DETAILS */}

                                        <Box
                                            flex="1"
                                            minW={0}
                                            w="100%"
                                        >
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Expiry:{" "}
                                                {new Date(
                                                    item.expiryDate
                                                ).toLocaleDateString(
                                                    "en-GB"
                                                )}
                                            </Text>

                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="gray.800"
                                                mt={1}
                                                lineHeight="1.3"
                                            >
                                                {item.name}
                                            </Text>

                                            <Text
                                                fontSize="xs"
                                                color="blue.600"
                                                mt={1}
                                            >
                                                {item.productCode}
                                                {item.brand
                                                    ? ` • ${item.brand}`
                                                    : ""}
                                            </Text>

                                            <Text
                                                fontSize="xs"
                                                color="purple.600"
                                                mt={1}
                                            >
                                                Batch:{" "}
                                                {item.batchNumber || "-"}
                                                {" · "}
                                                Batch max: {maxBatchStock}
                                            </Text>
                                        </Box>

                                        {/* PRICE */}

                                        <Box
                                            minW={{
                                                base: "100%",
                                                md: "115px",
                                            }}
                                            textAlign={{
                                                base: "left",
                                                md: "right",
                                            }}
                                        >
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {saleType === "RETAIL"
                                                    ? "Retail Price"
                                                    : "Wholesale Price"}
                                            </Text>

                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="gray.800"
                                            >
                                                {formatCurrency(
                                                    item.sellingPrice
                                                )}
                                            </Text>
                                        </Box>

                                        {/* QUANTITY + FREE ISSUE */}

                                        <Box
                                            minW={{
                                                base: "100%",
                                                md: "110px",
                                            }}
                                            textAlign={{
                                                base: "left",
                                                md: "center",
                                            }}
                                        >
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={1}
                                            >
                                                {firstProductRow
                                                    ? "Paid Quantity"
                                                    : "Batch Quantity"}
                                            </Text>

                                            {firstProductRow ? (
                                                <>
                                                    <Input
                                                        type="number"
                                                        size="sm"
                                                        min={1}
                                                        max={maxPaidQuantity}
                                                        width={{
                                                            base: "100%",
                                                            md: "100px",
                                                        }}
                                                        value={
                                                            quantityDrafts[
                                                                item.productId
                                                            ] ??
                                                            String(
                                                                currentProductQuantity
                                                            )
                                                        }
                                                        onChange={(event) => {
                                                            const raw =
                                                                event.target
                                                                    .value;

                                                            setQuantityDrafts(
                                                                (previous) => ({
                                                                    ...previous,
                                                                    [item.productId]:
                                                                        raw,
                                                                })
                                                            );

                                                            if (raw === "") {
                                                                return;
                                                            }

                                                            const parsed =
                                                                Number(raw);

                                                            if (
                                                                !Number.isInteger(
                                                                    parsed
                                                                ) ||
                                                                parsed < 1
                                                            ) {
                                                                return;
                                                            }

                                                            const safeQuantity =
                                                                Math.min(
                                                                    parsed,
                                                                    maxPaidQuantity
                                                                );

                                                            updateQuantity(
                                                                item.productId,
                                                                safeQuantity
                                                            );
                                                        }}
                                                        onBlur={(event) => {
                                                            const parsed =
                                                                Number(
                                                                    event.target
                                                                        .value
                                                                );

                                                            const safeQuantity =
                                                                !Number.isInteger(
                                                                    parsed
                                                                ) ||
                                                                parsed < 1
                                                                    ? 1
                                                                    : Math.min(
                                                                          parsed,
                                                                          maxPaidQuantity
                                                                      );

                                                            setQuantityDrafts(
                                                                (previous) => ({
                                                                    ...previous,
                                                                    [item.productId]:
                                                                        String(
                                                                            safeQuantity
                                                                        ),
                                                                })
                                                            );

                                                            updateQuantity(
                                                                item.productId,
                                                                safeQuantity
                                                            );
                                                        }}
                                                    />

                                                    {/* FREE ISSUE INPUT */}

                                                    <Box mt={3}>
                                                        <Text
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            color="purple.600"
                                                            mb={1}
                                                        >
                                                            Free Issue Qty
                                                        </Text>

                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            min={0}
                                                            max={
                                                                maxFreeIssueQuantity
                                                            }
                                                            width={{
                                                                base: "100%",
                                                                md: "100px",
                                                            }}
                                                            value={
                                                                currentFreeIssueQuantity
                                                            }
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const raw =
                                                                    event.target
                                                                        .value;

                                                                if (
                                                                    raw === ""
                                                                ) {
                                                                    updateFreeIssueQuantity(
                                                                        item.productId,
                                                                        0
                                                                    );

                                                                    return;
                                                                }

                                                                const parsed =
                                                                    Number(raw);

                                                                if (
                                                                    !Number.isInteger(
                                                                        parsed
                                                                    ) ||
                                                                    parsed < 0
                                                                ) {
                                                                    return;
                                                                }

                                                                updateFreeIssueQuantity(
                                                                    item.productId,
                                                                    parsed
                                                                );
                                                            }}
                                                        />

                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.400"
                                                            mt={1}
                                                        >
                                                            Free items are not
                                                            charged.
                                                        </Text>
                                                    </Box>
                                                </>
                                            ) : (
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    color="gray.700"
                                                >
                                                    {item.quantity}
                                                </Text>
                                            )}
                                        </Box>

                                        {/* BATCH TOTAL */}

                                        <Box
                                            minW={{
                                                base: "100%",
                                                md: "100px",
                                            }}
                                            textAlign={{
                                                base: "left",
                                                md: "right",
                                            }}
                                        >
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Batch Total
                                            </Text>

                                            <Text
                                                fontSize="sm"
                                                fontWeight="700"
                                                color="gray.800"
                                            >
                                                {formatCurrency(
                                                    item.lineTotal
                                                )}
                                            </Text>
                                        </Box>

                                        {/* REMOVE */}

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            colorPalette="red"
                                            alignSelf={{
                                                base: "flex-end",
                                                md: "center",
                                            }}
                                            onClick={() =>
                                                removeProduct(
                                                    item.productId
                                                )
                                            }
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* SUBTOTAL */}

                {selectedProducts.length > 0 && (
                    <Box
                        px={4}
                        py={3}
                        bg="gray.50"
                        borderTop="1px solid"
                        borderColor="gray.200"
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={2}
                        >
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Paid Quantity
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                            >
                                {totalPaidItems}
                            </Text>
                        </Flex>

                        <Flex
                            justify="space-between"
                            align="center"
                            mb={2}
                        >
                            <Text
                                fontSize="xs"
                                color="purple.600"
                            >
                                Free Issue Quantity
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color="purple.600"
                            >
                                {totalFreeIssueItems}
                            </Text>
                        </Flex>

                        <Flex
                            justify="space-between"
                            align="center"
                            mb={3}
                        >
                            <Text
                                fontSize="xs"
                                color="gray.500"
                            >
                                Total Stock Quantity
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                {totalItems}
                            </Text>
                        </Flex>

                        <Flex
                            justify="flex-end"
                            align="center"
                        >
                            <Box textAlign="right">
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
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
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProductStep;
