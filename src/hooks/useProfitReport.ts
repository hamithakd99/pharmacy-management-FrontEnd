
import { useCallback, useEffect, useRef, useState } from "react";

import api from "@/api/axios";
import type { PaginationInfo } from "@/components/Pagination";

import type {
    ProfitOrder,
    ProfitSummary,
    ReportResponse,
} from "../types/profit-report.types";

import { formatDateInput } from "../utils/profit-report.utils";

// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const EMPTY_SUMMARY: ProfitSummary = {
    totalOrders: 0,
    totalSales: 0,
    totalSellingAmount: 0,
    totalBuyingCost: 0,
    totalDiscount: 0,
    totalNetProfit: 0,
    totalPaidQuantity: 0,
    totalFreeIssueQuantity: 0,
    overallProfitMargin: 0,
};

const INITIAL_PAGINATION: PaginationInfo = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const ERROR_MESSAGE =
    "Failed to load profit report. Please try again.";

// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
        const candidate = error as {
            response?: {
                data?: {
                    message?: string;
                };
            };
            message?: string;
        };

        return (
            candidate.response?.data?.message ||
            candidate.message ||
            ERROR_MESSAGE
        );
    }

    return ERROR_MESSAGE;
};

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export const useProfitReport = () => {
    // Report data
    const [orders, setOrders] = useState<ProfitOrder[]>([]);
    const [summary, setSummary] =
        useState<ProfitSummary>({ ...EMPTY_SUMMARY });

    const [pagination, setPagination] =
        useState<PaginationInfo>({ ...INITIAL_PAGINATION });

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Filters
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("month");

    // Request status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Prevent outdated API responses from overwriting newer results
    const requestIdRef = useRef(0);

    // --------------------------------------------------
    // FETCH PROFIT REPORT
    // --------------------------------------------------

    const getProfitReport = useCallback(async () => {
        const currentRequestId = ++requestIdRef.current;

        setLoading(true);
        setError("");

        try {
            const response = await api.get<ReportResponse>(
                "/order/profit-report",
                {
                    params: {
                        page,
                        limit,
                        search: search.trim(),
                        fromDate: fromDate || undefined,
                        toDate: toDate || undefined,
                    },
                }
            );

            // Ignore outdated responses
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message || ERROR_MESSAGE
                );
            }

            setOrders(
                Array.isArray(result.data) ? result.data : []
            );

            setSummary(
                result.summary || { ...EMPTY_SUMMARY }
            );

            setPagination(
                result.pagination || { ...INITIAL_PAGINATION }
            );

        } catch (err: unknown) {
            // Ignore errors from outdated requests
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            console.error("Failed to load profit report:", err);

            setError(getErrorMessage(err));
            setOrders([]);
            setSummary({ ...EMPTY_SUMMARY });

        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [page, limit, search, fromDate, toDate]);

    // --------------------------------------------------
    // AUTOMATIC API FETCH
    // --------------------------------------------------

    useEffect(() => {
        void getProfitReport();

        return () => {
            // Invalidate the previous request when dependencies change
            requestIdRef.current += 1;
        };
    }, [getProfitReport]);

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

    const handlePageChange = useCallback((value: number) => {
        setPage(value);
    }, []);

    const handleLimitChange = useCallback((value: number) => {
        setLimit(value);
        setPage(1);
    }, []);

    // --------------------------------------------------
    // DATE PERIOD FILTERS
    // --------------------------------------------------

    const applyPeriod = useCallback((period: string) => {
        setSelectedPeriod(period);
        setPage(1);

        const today = new Date();
        const start = new Date(today);

        if (period === "today") {
            // Start and end dates are today.
        } else if (period === "week") {
            start.setDate(today.getDate() - 6);
        } else if (period === "month") {
            start.setDate(1);
        } else if (period === "year") {
            start.setMonth(0, 1);
        } else {
            // All time
            setFromDate("");
            setToDate("");
            return;
        }

        setFromDate(formatDateInput(start));
        setToDate(formatDateInput(today));
    }, []);

    // --------------------------------------------------
    // CUSTOM DATE FILTER
    // --------------------------------------------------

    const handleDateChange = useCallback(
        (type: "from" | "to", value: string) => {
            setSelectedPeriod("custom");
            setPage(1);

            if (type === "from") {
                setFromDate(value);
            } else {
                setToDate(value);
            }
        },
        []
    );

    // --------------------------------------------------
    // RETURN
    // --------------------------------------------------

    return {
        // Data
        orders,
        summary,
        pagination,

        // Pagination state
        page,
        limit,

        // Filter state
        search,
        fromDate,
        toDate,
        selectedPeriod,

        // Request state
        loading,
        error,

        // Actions
        getProfitReport,
        handleSearchChange,
        handlePageChange,
        handleLimitChange,
        applyPeriod,
        handleDateChange,
    };
};
