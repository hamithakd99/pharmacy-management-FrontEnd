import { SimpleGrid, Stat, Card, Text } from "@chakra-ui/react";
import {
  LuBoxes,
  LuPackage,
  LuTriangleAlert,
  LuWallet,
} from "react-icons/lu";

export type ProductStats = {
  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
};

type ProductStatsCardsProps = {
  stats: ProductStats;
};

export default function ProductStatsCards({
  stats,
}: ProductStatsCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: LuBoxes,
      color: "blue",
    },
    {
      title: "Current Stock",
      value: stats.totalStock.toLocaleString(),
      icon: LuPackage,
      color: "green",
    },
    {
      title: "Inventory Value",
      value: `Rs. ${stats.inventoryValue.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: LuWallet,
      color: "purple",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts.toLocaleString(),
      icon: LuTriangleAlert,
      color: "red",
    },
  ];

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, xl: 4 }}
      gap={5}
      mb={6}
    >
      {cards.map((card) => (
        <Card.Root
          key={card.title}
          borderTopWidth="4px"
          borderTopColor={`${card.color}.500`}
          shadow="sm"
        >
          <Card.Body>
            <Stat.Root>
              <Stat.Label>
                <Text fontWeight="medium">
                  {card.title}
                </Text>
              </Stat.Label>

              <Stat.ValueText mt={2}>
                {card.value}
              </Stat.ValueText>

              <Stat.HelpText mt={4}>
                <card.icon size={22} />
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}