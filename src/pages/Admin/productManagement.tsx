import DeleteProductDialog from "@/components/Products/DeleteProductDialog";
import ProductStatsCards, {
    type ProductStats,
} from "@/components/Products/ProductStatsCards";
import ProductTable, {
    type Product,
} from "@/components/Products/ProductTable";
import ProductViewDialog from "@/components/Products/ProductViewDialog";
import ProductSearchBar from "@/components/Products/ProductSearchBar";

import api from "@/api/axios";
import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaginationInfo } from "@/components/Pagination";
import Pagination from "@/components/Pagination";

const initialPagination: PaginationInfo = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const initialStats: ProductStats = {
    totalProducts: 0,
    totalStock: 0,
    inventoryValue: 0,
    lowStockProducts: 0,
};

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] =
        useState<PaginationInfo>(initialPagination);

    const [stats, setStats] =
        useState<ProductStats>(initialStats);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [viewDialogOpen, setViewDialogOpen] =
        useState(false);

    const [viewProductId, setViewProductId] =
        useState<number | undefined>();

    const getAllProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/product/all", {
                params: {
                    page,
                    limit,
                    search: search.trim(),
                },
            });

            const result = response.data;

            setProducts(
                Array.isArray(result.data) ? result.data : []
            );

            if (result.pagination) {
                setPagination(result.pagination);
            }

            // Global stats from the backend, independent of the page
            if (result.stats) {
                setStats(result.stats);
            }

            // If the last product was deleted, go to the last page
            if (
                result.pagination?.totalPages > 0 &&
                page > result.pagination.totalPages
            ) {
                setPage(result.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to load products:", error);
            setError("Failed to load products. Please try again.");

            setProducts([]);
            // Preserve the last successfully loaded stats on failure.
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        void getAllProducts();
    }, [getAllProducts]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleLimitChange = (value: number) => {
        setLimit(value);
        setPage(1);
    };

    return (
        <>
            <Box
                backgroundColor="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={6}
            >
                Product Management
            </Box>

            <ProductStatsCards stats={stats} />

            <ProductSearchBar
                search={search}
                setSearch={handleSearchChange}
                onAddProduct={() =>
                    navigate("/admin/products/add")
                }
            />

            {loading ? (
                <VStack py={12} gap={3}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.500" fontSize="sm">
                        Loading products...
                    </Text>
                </VStack>
            ) : error ? (
                <VStack py={10} gap={3}>
                    <Text color="red.500">{error}</Text>

                    <Button
                        onClick={() => void getAllProducts()}
                        colorPalette="blue"
                    >
                        Retry
                    </Button>
                </VStack>
            ) : (
                <>
                    <ProductTable
                        products={products}
                        onView={(product) => {
                            setViewProductId(product.id);
                            setViewDialogOpen(true);
                        }}
                        onEdit={(product) => {
                            navigate(
                                `/admin/products/edit/${product.id}`,
                                {
                                    state: {
                                        item: product,
                                    },
                                }
                            );
                        }}
                        onDelete={(product) => {
                            setSelectedProduct(product);
                            setDeleteDialogOpen(true);
                        }}
                    />

                    <Pagination
                        pagination={pagination}
                        onPageChange={setPage}
                        onLimitChange={handleLimitChange}
                    />
                </>
            )}

            <ProductViewDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setViewProductId(undefined);
                }}
                productId={viewProductId}
            />

            <DeleteProductDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedProduct(null);
                }}
                product={selectedProduct}
                onDeleted={getAllProducts}
            />
        </>
    );
}