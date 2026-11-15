
import {
    Badge,
    Box,
    Button,
    Text,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";

import Pagination from "@/components/Pagination";
import type { PaginationInfo } from "@/components/Pagination";
import type { ProfitOrder } from "@/types/profit-report.types";


interface ProfitOrderTableProps {
    orders: ProfitOrder[];
    pagination: PaginationInfo;

    colors: {
        navy: string;
        green: string;
        red: string;
        muted: string;
        border: string;
    };

    currency: (value: number) => string;
    dateFormat: (date: string) => string;

    onViewOrder: (order: ProfitOrder) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const HEADERS = [
    "Order Number",
    "Date",
    "Customer",
    "Sales",
    "Buying Cost",
    "Free Issue",
    "Net Profit",
    "Action",
];

const ProfitOrderTable = ({
    orders,
    pagination,
    colors,
    currency,
    dateFormat,
    onViewOrder,
    onPageChange,
    onLimitChange,
}: ProfitOrderTableProps) => {
    return (
        <>
            {/* ORDER TABLE */}
            <Box overflowX="auto">
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "1050px",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#F8FAFB" }}>
                            {HEADERS.map((heading) => (
                                <th
                                    key={heading}
                                    style={{
                                        padding: "13px 14px",
                                        textAlign:
                                            heading === "Order Number" ||
                                            heading === "Customer"
                                                ? "left"
                                                : "right",
                                        fontSize: "11px",
                                        color: colors.muted,
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.orderId}
                                style={{
                                    borderTop: `1px solid ${colors.border}`,
                                }}
                            >
                                {/* ORDER NUMBER */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color={colors.navy}
                                    >
                                        {order.orderNumber}
                                    </Text>
                                </td>

                                {/* DATE */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {dateFormat(order.createdAt)}
                                </td>

                                {/* CUSTOMER */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        fontSize: "12px",
                                        textAlign: "left",
                                    }}
                                >
                                    {order.customerName}
                                </td>

                                {/* SALES */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {currency(order.totalAmount)}
                                </td>

                                {/* BUYING COST */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {currency(order.totalBuyingCost)}
                                </td>

                                {/* FREE ISSUE */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                        fontSize: "12px",
                                    }}
                                >
                                    <Badge
                                        colorPalette="green"
                                        variant="subtle"
                                    >
                                        {order.totalFreeIssueQuantity}
                                    </Badge>
                                </td>

                                {/* NET PROFIT */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color={
                                            order.netProfit >= 0
                                                ? colors.green
                                                : colors.red
                                        }
                                    >
                                        {currency(order.netProfit)}
                                    </Text>

                                    <Text
                                        fontSize="10px"
                                        color={colors.muted}
                                    >
                                        {Number(
                                            order.profitMargin || 0
                                        ).toFixed(2)}
                                        % margin
                                    </Text>
                                </td>

                                {/* ACTION */}
                                <td
                                    style={{
                                        padding: "13px 14px",
                                        textAlign: "right",
                                    }}
                                >
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        borderColor={colors.border}
                                        color={colors.navy}
                                        onClick={() => onViewOrder(order)}
                                    >
                                        <FiEye />
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>

            {/* PAGINATION */}
            <Box
                p={4}
                borderTop="1px solid"
                borderColor={colors.border}
            >
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            </Box>
        </>
    );
};

export default ProfitOrderTable;
