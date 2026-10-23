
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import GRNSearchBar from "@/components/GRN/GRNSearchBar";
import GRNTable from "@/components/GRN/GRNTable";
import GRNViewDialog from "@/components/GRN/GRNViewDialog";
import GRNStatsCards, { type GRNStats } from "@/components/GRN/GRNStatsCards";
import type { StockBatch } from "@/types/stockBatch";
import GRNPDF from "@/pdf/templates/GRNPDF";
import api from "@/api/axios";
import DocumentPreviewDialog from "@/components/Documents/DocumentPreviewDialog";
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

const initialStats: GRNStats = {
    totalGRNs: 0,
    todaysGRNs: 0,
    pendingPayments: 0,
    itemsReceivedToday: 0,
};

export default function GRNManagement() {
    const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);
    const [pagination, setPagination] =
        useState<PaginationInfo>(initialPagination);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedBatchNumber, setSelectedBatchNumber] =
        useState<string>();

    const [printBatch, setPrintBatch] = useState<any | null>(null);
    const [grnPreviewOpen, setGrnPreviewOpen] = useState(false);

    const [stats, setStats] = useState<GRNStats>(initialStats);

    const navigate = useNavigate();

    const getAllStockBatches = useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get("/stock-batch/", {
                params: {
                    page,
                    limit,
                    search: search.trim(),
                    paymentStatus,
                },
            });

            const result = response.data;

            setStockBatches(result.data);
            setPagination(result.pagination);
            setStats(result.stats);

            if (
                result.pagination.totalPages > 0 &&
                page > result.pagination.totalPages
            ) {
                setPage(result.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to load GRNs:", error);
            toast.error("Failed to load GRNs.");

            setStockBatches([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, paymentStatus]);

    useEffect(() => {
        void getAllStockBatches();
    }, [getAllStockBatches]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handlePaymentStatusChange = (value: string) => {
        setPaymentStatus(value);
        setPage(1);
    };

    const handleLimitChange = (value: number) => {
        setLimit(value);
        setPage(1);
    };

    async function handlePrint(batch: StockBatch) {
        try {
            const response = await api.get(
                `/stock-batch/${batch.batchNumber}`
            );

            const fullBatch = response.data.data;

            if (!fullBatch) {
                toast.error("GRN details not found.");
                return;
            }

            setPrintBatch(fullBatch);
            setGrnPreviewOpen(true);
        } catch (error) {
            console.error("Failed to load GRN details:", error);
            toast.error("Failed to load GRN details.");
        }
    }

    return (
        <>
            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                fontWeight="bold"
                textAlign="center"
                mb={5}
            >
                Goods Received Notes
            </Box>

            <GRNStatsCards stats={stats} />

            <GRNSearchBar
                search={search}
                setSearch={handleSearchChange}
                paymentStatus={paymentStatus}
                setPaymentStatus={handlePaymentStatusChange}
            />

            {loading ? (
                <VStack py={12} gap={3}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.500" fontSize="sm">
                        Loading GRNs...
                    </Text>
                </VStack>
            ) : (
                <>
                    <GRNTable
                        stockBatches={stockBatches}
                        onView={(batch) => {
                            setSelectedBatchNumber(batch.batchNumber);
                            setViewDialogOpen(true);
                        }}
                        onEdit={(batch) => {
                            navigate(
                                `/admin/grn/edit/${batch.batchNumber}`
                            );
                        }}
                        onPrint={handlePrint}
                    />

                    <Pagination
                        pagination={pagination}
                        onPageChange={setPage}
                        onLimitChange={handleLimitChange}
                    />
                </>
            )}

            <GRNViewDialog
                open={viewDialogOpen}
                batchNumber={selectedBatchNumber}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedBatchNumber(undefined);
                }}
            />

            {printBatch && (
                <DocumentPreviewDialog
                    open={grnPreviewOpen}
                    onClose={() => {
                        setGrnPreviewOpen(false);
                        setPrintBatch(null);
                    }}
                    title="GRN Preview"
                    fileName={`${printBatch.batchNumber}.pdf`}
                    renderDocument={(settings) => (
                        <GRNPDF
                            stockBatch={printBatch}
                            settings={settings}
                        />
                    )}
                />
            )}
        </>
    );
}
