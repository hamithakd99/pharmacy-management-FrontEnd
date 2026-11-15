
import { useState } from "react";

import {
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    Input,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    FiTrendingUp,
    FiSearch,
    FiCalendar,
    FiRefreshCw,
    FiPackage,
} from "react-icons/fi";
import { useProfitReport } from "@/hooks/useProfitReport";
import type { ProfitOrder } from "@/types/profit-report.types";
import ProfitSummaryCards from "@/components/profit-report/ProfitSummaryCards";
import { currency, dateFormat, numberFormat } from "@/utils/profit-report.utils";
import ProfitChart from "@/components/profit-report/ProfitChart";
import ProfitOrderTable from "@/components/profit-report/ProfitOrderTable";
import ProfitOrderDetails from "@/components/profit-report/ProfitOrderDetails";

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const COLORS = {
    navy: "#073B4C",
    green: "#15966A",
    mint: "#EAF5F2",
    background: "#F5F8F9",
    muted: "#64748B",
    border: "#E8EEF0",
    red: "#DC5555",
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function ProfitReport() {
    // --------------------------------------------------
    // PROFIT REPORT HOOK
    // --------------------------------------------------

    const {
        orders,
        summary,
        pagination,

        search,
        fromDate,
        toDate,
        selectedPeriod,

        loading,
        error,

        getProfitReport,
        handleSearchChange,
        handlePageChange,
        handleLimitChange,
        applyPeriod,
        handleDateChange,
    } = useProfitReport();

    // --------------------------------------------------
    // SELECTED ORDER
    // --------------------------------------------------

    const [selectedOrder, setSelectedOrder] =
        useState<ProfitOrder | null>(null);

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <Box
            minH="100%"
            bg={COLORS.background}
            rounded="xl"
        >
            <VStack align="stretch" gap={5}>

                {/* ====================================== */}
                {/* HEADER */}
                {/* ====================================== */}

                <Flex
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    flexWrap="wrap"
                    gap={3}
                >
                    <Box>
                        <HStack gap={2}>
                            <Box
                                w="35px"
                                h="35px"
                                bg={COLORS.mint}
                                color={COLORS.green}
                                rounded="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <FiTrendingUp size={19} />
                            </Box>

                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                color={COLORS.navy}
                            >
                                Profit Report
                            </Text>
                        </HStack>

                        <Text
                            fontSize="sm"
                            color={COLORS.muted}
                            mt={2}
                        >
                            Monitor your pharmacy sales, costs and profitability.
                        </Text>
                    </Box>

                    <Button
                        size="sm"
                        variant="outline"
                        borderColor={COLORS.border}
                        color={COLORS.navy}
                        onClick={() => void getProfitReport()}
                        loading={loading}
                    >
                        <FiRefreshCw />
                        Refresh
                    </Button>
                </Flex>

                {/* ====================================== */}
                {/* DATE FILTERS */}
                {/* ====================================== */}

                <Box
                    bg="white"
                    p={{ base: 3, md: 4 }}
                    rounded="xl"
                    border="1px solid"
                    borderColor={COLORS.border}
                >
                    <Flex
                        justify="space-between"
                        align={{ base: "stretch", md: "center" }}
                        gap={3}
                        flexWrap="wrap"
                    >
                        <HStack gap={2}>
                            <FiCalendar color={COLORS.green} />

                            <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color={COLORS.navy}
                            >
                                Report Period
                            </Text>
                        </HStack>

                        <HStack gap={2} flexWrap="wrap">
                            {[
                                ["today", "Today"],
                                ["week", "7 Days"],
                                ["month", "This Month"],
                                ["year", "This Year"],
                                ["all", "All Time"],
                            ].map(([value, label]) => (
                                <Button
                                    key={value}
                                    size="xs"
                                    rounded="full"
                                    variant={
                                        selectedPeriod === value
                                            ? "solid"
                                            : "outline"
                                    }
                                    bg={
                                        selectedPeriod === value
                                            ? COLORS.navy
                                            : "white"
                                    }
                                    color={
                                        selectedPeriod === value
                                            ? "white"
                                            : COLORS.muted
                                    }
                                    borderColor={COLORS.border}
                                    onClick={() => applyPeriod(value)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </HStack>
                    </Flex>

                    <Grid
                        templateColumns={{
                            base: "1fr",
                            sm: "1fr 1fr",
                        }}
                        gap={3}
                        mt={4}
                    >
                        {/* FROM DATE */}

                        <Box>
                            <Text
                                fontSize="xs"
                                color={COLORS.muted}
                                mb={1}
                            >
                                From Date
                            </Text>

                            <Input
                                type="date"
                                size="sm"
                                value={fromDate}
                                onChange={(e) =>
                                    handleDateChange(
                                        "from",
                                        e.target.value
                                    )
                                }
                                max={toDate || undefined}
                                borderColor={COLORS.border}
                            />
                        </Box>

                        {/* TO DATE */}

                        <Box>
                            <Text
                                fontSize="xs"
                                color={COLORS.muted}
                                mb={1}
                            >
                                To Date
                            </Text>

                            <Input
                                type="date"
                                size="sm"
                                value={toDate}
                                min={fromDate || undefined}
                                onChange={(e) =>
                                    handleDateChange(
                                        "to",
                                        e.target.value
                                    )
                                }
                                borderColor={COLORS.border}
                            />
                        </Box>
                    </Grid>
                </Box>

                {/* ====================================== */}
                {/* ERROR MESSAGE */}
                {/* ====================================== */}

                {error && (
                    <Box
                        p={3}
                        bg="red.50"
                        rounded="lg"
                        color="red.600"
                    >
                        <Text fontSize="sm">
                            {error}
                        </Text>

                        <Button
                            size="xs"
                            mt={2}
                            onClick={() => void getProfitReport()}
                        >
                            Try Again
                        </Button>
                    </Box>
                )}

                {/* ====================================== */}
                {/* SUMMARY CARDS */}
                {/* ====================================== */}

                <ProfitSummaryCards
                    summary={summary}
                    colors={COLORS}
                    currency={currency}
                    numberFormat={numberFormat}
                />

                {/* ====================================== */}
                {/* PROFIT CHART */}
                {/* ====================================== */}

                <ProfitChart
                    orders={orders}
                    colors={COLORS}
                    currency={currency}
                />

                {/* ====================================== */}
                {/* ORDER REPORT */}
                {/* ====================================== */}

                <Box
                    bg="white"
                    rounded="xl"
                    border="1px solid"
                    borderColor={COLORS.border}
                    overflow="hidden"
                >
                    {/* ORDER REPORT HEADER */}

                    <Flex
                        justify="space-between"
                        align={{
                            base: "stretch",
                            md: "center",
                        }}
                        p={4}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <Box>
                            <Text
                                fontWeight="bold"
                                color={COLORS.navy}
                            >
                                Order Profit Details
                            </Text>

                            <Text
                                fontSize="xs"
                                color={COLORS.muted}
                                mt={1}
                            >
                                Detailed profit breakdown for each order
                            </Text>
                        </Box>

                        {/* SEARCH */}

                        <Box
                            position="relative"
                            w={{
                                base: "full",
                                md: "280px",
                            }}
                        >
                            <Box
                                position="absolute"
                                left="10px"
                                top="50%"
                                transform="translateY(-50%)"
                                color={COLORS.muted}
                                zIndex={1}
                            >
                                <FiSearch />
                            </Box>

                            <Input
                                size="sm"
                                pl="34px"
                                placeholder="Search Order ID or Number..."
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                borderColor={COLORS.border}
                            />
                        </Box>
                    </Flex>

                    {/* LOADING */}

                    {loading ? (
                        <VStack py={12} gap={3}>
                            <Spinner
                                size="lg"
                                color={COLORS.green}
                            />

                            <Text
                                color="gray.500"
                                fontSize="sm"
                            >
                                Loading profit report...
                            </Text>
                        </VStack>
                    ) : error ? (
                        /* ERROR STATE */

                        <VStack py={10} gap={3}>
                            <Text color="red.500">
                                {error}
                            </Text>

                            <Button
                                onClick={() => void getProfitReport()}
                                colorPalette="blue"
                            >
                                Retry
                            </Button>
                        </VStack>
                    ) : orders.length === 0 ? (
                        /* EMPTY STATE */

                        <VStack py={12} gap={2}>
                            <Box
                                fontSize="30px"
                                color="gray.300"
                            >
                                <FiPackage />
                            </Box>

                            <Text
                                fontWeight="semibold"
                                color={COLORS.navy}
                            >
                                No orders found
                            </Text>

                            <Text
                                fontSize="xs"
                                color={COLORS.muted}
                            >
                                Try changing your date range or search.
                            </Text>
                        </VStack>
                    ) : (
                        /* ORDER TABLE */

                        <ProfitOrderTable
                            orders={orders}
                            pagination={pagination}
                            colors={COLORS}
                            currency={currency}
                            dateFormat={dateFormat}
                            onViewOrder={setSelectedOrder}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    )}
                </Box>

                {/* ====================================== */}
                {/* FOOTNOTE */}
                {/* ====================================== */}

                <Text
                    fontSize="xs"
                    color={COLORS.muted}
                    textAlign="center"
                    pb={2}
                >
                    Profit is calculated using the buying price of the
                    allocated stock batch, including free issue stock
                    cost and allocated order discounts.
                </Text>
            </VStack>

            {/* ====================================== */}
            {/* ORDER DETAILS MODAL */}
            {/* ====================================== */}

            {selectedOrder && (
                <ProfitOrderDetails
                    order={selectedOrder}
                    colors={COLORS}
                    currency={currency}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </Box>
    );
}
