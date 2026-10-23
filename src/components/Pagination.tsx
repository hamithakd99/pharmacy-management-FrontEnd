
import { Button, Flex, HStack, Text } from "@chakra-ui/react";

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export default function Pagination({
    pagination,
    onPageChange,
    onLimitChange,
}: PaginationProps) {
    const { page, limit, total, totalPages } = pagination;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <Flex
            justify="space-between"
            align="center"
            flexWrap="wrap"
            gap={3}
            mt={4}
            py={3}
        >
            <HStack gap={2}>
                <Text fontSize="sm" color="gray.600">
                    Rows:
                </Text>

                <select
                    aria-label="Rows per page"
                    value={limit}
                    onChange={(event) =>
                        onLimitChange(Number(event.target.value))
                    }
                    style={{
                        padding: "6px 10px",
                        border: "1px solid #CBD5E0",
                        borderRadius: "6px",
                    }}
                >
                    {[10, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>

                <Text fontSize="sm" color="gray.600">
                    Showing {start}–{end} of {total}
                </Text>
            </HStack>

            <HStack gap={2}>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </Button>

                <Text fontSize="sm" whiteSpace="nowrap">
                    Page {page} of {Math.max(1, totalPages)}
                </Text>

                <Button
                    size="sm"
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </Button>
            </HStack>
        </Flex>
    );
}
