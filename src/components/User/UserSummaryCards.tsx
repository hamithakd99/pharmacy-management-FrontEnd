import { Box, SimpleGrid, Text } from "@chakra-ui/react";

type Props = {
    totalStaff: number;
    admins: number;
    employees: number;
    cashiers: number;
    totalExternal: number;
    suppliers: number;
    customers: number;
};

function SummaryCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="lg"
            px={5}
            py={4}
            boxShadow="sm"
        >
            <Text
                fontSize="sm"
                color="gray.500"
            >
                {title}
            </Text>

            <Text
                fontSize="2xl"
                fontWeight="700"
                mt={1}
            >
                {value}
            </Text>
        </Box>
    );
}

export default function UserSummaryCards({
    totalStaff,
    admins,
    employees,
    cashiers,
    totalExternal,
    suppliers,
    customers,
}: Props) {

    return (
        <SimpleGrid
            columns={{
                base: 1,
                sm: 2,
                lg: 4,
            }}
            gap={4}
            mb={6}
        >
            <SummaryCard
                title="Total Staff"
                value={totalStaff}
            />

            <SummaryCard
                title="Admins"
                value={admins}
            />

            <SummaryCard
                title="Employees"
                value={employees}
            />

            <SummaryCard
                title="Cashiers"
                value={cashiers}
            />

            <SummaryCard
                title="External Users"
                value={totalExternal}
            />

            <SummaryCard
                title="Suppliers"
                value={suppliers}
            />

            <SummaryCard
                title="Customers"
                value={customers}
            />
        </SimpleGrid>
    );
}