import api from "@/api/axios";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type Category = { id: number; name: string };

type ProductForm = {
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  dosageForm: string;
  strengthValue: string;
  strengthUnit: string;
  dimensionsValue: string;
  dimensionsUnit: string;
  packSize: string;
};

type ProductData = {
  id: number;
  name?: string | null;
  brand?: string | null;
  categoryId?: number | null;
  description?: string | null;
  dosageForm?: string | null;
  strengthValue?: string | number | null;
  strengthUnit?: string | null;
  dimensionsValue?: string | number | null;
  dimensionsUnit?: string | null;
  packSize?: number | null;
};

const emptyProduct: ProductForm = {
  name: "",
  brand: "",
  categoryId: "",
  description: "",
  dosageForm: "",
  strengthValue: "",
  strengthUnit: "",
  dimensionsValue: "",
  dimensionsUnit: "",
  packSize: "",
};

const dosageForms = [
  ["TABLET", "Tablet"],
  ["CAPSULE", "Capsule"],
  ["SYRUP", "Syrup"],
  ["INJECTION", "Injection"],
  ["CREAM", "Cream"],
  ["OINTMENT", "Ointment"],
  ["DROPS", "Drops"],
  ["SOLUTION", "Solution"],
  ["SERUM", "Serum"],
  ["SACHET", "Sachet"],
  ["GEL", "Gel"],
  ["LOTION", "Lotion"],
  ["POWDER", "Powder"],
  ["MOUTHWASH", "Mouthwash"],
  ["SURGICAL_ITEMS", "Surgical Items"],
  ["OTHER", "Other"],
];

const strengthUnits = [
  ["MCG", "mcg"],
  ["MG", "mg"],
  ["G", "g"],
  ["KG", "kg"],
  ["ML", "ml"],
  ["L", "L"],
];

const dimensionUnits = [
  ["MM", "Millimetres (mm)"],
  ["CM", "Centimetres (cm)"],
  ["M", "Metres (m)"],
  ["INCH", "Inches"],
  ["FEET", "Feet"],
  ["YARDS", "Yards"],
];

const inputStyles = {
  borderRadius: "lg",
  borderColor: "gray.200",
  bg: "white",
  _hover: { borderColor: "teal.400" },
  _focusVisible: {
    borderColor: "teal.500",
    boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
  },
};

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <Flex align="start" gap={3} mb={5}>
      <Flex
        w="38px"
        h="38px"
        flexShrink={0}
        align="center"
        justify="center"
        rounded="xl"
        bg="teal.50"
        color="teal.700"
        fontWeight="bold"
      >
        {number}
      </Flex>
      <Box>
        <Heading size="md" color="gray.800">{title}</Heading>
        <Text mt={1} fontSize="sm" color="gray.500">{description}</Text>
      </Box>
    </Flex>
  );
}

function FieldLabel({
  children,
  optional = false,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <Flex align="center" gap={2} mb={2} wrap="wrap">
      <Text fontSize="sm" fontWeight="semibold" color="gray.700">{children}</Text>
      {optional && <Text fontSize="xs" color="gray.400">Optional</Text>}
    </Flex>
  );
}

function mapProductToForm(data: ProductData): ProductForm {
  return {
    name: data.name ?? "",
    brand: data.brand ?? "",
    categoryId: data.categoryId == null ? "" : String(data.categoryId),
    description: data.description ?? "",
    dosageForm: data.dosageForm ?? "",
    strengthValue: data.strengthValue == null ? "" : String(data.strengthValue),
    strengthUnit: data.strengthUnit ?? "",
    dimensionsValue: data.dimensionsValue == null ? "" : String(data.dimensionsValue),
    dimensionsUnit: data.dimensionsUnit ?? "",
    packSize: data.packSize == null ? "" : String(data.packSize),
  };
}

