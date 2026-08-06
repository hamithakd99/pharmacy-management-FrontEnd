import type { StockBatch } from "@/types/stockBatch";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

type Props = {

    stockBatches: StockBatch[];

};

export default function GRNStatsCards({

    stockBatches,

}: Props) {

    // Today's Date
    const today = new Date().toDateString();

    // Total GRNs
    const totalGRNs = stockBatches.length;

    // Today's GRNs
    const todaysGRNs = stockBatches.filter(

        (batch) =>

            new Date(batch.receivedDate).toDateString() === today

    ).length;

    // Pending Payments
    const pendingPayments = stockBatches.filter(

        (batch) =>

            batch.paymentStatus === "PENDING"

    ).length;

    // Total Received Items Today
    const itemsReceivedToday = stockBatches

        .filter(

            (batch) =>

                new Date(batch.receivedDate).toDateString() === today

        )

        .reduce(

            (total, batch) =>

                total +

                batch.items.reduce(

                    (sum: number, item: any) =>

                        sum + item.receivedQuantity,

                    0

                ),

            0

        );

    const cards = [

        {

            title: "Total GRNs",

            value: totalGRNs,

        },

        {

            title: "Today's GRNs",

            value: todaysGRNs,

        },

        {

            title: "Pending Payments",

            value: pendingPayments,

        },

        {

            title: "Items Received Today",

            value: itemsReceivedToday,

        },

    ];

    return (

        <SimpleGrid

            minChildWidth="180px"

            gap={4}

            mt={5}

        >

            {

                cards.map((card) => (

                    <Box

                        key={card.title}

                        rounded="lg"

                        bg="white"

                        borderWidth="1px"

                        borderColor="gray.200"

                        boxShadow="sm"

                        p={5}

                    >

                        <Text

                            fontSize="sm"

                            color="gray.500"

                            fontWeight="medium"

                        >

                            {card.title}

                        </Text>

                        <Text

                            mt={3}

                            fontSize="3xl"

                            fontWeight="bold"

                        >

                            {card.value}

                        </Text>

                    </Box>

                ))

            }

        </SimpleGrid>

    );

}