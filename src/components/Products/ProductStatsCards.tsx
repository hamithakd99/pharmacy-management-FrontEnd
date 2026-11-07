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
      columns={{ base: 2, md: 2, xl: 4 }}
      gap={{ base: 2, sm: 3, md: 5 }}
      mb={{ base: 4, md: 6 }}
    >
      {cards.map((card) => (
        <Card.Root
          key={card.title}
          borderTopWidth="4px"
          borderTopColor={`${card.color}.500`}
          shadow="sm"
        >
          <Card.Body p={{ base: 3, sm: 4, md: 5 }}>
            <Stat.Root>
              <Stat.Label>
                <Text fontWeight="medium" fontSize={{ base: "xs", sm: "sm" }}>
                  {card.title}
                </Text>
              </Stat.Label>

              <Stat.ValueText
                mt={{ base: 1, sm: 2 }}
                fontSize={{ base: "md", sm: "xl" }}
                overflowWrap="anywhere"
              >
                {card.value}
              </Stat.ValueText>

              <Stat.HelpText mt={{ base: 2, sm: 4 }}>
                <card.icon size={18} />
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}