import {
  Box,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  productId: string;
  name: string;
  brand: string;
  totalStock: number;
}

interface ProductSearchBarProps {
  onSelect: (product: Product) => void;
}

export default function ProductSearchBar({
  onSelect,
}: ProductSearchBarProps) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product/search?query=${search}`
        );

        setProducts(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Box position="relative" w="full">

      <Input
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        bg="white"
      />

      {loading && (
        <Spinner
          size="sm"
          position="absolute"
          top="12px"
          right="15px"
        />
      )}

      {products.length > 0 && (
        <Box
          position="absolute"
          mt={2}
          w="100%"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          zIndex={999}
          maxH="300px"
          overflowY="auto"
        >
          <VStack gap={0} align="stretch">

            {products.map((product) => (

              <Box
                key={product.id}
                p={3}
                cursor="pointer"
                _hover={{
                  bg: "gray.100",
                }}
                onClick={() => {
                  setSearch(product.name);
                  setProducts([]);
                  onSelect(product);
                }}
              >
                <Text fontWeight="600">
                  {product.name}
                </Text>

                <Text
                  fontSize="sm"
                  color="gray.500"
                >
                  {product.productId}
                </Text>

                <Text
                  fontSize="sm"
                  color="gray.500"
                >
                  Brand : {product.brand}
                </Text>

                <Text
                  fontSize="sm"
                  color={
                    product.totalStock <= 0
                      ? "red.500"
                      : "green.500"
                  }
                >
                  Stock : {product.totalStock}
                </Text>

              </Box>

            ))}

          </VStack>
        </Box>
      )}
    </Box>
  );
}