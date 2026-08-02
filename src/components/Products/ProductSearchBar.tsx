import {
  Button,
  HStack,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { LuPlus, LuSearch } from "react-icons/lu";

type ProductSearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAddProduct: () => void;
};

export default function ProductSearchBar({
  search,
  setSearch,
  onAddProduct,
}: ProductSearchBarProps) {
  return (
    <HStack
      justify="space-between"
      align="center"
      mb={5}
      flexWrap="wrap"
      gap={4}
    >
      <InputGroup
        startElement={<LuSearch />}
        maxW="400px"
      >
        <Input
          placeholder="Search by Product ID, Name or Brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Button
        colorPalette="blue"
        onClick={onAddProduct}
      >
        <LuPlus />
        Add Product
      </Button>
    </HStack>
  );
}