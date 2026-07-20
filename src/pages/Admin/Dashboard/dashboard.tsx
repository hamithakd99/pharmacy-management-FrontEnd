import {
    Box,
    Grid,
    GridItem,
    VStack,
} from "@chakra-ui/react";

import DashboardHeader from "./dashboardHeader";
import StatCards from "./statCards";
import SalesChart from "./salesChart";
import CategoryChart from "./categoryChart";
import TopSellingProducts from "./topSellingProducts";
import LowStockTable from "./lowStockTable";
import RecentBills from "./recentBills";
import QuickActions from "./quickActions";

export default function Dashboardx() {

    return (

        <Box

            bg="gray.50"

            minH="100vh"

            p={{
                base: "4",
                md: "6",
                lg: "8"
            }}

        >

            <VStack

                align="stretch"

                gap="6"

            >

                {/* ===========================
                    DASHBOARD HEADER
                ============================ */}

                <DashboardHeader />


                {/* ===========================
                    KPI CARDS
                ============================ */}

                <StatCards />


                {/* ===========================
                    CHART SECTION
                ============================ */}

                <Grid

                    templateColumns={{

                        base: "1fr",

                        xl: "2fr 1fr"

                    }}

                    gap="6"

                >

                    <GridItem>

                        <SalesChart />

                    </GridItem>


                    <GridItem>

                        <CategoryChart />

                    </GridItem>

                </Grid>



                {/* ===========================
                    PRODUCTS SECTION
                ============================ */}

                <Grid

                    templateColumns={{

                        base: "1fr",

                        xl: "1fr 1fr"

                    }}

                    gap="6"

                >

                    <GridItem>

                        <TopSellingProducts />

                    </GridItem>


                    <GridItem>

                        <LowStockTable />

                    </GridItem>

                </Grid>



                {/* ===========================
                    RECENT BILLS
                ============================ */}

                <RecentBills />


                {/* ===========================
                    QUICK ACTIONS
                ============================ */}

                <QuickActions />

            </VStack>

        </Box>

    );

}