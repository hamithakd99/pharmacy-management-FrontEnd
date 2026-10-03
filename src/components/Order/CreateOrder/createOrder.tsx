import { useState, type ComponentProps } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Text, } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiUser, FiPackage, FiFileText, FiEye, } from "react-icons/fi";
import CustomerStep from "./CustomerStep";
import type { SelectedProduct } from "./ProductStep";
import ProductStep from "./ProductStep";
import OrderPreview from "./OrderPreview";
import type { OrderDetails } from "./OrderDetailsStep";
import OrderDetailsStep from "./OrderDetailsStep";
import toast from "react-hot-toast";
import axios from "axios";

const steps = [
    {
        number: 1,
        title: "Customer",
        description: "Select customer",
        icon: FiUser,
    },
    {
        number: 2,
        title: "Products",
        description: "Add products",
        icon: FiPackage,
    },
    {
        number: 3,
        title: "Details",
        description: "Order details",
        icon: FiFileText,
    },
    {
        number: 4,
        title: "Preview",
        description: "Review order",
        icon: FiEye,
    },
];

type Customer = NonNullable<
    ComponentProps<typeof CustomerStep>["selectedCustomer"]
>;

const CreateOrder = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [isWalkInCustomer, setIsWalkInCustomer] = useState(true);

    const [selectedProducts, setSelectedProducts] =
        useState<SelectedProduct[]>([]);

    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        discountAmount: 0,
        paymentStatus: "PENDING",
        paymentMethod: null,
    });

    const [creatingOrder, setCreatingOrder] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<any>(null);

    const handleNext = () => {
        if (currentStep === 2 && selectedProducts.length === 0) {
            return;
        }

        if (currentStep < steps.length) {
            setCurrentStep((previous) => previous + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((previous) => previous - 1);
        }
    };

    const handleCreateOrder = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Please add at least one product");
            return;
        }

        if (!isWalkInCustomer && !selectedCustomer) {
            toast.error("Please select a customer");
            return;
        }

        try {
            setCreatingOrder(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const subtotal = selectedProducts.reduce(
                (sum, product) => sum + Number(product.lineTotal || 0),
                0
            );

            const discountAmount = Number(
                orderDetails.discountAmount || 0
            );

            const totalAmount = Math.max(
                subtotal - discountAmount,
                0
            );

            const payload = {
                customerId: isWalkInCustomer
                    ? null
                    : selectedCustomer?.id ?? null,

                status: "PENDING",

                paymentStatus:
                    orderDetails.paymentStatus,

                paymentMethod:
                    orderDetails.paymentMethod,

                subtotal,

                discountAmount,

                totalAmount,

                items: selectedProducts.map((product) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    sellingPrice: product.sellingPrice,
                })),
            };

            console.log("CREATE ORDER PAYLOAD:", payload);

            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/order",
                payload,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            console.log(
                "ORDER CREATED:",
                response.data
            );

            const newOrder =
                response.data?.data ??
                response.data?.order ??
                response.data;

            setCreatedOrder(newOrder);

            toast.success(
                "Order created successfully!"
            );
            navigate("/admin/orders");

        } catch (error: any) {
            console.error(
                "CREATE ORDER ERROR:",
                error
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.error ??
                error.response?.data?.message ??
                "Failed to create order"
            );
        } finally {
            setCreatingOrder(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            px={{ base: 4, md: 6, lg: 8 }}
            py={6}
        >
            <Box maxW="1200px" mx="auto">
                {/* Header */}
                <Flex
                    justify="space-between"
                    align={{
                        base: "flex-start",
                        md: "center",
                    }}
                    direction={{
                        base: "column",
                        md: "row",
                    }}
                    gap={4}
                    mb={6}
                >
                    <Box>
                        <Button
                            variant="ghost"
                            size="sm"
                            px={0}
                            mb={2}
                            color="gray.600"
                            onClick={() =>
                                navigate(
                                    "/admin/orders"
                                )
                            }
                        >
                            <FiArrowLeft />
                            Back to Orders
                        </Button>

                        <Heading
                            size="lg"
                            color="gray.800"
                        >
                            Create New Order
                        </Heading>

                        <Text
                            mt={1}
                            fontSize="sm"
                            color="gray.500"
                        >
                            Create a customer order
                            step by step.
                        </Text>
                    </Box>
                </Flex>

                {/* Step Indicator */}
                <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={{
                        base: 4,
                        md: 6,
                    }}
                    mb={5}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                    >
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            const isActive =
                                currentStep ===
                                step.number;

                            const isCompleted =
                                currentStep >
                                step.number;

                            return (
                                <Flex
                                    key={step.number}
                                    align="center"
                                    flex={1}
                                >
                                    <Flex
                                        direction="column"
                                        align="center"
                                        minW={{
                                            base: "60px",
                                            md: "110px",
                                        }}
                                    >
                                        <Flex
                                            w={{
                                                base: "36px",
                                                md: "42px",
                                            }}
                                            h={{
                                                base: "36px",
                                                md: "42px",
                                            }}
                                            borderRadius="full"
                                            align="center"
                                            justify="center"
                                            bg={
                                                isActive ||
                                                    isCompleted
                                                    ? "blue.600"
                                                    : "gray.100"
                                            }
                                            color={
                                                isActive ||
                                                    isCompleted
                                                    ? "white"
                                                    : "gray.500"
                                            }
                                            border="2px solid"
                                            borderColor={
                                                isActive ||
                                                    isCompleted
                                                    ? "blue.600"
                                                    : "gray.200"
                                            }
                                        >
                                            {isCompleted ? (
                                                <FiCheck />
                                            ) : (
                                                <Icon />
                                            )}
                                        </Flex>

                                        <Text
                                            mt={2}
                                            fontSize={{
                                                base: "xs",
                                                md: "sm",
                                            }}
                                            fontWeight={
                                                isActive
                                                    ? "700"
                                                    : "500"
                                            }
                                            color={
                                                isActive
                                                    ? "blue.600"
                                                    : "gray.600"
                                            }
                                            textAlign="center"
                                        >
                                            {step.title}
                                        </Text>

                                        <Text
                                            display={{
                                                base: "none",
                                                md: "block",
                                            }}
                                            fontSize="xs"
                                            color="gray.400"
                                            textAlign="center"
                                        >
                                            {
                                                step.description
                                            }
                                        </Text>
                                    </Flex>

                                    {index <
                                        steps.length -
                                        1 && (
                                            <Box
                                                flex={1}
                                                h="2px"
                                                bg={
                                                    currentStep >
                                                        step.number
                                                        ? "blue.600"
                                                        : "gray.200"
                                                }
                                                mx={{
                                                    base: 1,
                                                    md: 3,
                                                }}
                                            />
                                        )}
                                </Flex>
                            );
                        })}
                    </Flex>
                </Box>

                {/* Current Step Content */}
                <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    minH="420px"
                    p={{
                        base: 5,
                        md: 7,
                    }}
                >
                    {currentStep === 1 && (

                        <CustomerStep
                            selectedCustomer={selectedCustomer}
                            isWalkInCustomer={isWalkInCustomer}
                            onSelectCustomer={(customer) => {
                                setSelectedCustomer(customer);
                                setIsWalkInCustomer(false);
                            }}
                            onWalkInCustomer={() => {
                                setSelectedCustomer(null);
                                setIsWalkInCustomer(true);
                            }}
                        />
                    )}

                    {currentStep === 2 && (
                        <ProductStep
                            selectedProducts={selectedProducts}
                            onProductsChange={setSelectedProducts}

                        />
                    )}


                    {currentStep === 3 && (
                        <OrderDetailsStep
                            customer={selectedCustomer}
                            isWalkInCustomer={isWalkInCustomer}
                            selectedProducts={selectedProducts}
                            orderDetails={orderDetails}
                            onOrderDetailsChange={setOrderDetails}
                        />
                    )}

                    {currentStep === 4 && (
                        <OrderPreview
                            customer={selectedCustomer}
                            isWalkInCustomer={isWalkInCustomer}
                            selectedProducts={selectedProducts}
                            orderDetails={orderDetails}
                            onCreateOrder={handleCreateOrder}
                            creatingOrder={creatingOrder}
                        />
                    )}
                </Box>

                {/* Navigation */}
                <Flex
                    justify="space-between"
                    align="center"
                    mt={5}
                >
                    <Button
                        variant="outline"
                        bg="white"
                        disabled={currentStep === 1}
                        onClick={handleBack}
                    >
                        <FiArrowLeft />
                        Back
                    </Button>

                    {currentStep < 4 ? (
                        <Button
                            colorPalette="blue"
                            onClick={handleNext}
                        >
                            Next
                            <FiArrowRight />
                        </Button>
                    ) : (
                        <Button
                            colorPalette="blue"
                            size="lg"
                            onClick={handleCreateOrder}
                            loading={creatingOrder}
                            loadingText="Creating Order..."
                        >
                            Create Order
                        </Button>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default CreateOrder;