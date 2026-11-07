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
    <SimpleGrid
      columns={{ base: 2, sm: 2, md: 4 }}
      gap={{ base: 2, sm: 3, md: 4 }}
      mt={{ base: 4, md: 5 }}
      mb={{ base: 4, md: 5 }}
    >
      {cards.map((card) => (
        <Box
          key={card.title}
          rounded="lg"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
          p={{ base: 3, sm: 5 }}
        >
          <Text
            fontSize={{ base: "xs", sm: "sm" }}
            lineHeight="short"
            color="gray.500"
            fontWeight="medium"
          >
            {card.title}
          </Text>

          <Text mt={{ base: 1, sm: 3 }} fontSize={{ base: "xl", sm: "3xl" }} fontWeight="bold">
            {card.value.toLocaleString()}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}