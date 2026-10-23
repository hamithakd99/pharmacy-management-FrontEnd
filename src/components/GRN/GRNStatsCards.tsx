import { Box, SimpleGrid, Text } from "@chakra-ui/react";

export type GRNStats = {
  totalGRNs: number;
  todaysGRNs: number;
  pendingPayments: number;
  itemsReceivedToday: number;
};

type Props = {
  stats: GRNStats;
};

export default function GRNStatsCards({ stats }: Props) {
  const cards = [
    {
      title: "Total GRNs",
      value: stats.totalGRNs,
    },
    {
      title: "Today's GRNs",
      value: stats.todaysGRNs,
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
    },
    {
      title: "Items Received Today",
      value: stats.itemsReceivedToday,
    },
  ];

  return (
    <SimpleGrid minChildWidth="180px" gap={4} mt={5} mb={5}>
      {cards.map((card) => (
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

          <Text mt={3} fontSize="3xl" fontWeight="bold">
            {card.value.toLocaleString()}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}