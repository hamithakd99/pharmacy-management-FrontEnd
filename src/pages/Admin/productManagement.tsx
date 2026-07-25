
import DeleteProductDialog from "@/components/Products/DeleteProductDialog";
import ProductStatsCards from "@/components/Products/ProductStatsCards";
import ProductTable from "@/components/Products/ProductTable";
import ProductViewDialog from "@/components/Products/ProductViewDialog";
import ProductSearchBar from "@/components/productSearchBar";
import { Box, Button, Flex} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";


export default function ProductManagement() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [viewProductId, setViewProductId] = useState<number>();


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

  // async function deleteProduct() {

  //   if (!selectedProduct) return;

  //   try {

  //     await axios.delete(

  //       import.meta.env.VITE_BACKEND_URL +

  //       "/product/delete/" +

  //       selectedProduct.id,

  //       {

  //         headers: {

  //           Authorization:

  //             "Bearer " +

  //             localStorage.getItem("token")

  //         }

  //       }

  //     );

  //     toast.success(

  //       "Product deleted successfully"

  //     );

  //     setDeleteDialogOpen(false);

  //     getAllProducts();

  //   }

  //   catch (error: any) {

  //     toast.error(

  //       error.response?.data?.error ||

  //       "Failed to delete product"

  //     );

  //   }

  // }

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

      <ProductStatsCards products={products} />

      <ProductTable

        products={products}

        onView={(product) => {

          setViewProductId(product.id);

          setViewDialogOpen(true);

        }}

        onEdit={(product) => {

          navigate(

            `/admin/products/edit/${product.id}`,

            {

              state: {

                item: product

              }

            }

          );

        }}

        onDelete={(product) => {

          setSelectedProduct(product);

          setDeleteDialogOpen(true);

        }}

      />
      <ProductViewDialog
        open={viewDialogOpen}
        onClose={() => {

          setViewDialogOpen(false);

          setViewProductId(undefined);

        }}
        productId={viewProductId}
      />
      <DeleteProductDialog

        open={deleteDialogOpen}

        onClose={() => {

          setDeleteDialogOpen(false);

          setSelectedProduct(null);

        }}

        product={selectedProduct}

        onDeleted={getAllProducts}

      />
      {/* <Dialog.Root
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
      </Dialog.Root> */}
    </>
  )

}