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
      align={{ base: "stretch", sm: "center" }}
      mb={{ base: 4, md: 5 }}
      flexWrap="wrap"
      gap={{ base: 2, sm: 4 }}
    >
      <InputGroup
        startElement={<LuSearch />}
        maxW={{ base: "100%", sm: "400px" }}
        flex="1"
      >
        <Input
          size={{ base: "sm", sm: "md" }}
          placeholder="Search by Product ID, Name or Brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Button
        size={{ base: "sm", sm: "md" }}
        width={{ base: "100%", sm: "auto" }}
        colorPalette="blue"
        onClick={onAddProduct}
      >
        <LuPlus />
        Add Product
      </Button>
    </HStack>
  );
}