export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const productData = location.state?.item as ProductData | undefined;

  const [product, setProduct] = useState<ProductForm>(emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/login", { replace: true });
      return;
    }

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      toast.error("Invalid product ID.");
      navigate("/admin/products", { replace: true });
      return;
    }

    if (!productData) {
      toast.error("Product details are unavailable. Open this product from the product list.");
      navigate("/admin/products", { replace: true });
      return;
    }

    setProduct(mapProductToForm(productData));
    setPageLoading(false);

    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const response = await api.get("/category/all");
        if (!cancelled) setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        if (!cancelled) toast.error("Failed to load categories.");
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, productData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setProduct((previous) => ({ ...previous, [name]: value }));
  }

  function handleDiscard() {
    if (productData) setProduct(mapProductToForm(productData));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    if (!product.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    const parsedPackSize =
      product.packSize.trim() === "" ? null : Number(product.packSize);

    if (
      parsedPackSize !== null &&
      (!Number.isInteger(parsedPackSize) || parsedPackSize <= 0)
    ) {
      toast.error("Pack size must be a positive whole number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: product.name.trim(),
        brand: product.brand.trim() || null,
        categoryId: product.categoryId ? Number(product.categoryId) : null,
        description: product.description.trim() || null,
        dosageForm: product.dosageForm || null,
        strengthValue: product.strengthValue.trim() || null,
        strengthUnit: product.strengthUnit || null,
        dimensionsValue: product.dimensionsValue.trim() || null,
        dimensionsUnit: product.dimensionsUnit || null,
        packSize: parsedPackSize,
      };

      const response = await api.put(`/product/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data?.message || "Product updated successfully.");
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Update product error:", error);
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        toast.error("You are not authorized. Please log in again.");
      } else {
        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update product."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <Flex minH="300px" align="center" justify="center">
        <Text color="gray.500">Loading product details...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100%" bg="gray.50" px={{ base: 3, md: 6, xl: 8 }} py={{ base: 4, md: 7 }}>
      <Box maxW="1100px" mx="auto">
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={6}
        >
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="teal.700" letterSpacing="1.5px" mb={2}>
              INVENTORY MANAGEMENT
            </Text>
            <Heading size={{ base: "xl", md: "2xl" }} color="gray.900" letterSpacing="-0.7px">
              Edit Product
            </Heading>
            <Text mt={2} color="gray.500" fontSize="sm">
              Update product details. The existing product ID will remain unchanged.
            </Text>
          </Box>

          <Flex
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            rounded="xl"
            px={4}
            py={3}
            gap={3}
            align="center"
            w={{ base: "100%", md: "auto" }}
          >
            <Flex w="40px" h="40px" rounded="lg" bg="teal.50" color="teal.700" align="center" justify="center" fontSize="xl">
              ✎
            </Flex>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800">Editing Existing Product</Text>
              <Text fontSize="xs" color="gray.500">Product ID cannot be changed</Text>
            </Box>
          </Flex>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={5}>
            <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={{ base: 4, md: 6 }} boxShadow="sm">
              <SectionHeader number="01" title="Basic Information" description="Update the product identity and category." />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <GridItem>
                  <FieldLabel>Product Name *</FieldLabel>
                  <Input {...inputStyles} name="name" placeholder="e.g. Paracetamol" value={product.name} onChange={handleChange} required />
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Brand</FieldLabel>
                  <Input {...inputStyles} name="brand" placeholder="e.g. Panadol" value={product.brand} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Category</FieldLabel>
                  <NativeSelect.Root disabled={categoriesLoading}>
                    <NativeSelect.Field {...inputStyles} name="categoryId" value={product.categoryId} onChange={handleChange}>
                      <option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {!categoriesLoading && categories.length === 0 && (
                    <Text mt={2} fontSize="xs" color="orange.600">No categories found. You can add one later if needed.</Text>
                  )}
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Pack Size</FieldLabel>
                  <Input {...inputStyles} name="packSize" type="number" min="1" step="1" placeholder="e.g. 20" value={product.packSize} onChange={handleChange} />
                  <Text mt={1} fontSize="xs" color="gray.400">Number of units per pack</Text>
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FieldLabel optional>Description</FieldLabel>
                  <Textarea {...inputStyles} name="description" placeholder="Enter product details, notes or other relevant information..." value={product.description} onChange={handleChange} rows={3} resize="vertical" />
                </GridItem>
              </SimpleGrid>
            </Box>

            <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={{ base: 4, md: 6 }} boxShadow="sm">
              <SectionHeader number="02" title="Medicine Information" description="Dosage form and strength are optional for products that do not need them." />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <GridItem>
                  <FieldLabel optional>Dosage Form</FieldLabel>
                  <NativeSelect.Root>
                    <NativeSelect.Field {...inputStyles} name="dosageForm" value={product.dosageForm} onChange={handleChange}>
                      <option value="">Select dosage form</option>
                      {dosageForms.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Strength Value</FieldLabel>
                  <Input {...inputStyles} name="strengthValue" type="text" placeholder="e.g. 500, 5 mg/5 ml" value={product.strengthValue} onChange={handleChange} />
                  <Text mt={1} fontSize="xs" color="gray.400">Text input supports flexible strength formats.</Text>
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Strength Unit</FieldLabel>
                  <NativeSelect.Root>
                    <NativeSelect.Field {...inputStyles} name="strengthUnit" value={product.strengthUnit} onChange={handleChange}>
                      <option value="">Select strength unit</option>
                      {strengthUnits.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </GridItem>
              </SimpleGrid>
            </Box>

            <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={{ base: 4, md: 6 }} boxShadow="sm">
              <SectionHeader number="03" title="Dimensions" description="For non-medicine items and products with physical measurements." />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <GridItem>
                  <FieldLabel optional>Dimensions Value</FieldLabel>
                  <Input {...inputStyles} name="dimensionsValue" placeholder="e.g. 10 x 20 or 15" value={product.dimensionsValue} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FieldLabel optional>Dimensions Unit</FieldLabel>
                  <NativeSelect.Root>
                    <NativeSelect.Field {...inputStyles} name="dimensionsUnit" value={product.dimensionsUnit} onChange={handleChange}>
                      <option value="">Select measurement unit</option>
                      {dimensionUnits.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </GridItem>
              </SimpleGrid>
            </Box>

            <Flex
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              rounded="2xl"
              p={{ base: 4, md: 5 }}
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
              boxShadow="sm"
            >
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">Save product changes?</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>Your existing product ID will remain unchanged.</Text>
              </Box>
              <Flex gap={3} direction={{ base: "column-reverse", sm: "row" }} wrap="wrap">
                <Button type="button" variant="outline" borderColor="gray.300" onClick={() => navigate("/admin/products")} disabled={saving}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" borderColor="gray.300" onClick={handleDiscard} disabled={saving}>
                  Discard Changes
                </Button>
                <Button type="submit" colorPalette="teal" loading={saving} disabled={saving} minW={{ base: "100%", sm: "160px" }}>
                  Update Product
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
