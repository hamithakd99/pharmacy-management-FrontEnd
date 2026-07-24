
import ProductViewDialog from "@/components/Products/ProductViewDialog";
import ProductSearchBar from "@/components/productSearchBar";
import { Box, Button, CloseButton, Dialog, Flex, HStack, Portal, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAddBox } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Total Products",
    value: 1248,
  },
  {
    title: "Total Categories",
    value: 48,
  },
  {
    title: "Low Stock Products",
    value: 5,
  },
  {
    title: "Out of Stock Products",
    value: 12,
  },
  {
    title: "Expire Soon Products",
    value: 1,
  }
]

export default function ProductManagement() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  function getAllProducts() {

    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/product/all"
      )

      .then((response) => {

        setProducts(response.data);

      });

  }

  useEffect(() => {
    getAllProducts();
  }, [])

  async function deleteProduct() {

    if (!selectedProduct) return;

    try {

      await axios.delete(

        import.meta.env.VITE_BACKEND_URL +

        "/product/delete/" +

        selectedProduct.id,

        {

          headers: {

            Authorization:

              "Bearer " +

              localStorage.getItem("token")

          }

        }

      );

      toast.success(

        "Product deleted successfully"

      );

      setDeleteDialogOpen(false);

      getAllProducts();

    }

    catch (error: any) {

      toast.error(

        error.response?.data?.error ||

        "Failed to delete product"

      );

    }

  }

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [viewProductId, setViewProductId] = useState<number>();

  return (
    <>
      <Box backgroundColor="blue.500"
        p={4} rounded="md" textAlign="center" fontWeight="bold">
        Product Management
      </Box>
      <Flex mt="4" justifyContent="space-between" alignItems="center">
        <Box flex="1" mr="4">
          <ProductSearchBar onSelect={(product) => {
            console.log(product);
          }} />
        </Box>

        <Link to="/admin/products/add">
          <Button colorScheme="blue">
            <MdAddBox />
            Add Product
          </Button>
        </Link>


        {/* <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline"><MdAddBox />Add Product</Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner >
              <Dialog.Content maxW="1000px"
                maxH="90vh">
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
                <Dialog.Body>
                  <AddProduct />
                </Dialog.Body>
                <Dialog.Footer />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root> */}

      </Flex>

      <SimpleGrid
        minChildWidth="150px"
        gap={4}
        mt={4}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            rounded="lg"
            p={4}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="sm"
            minH="110px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Text
              fontSize="sm"
              color="gray.600"
              fontWeight="medium"
            >
              {card.title}
            </Text>

            <Text
              fontSize="3xl"
              fontWeight="bold"
            >
              {card.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box>
        <HStack>
          <Box
            w="100%"
            justifyContent="center"
            alignItems="center"
            display="flex">
            <Table.Root variant="outline" colorPalette="blue" mt={4}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Product ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Product Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Brand</Table.ColumnHeader>
                  <Table.ColumnHeader>Current Stock</Table.ColumnHeader>
                  <Table.ColumnHeader>Selling Price</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {products.map((product: any, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell textStyle="sm" textAlign="start">{product.productId}</Table.Cell>

                    <Table.Cell>{product.name}</Table.Cell>

                    <Table.Cell>{product.brand ?? "-"}</Table.Cell>

                    <Table.Cell>
                      {product.totalStock}
                    </Table.Cell>

                    <Table.Cell>
                      <Text textStyle="sm" fontWeight="bold">
                        Rs. {product.sellingPrice.toFixed(2)}
                      </Text>
                      <Text textStyle="xs">Buy Price Rs. {product.buyingPrice.toFixed(2)}</Text>
                    </Table.Cell>

                    <Table.Cell>
                      {/* <HStack>
                        <Button colorScheme="blue" onClick={() => navigate(`/admin/products/edit/${product.id}`, { state: { item: product } })}>View</Button>
                        <Button colorScheme="blue" onClick={() => navigate(`/admin/products/edit/${product.id}`, { state: { item: product } })}>Edit</Button>
                        <Button colorScheme="red" onClick={() => {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }}>Delete</Button>
                      </HStack> */}
                      <HStack>

                        <Button
                          colorPalette="teal"
                          onClick={() => {

                            setViewProductId(product.id);

                            setViewDialogOpen(true);

                          }}
                        >
                          View
                        </Button>

                        <Button
                          colorPalette="blue"
                          onClick={() =>
                            navigate(`/admin/products/edit/${product.id}`, {
                              state: {
                                item: product,
                              },
                            })
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          colorPalette="red"
                          onClick={() => {

                            setSelectedProduct(product);

                            setDeleteDialogOpen(true);

                          }}
                        >
                          Delete
                        </Button>

                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

        </HStack>
      </Box>
      <ProductViewDialog
        open={viewDialogOpen}
        onClose={() => {

          setViewDialogOpen(false);

          setViewProductId(undefined);

        }}
        productId={viewProductId}
      />
      <Dialog.Root
        open={deleteDialogOpen}
        onOpenChange={(e) => setDeleteDialogOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content maxW="450px">
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>

              <Dialog.Header>
                <Dialog.Title color="red.500">
                  Delete Product
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <VStack align="start" gap={3}>
                  <Text>
                    Are you sure you want to delete this product?
                  </Text>

                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {selectedProduct?.name}
                  </Text>

                  <Text
                    color="red.500"
                    fontSize="sm"
                  >
                    This action cannot be undone.
                  </Text>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  colorPalette="red"
                  onClick={deleteProduct}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )

}