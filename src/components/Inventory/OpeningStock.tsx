
import { useEffect, useMemo, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Spinner,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiPackage } from "react-icons/fi";
import { isAxiosError } from "axios";
import api from "@/api/axios";

type Product = {
    id: number;
    productId: string;
    name: string;
    brand?: string | null;
    strengthValue?: number | null;
    strengthUnit?: string | null;
    dosageForm?: string | null;
};

type OpeningStockItem = {
    rowId: number;
    productId: string;
    receivedQuantity: string;
    buyingPrice: string;
    sellingPrice: string;
    expiryDate: string;
    manufacturingDate: string;
};

type ApiErrorResponse = {
    message?: string;
    error?: string;
};

const today = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const createEmptyItem = (rowId: number): OpeningStockItem => ({
    rowId,
    productId: "",
    receivedQuantity: "",
    buyingPrice: "",
    sellingPrice: "",
    expiryDate: "",
    manufacturingDate: "",
});

export default function OpeningStock() {
    const [products, setProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<OpeningStockItem[]>([
        createEmptyItem(1),
    ]);
    const [receivedDate, setReceivedDate] = useState(today());
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [nextRowId, setNextRowId] = useState(2);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get(
                    "/product/all"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.products)
                        ? response.data.products
                        : Array.isArray(response.data?.data)
                            ? response.data.data
                            : [];

                setProducts(data);
            } catch (error) {
                console.error("Failed to load products:", error);
                toast.error("Failed to load products.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return products;

        return products.filter((product) =>
            [
                product.name,
                product.productId,
                product.brand ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(keyword)
        );
    }, [products, search]);

    const totalUnits = items.reduce(
        (total, item) => total + (Number(item.receivedQuantity) || 0),
        0
    );

    const updateItem = (
        rowId: number,
        field: keyof OpeningStockItem,
        value: string
    ) => {
        setItems((current) =>
            current.map((item) =>
                item.rowId === rowId
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const addItem = () => {
        setItems((current) => [
            ...current,
            createEmptyItem(nextRowId),
        ]);
        setNextRowId((current) => current + 1);
    };

    const removeItem = (rowId: number) => {
        setItems((current) =>
            current.filter((item) => item.rowId !== rowId)
        );
    };

    const resetForm = () => {
        setItems([createEmptyItem(nextRowId)]);
        setNextRowId((current) => current + 1);
        setReceivedDate(today());
    };

    const saveOpeningStock = async () => {
        if (!receivedDate || Number.isNaN(new Date(receivedDate).getTime())) {
            toast.error("Please select a valid received date.");
            return;
        }

        if (items.length === 0) {
            toast.error("Please add at least one product.");
            return;
        }

        for (const [index, item] of items.entries()) {
            const row = index + 1;

            if (!item.productId) {
                toast.error(`Row ${row}: Please select a product.`);
                return;
            }

            if (
                !item.receivedQuantity.trim() ||
                !Number.isInteger(Number(item.receivedQuantity)) ||
                Number(item.receivedQuantity) <= 0
            ) {
                toast.error(`Row ${row}: Enter a valid quantity.`);
                return;
            }

            if (
                item.buyingPrice.trim() === "" ||
                !Number.isFinite(Number(item.buyingPrice)) ||
                Number(item.buyingPrice) < 0
            ) {
                toast.error(`Row ${row}: Enter a valid buying price.`);
                return;
            }

            if (
                item.sellingPrice.trim() === "" ||
                !Number.isFinite(Number(item.sellingPrice)) ||
                Number(item.sellingPrice) < 0
            ) {
                toast.error(`Row ${row}: Enter a valid selling price.`);
                return;
            }

            if (!item.expiryDate) {
                toast.error(`Row ${row}: Please select an expiry date.`);
                return;
            }

            if (item.expiryDate <= today()) {
                toast.error(`Row ${row}: Expiry date must be in the future.`);
                return;
            }

            if (
                item.manufacturingDate &&
                (
                    item.manufacturingDate > item.expiryDate ||
                    item.manufacturingDate > receivedDate
                )
            ) {
                toast.error(`Row ${row}: Check the manufacturing date.`);
                return;
            }
        }

        const payload = {
            receivedDate,
            items: items.map((item) => ({
                productId: Number(item.productId),
                receivedQuantity: Number(item.receivedQuantity),
                buyingPrice: Number(item.buyingPrice),
                sellingPrice: Number(item.sellingPrice),
                expiryDate: item.expiryDate,
                manufacturingDate: item.manufacturingDate || null,
            })),
        };

        try {
            setSaving(true);

            const response = await api.post(
                "/stock/opening-stock/bulk",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(
                response.data?.message || "Opening stock saved successfully."
            );

            resetForm();
        } catch (error) {
            console.error("Failed to save opening stock:", error);

            if (isAxiosError<ApiErrorResponse>(error)) {
                toast.error(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to save opening stock."
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <VStack align="stretch" gap={6}>
            <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                gap={3}
                wrap="wrap"
            >
                <Box>
                    <HStack gap={2} mb={1}>
                        <Box color="teal.600">
                            <FiPackage size={25} />
                        </Box>
                        <Heading size="lg">Opening Stock</Heading>
                    </HStack>

                    <Text color="gray.600" fontSize="sm">
                        Enter your existing inventory when setting up the system.
                    </Text>
                </Box>

                <Badge colorPalette="teal" px={3} py={2}>
                    Bulk Entry
                </Badge>
            </Flex>

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="xl"
                p={5}
                shadow="sm"
            >
                <Heading size="md" mb={4}>
                    Stock Information
                </Heading>

                <Box maxW="320px">
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Received Date *
                    </Text>

                    <Input
                        type="date"
                        value={receivedDate}
                        max={today()}
                        onChange={(event) =>
                            setReceivedDate(event.target.value)
                        }
                    />
                </Box>
            </Box>

            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="xl"
                p={5}
                shadow="sm"
            >
                <Flex
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    gap={3}
                    wrap="wrap"
                    mb={4}
                >
                    <Box>
                        <Heading size="md">Product Entries</Heading>
                        <Text color="gray.600" fontSize="sm" mt={1}>
                            Add the quantity and batch details for each product.
                        </Text>
                    </Box>

                    <Button
                        colorPalette="teal"
                        variant="outline"
                        onClick={addItem}
                    >
                        <FiPlus />
                        Add Product
                    </Button>
                </Flex>

                <Box maxW="420px" mb={4}>
                    <Input
                        placeholder="Search product name, code or brand..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </Box>

                {loadingProducts ? (
                    <Flex justify="center" py={10}>
                        <Spinner size="lg" color="teal.500" />
                    </Flex>
                ) : products.length === 0 ? (
                    <Box bg="gray.50" rounded="lg" p={6} textAlign="center">
                        <Text fontWeight="medium">No products found.</Text>
                        <Text color="gray.600" fontSize="sm" mt={1}>
                            Add products before entering opening stock.
                        </Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader minW="220px">
                                        Product
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader minW="110px">
                                        Quantity
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader minW="130px">
                                        Buying Price (Rs.)
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader minW="130px">
                                        Selling Price (Rs.)
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader minW="155px">
                                        Expiry Date
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader minW="165px">
                                        Manufacturing Date
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                        Action
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {items.map((item, index) => {
                                    const selectedProduct = products.find(
                                        (product) =>
                                            product.id === Number(item.productId)
                                    );

                                    return (
                                        <Table.Row key={item.rowId}>
                                            <Table.Cell>
                                                <VStack align="stretch" gap={1}>
                                                    <select
                                                        value={item.productId}
                                                        onChange={(event) =>
                                                            updateItem(
                                                                item.rowId,
                                                                "productId",
                                                                event.target.value
                                                            )
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            minWidth: "200px",
                                                            padding: "9px",
                                                            border: "1px solid #CBD5E0",
                                                            borderRadius: "6px",
                                                            background: "white",
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select product
                                                        </option>

                                                        {filteredProducts.map(
                                                            (product) => (
                                                                <option
                                                                    key={product.id}
                                                                    value={product.id}
                                                                >
                                                                    {product.productId} - {product.name}
                                                                    {product.brand
                                                                        ? ` (${product.brand})`
                                                                        : ""}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    {selectedProduct && (
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.600"
                                                        >
                                                            {selectedProduct.dosageForm || ""}
                                                            {selectedProduct.strengthValue != null
                                                                ? ` · ${selectedProduct.strengthValue} ${selectedProduct.strengthUnit || ""}`
                                                                : ""}
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    min={1}
                                                    step={1}
                                                    placeholder="0"
                                                    value={item.receivedQuantity}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.rowId,
                                                            "receivedQuantity",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={item.buyingPrice}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.rowId,
                                                            "buyingPrice",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={item.sellingPrice}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.rowId,
                                                            "sellingPrice",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Input
                                                    size="sm"
                                                    type="date"
                                                    min={today()}
                                                    value={item.expiryDate}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.rowId,
                                                            "expiryDate",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Input
                                                    size="sm"
                                                    type="date"
                                                    max={receivedDate || today()}
                                                    value={item.manufacturingDate}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.rowId,
                                                            "manufacturingDate",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Button
                                                    size="sm"
                                                    colorPalette="red"
                                                    variant="ghost"
                                                    aria-label={`Remove row ${index + 1}`}
                                                    disabled={items.length === 1}
                                                    onClick={() =>
                                                        removeItem(item.rowId)
                                                    }
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}

                <Flex
                    justify="space-between"
                    align="center"
                    mt={4}
                    pt={4}
                    borderTopWidth="1px"
                    borderColor="gray.200"
                    gap={3}
                    wrap="wrap"
                >
                    <Box>
                        <Text color="gray.600" fontSize="sm">
                            Product rows: {items.length}
                        </Text>
                        <Text fontWeight="semibold">
                            Total units: {totalUnits.toLocaleString()}
                        </Text>
                    </Box>

                    <HStack gap={3}>
                        <Button
                            variant="outline"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Clear Form
                        </Button>

                        <Button
                            colorPalette="teal"
                            onClick={saveOpeningStock}
                            loading={saving}
                            disabled={loadingProducts || products.length === 0}
                        >
                            Save Opening Stock
                        </Button>
                    </HStack>
                </Flex>
            </Box>

            <Text color="gray.600" fontSize="sm">
                Note: Each row creates a stock item with its own quantity,
                prices and expiry date. Verify the physical stock details
                before saving.
            </Text>
        </VStack>
    );
}
