import { SimpleGrid, Stat, Card, Text } from "@chakra-ui/react";
import { LuBoxes, LuPackage, LuTriangleAlert, LuWallet } from "react-icons/lu";
import type { Product } from "./ProductTable";

type ProductStatsCardsProps = {
  products: Product[];
};

export default function ProductStatsCards({
  products,
}: ProductStatsCardsProps) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.totalStock,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.buyingPrice * product.totalStock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.totalStock <= product.reorderLevel
  ).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: LuBoxes,
      color: "blue",
    },
    {
      title: "Current Stock",
      value: totalStock,
      icon: LuPackage,
      color: "green",
    },
    {
      title: "Inventory Value",
      value: `Rs. ${inventoryValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: LuWallet,
      color: "purple",
    },
    {
      title: "Low Stock Products",
      value: lowStockProducts,
      icon: LuTriangleAlert,
      color: "red",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={5} mb={6}>
      {stats.map((stat) => (
        <Card.Root
          key={stat.title}
          borderTopWidth="4px"
          borderTopColor={`${stat.color}.500`}
          shadow="sm"
        >
          <Card.Body>
            <Stat.Root>
              <Stat.Label>
                <Text fontWeight="medium">{stat.title}</Text>
              </Stat.Label>

              <Stat.ValueText mt={2}>{stat.value}</Stat.ValueText>

              <Stat.HelpText mt={4}>
                <stat.icon size={22} />
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}