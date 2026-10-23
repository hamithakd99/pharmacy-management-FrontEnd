
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Text,
    Spinner,
    VStack,
} from "@chakra-ui/react";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuPlus, LuSearch } from "react-icons/lu";

import type { PurchaseOrder } from "@/components/PO/POTable";
import POTable from "@/components/PO/POTable";
import POViewDialog from "@/components/PO/POViewDialog";
import DeletePODialog from "@/components/PO/DeletePODialog";
import POStatusCards from "@/components/PO/POStatsCards";

import api from "@/api/axios";
import DocumentPreviewDialog from "@/components/Documents/DocumentPreviewDialog";
import PurchaseOrderPDF from "@/pdf/templates/PurchaseOrderPDF";
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


export default function PurchaseOrderManagement() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] =
        useState<PaginationInfo>(initialPagination);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedPO, setSelectedPO] =
        useState<PurchaseOrder | null>(null);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

    const [printPurchaseOrder, setPrintPurchaseOrder] = useState<PurchaseOrder | null>(null);

    type POStats = {
        totalOrders: number;
        pendingOrders: number;
        partiallyReceivedOrders: number;
        completedOrders: number;
        cancelledOrders: number;
    };

    const [stats, setStats] = useState<POStats>({
        totalOrders: 0,
        pendingOrders: 0,
        partiallyReceivedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
    });

    // =====================================================
    // LOAD PURCHASE ORDERS
    // =====================================================

    const getPurchaseOrders = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get("/po/all", {
                params: {
                    page,
                    limit,
                    search: search.trim(),
                },
            });

            const result = response.data;

            setPurchaseOrders(result.data);
            setPagination(result.pagination);

            setStats({
                totalOrders: result.stats?.totalOrders ?? 0,
                pendingOrders: result.stats?.pendingOrders ?? 0,
                partiallyReceivedOrders:
                    result.stats?.partiallyReceivedOrders ?? 0,
                completedOrders: result.stats?.completedOrders ?? 0,
                cancelledOrders: result.stats?.cancelledOrders ?? 0,
            });

            // Handle the case where the current page no longer exists.
            if (
                result.pagination.totalPages > 0 &&
                page > result.pagination.totalPages
            ) {
                setPage(result.pagination.totalPages);
            } else if (
                result.pagination.totalPages === 0 &&
                page !== 1
            ) {
                setPage(1);
            }
        } catch (error) {
            console.error("Failed to load purchase orders:", error);
            toast.error("Failed to load purchase orders");
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        void getPurchaseOrders();
    }, [getPurchaseOrders]);

    // =====================================================
    // SEARCH AND PAGINATION
    // =====================================================

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleLimitChange(value: number) {
        setLimit(value);
        setPage(1);
    }

    // =====================================================
    // VIEW
    // =====================================================

    async function handleView(purchaseOrder: PurchaseOrder) {
        try {
            setLoading(true);

            const response = await api.get(
                `/po/purchase-orders/${purchaseOrder.id}`
            );

            setSelectedPO(response.data);
            setViewDialogOpen(true);
        } catch (error) {
            console.error("Failed to load purchase order:", error);
            toast.error("Failed to load purchase order");
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // EDIT
    // =====================================================

    function handleEdit(purchaseOrder: PurchaseOrder) {
        navigate(
            `/admin/po/purchase-orders/${purchaseOrder.id}`
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    function handleDelete(purchaseOrder: PurchaseOrder) {
        setSelectedPO(purchaseOrder);
        setDeleteDialogOpen(true);
    }

    // =====================================================
    // CREATE GRN
    // =====================================================

    function handleCreateGRN(purchaseOrder: PurchaseOrder) {
        if (
            purchaseOrder.status === "COMPLETED" ||
            purchaseOrder.status === "CANCELLED"
        ) {
            toast.error(
                "GRN cannot be created for this Purchase Order."
            );
            return;
        }

        navigate(
            `/admin/grn/create?purchaseOrderId=${purchaseOrder.id}`
        );
    }

    // =====================================================
    // PRINT
    // =====================================================

    async function handlePrint(purchaseOrder: PurchaseOrder) {
        try {
            setLoading(true);

            const response = await api.get(
                `/po/purchase-orders/${purchaseOrder.id}`
            );

            setPrintPurchaseOrder(response.data);
            setPrintPreviewOpen(true);
        } catch (error) {
            console.error("Failed to load purchase order:", error);
            toast.error("Failed to load purchase order preview.");
        } finally {
            setLoading(false);
        }
    }



    // =====================================================
    // UI
    // =====================================================

    return (
        <Box>
            {/* PAGE HEADER */}

            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={6}
            >
                Purchase Order Management
            </Box>

            {/* SUMMARY CARDS */}

            <POStatusCards
                totalOrders={stats.totalOrders}
                pendingOrders={stats.pendingOrders}
                partiallyReceivedOrders={stats.partiallyReceivedOrders}
                completedOrders={stats.completedOrders}
                cancelledOrders={stats.cancelledOrders}
            />

            {/* SEARCH + CREATE */}

            <Flex
                justify="space-between"
                align="center"
                gap={4}
                mb={5}
                wrap="wrap"
            >
                <InputGroup
                    startElement={<LuSearch />}
                    maxW="450px"
                >
                    <Input
                        placeholder="Search by PO number or supplier..."
                        value={search}
                        onChange={(e) =>
                            handleSearchChange(e.target.value)
                        }
                    />
                </InputGroup>

                <Button
                    colorPalette="blue"
                    onClick={() =>
                        navigate("/admin/po/create")
                    }
                >
                    <LuPlus />
                    Create Purchase Order
                </Button>
            </Flex>

            {/* RESULTS COUNT */}

            <Text
                mb={3}
                color="gray.600"
                fontSize="sm"
            >
                Showing{" "}
                <strong>
                    {pagination.total === 0
                        ? 0
                        : (page - 1) * limit + 1}
                    {"–"}
                    {Math.min(page * limit, pagination.total)}
                </strong>
                {" "}of{" "}
                <strong>{pagination.total}</strong>
                {" "}purchase orders
            </Text>

            {/* TABLE + PAGINATION */}

            {loading ? (
                <VStack py={10} gap={3}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.500" fontSize="sm">
                        Loading purchase orders...
                    </Text>
                </VStack>
            ) : (
                <>
                    <POTable
                        purchaseOrders={purchaseOrders}
                        onView={handleView}
                        onCreateGRN={handleCreateGRN}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPrint={handlePrint}
                    />

                    <Pagination
                        pagination={pagination}
                        onPageChange={setPage}
                        onLimitChange={handleLimitChange}
                    />
                </>
            )}

            {/* VIEW DIALOG */}

            <POViewDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedPO(null);
                }}
                purchaseOrder={selectedPO}
            />

            {/* DELETE DIALOG */}

            <DeletePODialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedPO(null);
                }}
                purchaseOrder={selectedPO}
                onDeleted={async () => {
                    setDeleteDialogOpen(false);
                    setSelectedPO(null);

                    await getPurchaseOrders();
                }}
            />

            {/* PRINT PREVIEW */}

            <DocumentPreviewDialog
                open={printPreviewOpen}
                onClose={() => {
                    setPrintPreviewOpen(false);
                    setPrintPurchaseOrder(null);
                }}
                title="Purchase Order Preview"
                fileName={`${printPurchaseOrder?.orderNumber ?? "Purchase-Order"
                    }.pdf`}
                renderDocument={(settings) => (
                    <PurchaseOrderPDF
                        purchaseOrder={printPurchaseOrder!}
                        settings={settings}
                    />
                )}
            />
        </Box>
    );
}
