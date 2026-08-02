
import DeleteProductDialog from "@/components/Products/DeleteProductDialog";
import ProductStatsCards from "@/components/Products/ProductStatsCards";
import ProductTable, { type Product } from "@/components/Products/ProductTable";
import ProductViewDialog from "@/components/Products/ProductViewDialog";
import ProductSearchBar from "@/components/Products/ProductSearchBar";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ProductManagement() {

  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [viewProductId, setViewProductId] = useState<number>();

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
        const keyword = search.toLowerCase();

        return (
            product.productId.toLowerCase().includes(keyword) ||
            product.name.toLowerCase().includes(keyword) ||
            (product.brand ?? "").toLowerCase().includes(keyword)
        );
    });



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

  return (
    <>
      <Box backgroundColor="blue.500"
        p={4} rounded="md" textAlign="center" fontWeight="bold" mb="50px">
        Product Management
      </Box>

      <ProductStatsCards products={products} />

      <ProductSearchBar
        search={search}
        setSearch={setSearch}
        onAddProduct={() => navigate("/admin/products/add")}
      />

      <ProductTable

        products={filteredProducts}

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
      
    </>
  )

}