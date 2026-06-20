import {
  Box,
  Button,
  HStack,
  Input,
  VStack,
  Text,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExternalUserRegister = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        nickName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        province: "",
        postalCode: "",
        role: "CUSTOMER"
    });
    
    const navigate = useNavigate();

    // Create collections for Select components
    const provinceCollection = createListCollection({
        items: [
            { label: "Western", value: "Western" },
            { label: "Central", value: "Central" },
            { label: "Southern", value: "Southern" },
            { label: "Northern", value: "Northern" },
            { label: "Eastern", value: "Eastern" },
            { label: "North Western", value: "North Western" },
            { label: "North Central", value: "North Central" },
            { label: "Uva", value: "Uva" },
            { label: "Sabaragamuwa", value: "Sabaragamuwa" },
        ],
    });

    const roleCollection = createListCollection({
        items: [
            { label: "Customer", value: "CUSTOMER" },
            { label: "Supplier", value: "SUPPLIER" },
        ],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleRegister() {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/external-user/register",
                formData
            );
            
            toast.success("Registration successful!");
            console.log(response.data);
            
            // Navigate to external user dashboard or login
            navigate("/external/dashboard");
            
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Registration failed");
            console.log(e);
        }
    }

    return (
        <Box 
            h="100vh" 
            w="100vw"
            bgImage="url('/login.jpg')" 
            bgSize="cover" 
            bgPos="center" 
            bgRepeat="no-repeat"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Box 
                w="100%"
                maxW="550px"
                h="auto"
                maxH="98vh"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={8}
                boxShadow="xl"
                display="flex"
                flexDirection="column"
            >
                <Box textAlign="center" fontSize="3xl" fontWeight="bold" mb={1}>
                    Register
                </Box>
                <Box textAlign="center" fontSize="sm" color="whiteAlpha.700" mb={3}>
                    Create your account as a Customer or Supplier
                </Box>
                
                <VStack gap="3" flex="1" overflow="hidden">
                    <HStack w="full" gap={3}>
                        <Input 
                            _placeholder={{ color: "whiteAlpha.800" }} 
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            _hover={{ borderColor: "whiteAlpha.500" }}
                            _focus={{ borderColor: "blue.300" }}
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            color="white"
                            size="sm"
                            height="40px"
                        />
                        <Input 
                            _placeholder={{ color: "whiteAlpha.800" }} 
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            _hover={{ borderColor: "whiteAlpha.500" }}
                            _focus={{ borderColor: "blue.300" }}
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            color="white"
                            size="sm"
                            height="40px"
                        />
                    </HStack>

                    <Input 
                        _placeholder={{ color: "whiteAlpha.800" }} 
                        variant="outline"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "whiteAlpha.500" }}
                        _focus={{ borderColor: "blue.300" }}
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        color="white"
                        size="sm"
                        height="40px"
                    />

                    <Input 
                        _placeholder={{ color: "whiteAlpha.800" }} 
                        variant="outline"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "whiteAlpha.500" }}
                        _focus={{ borderColor: "blue.300" }}
                        placeholder="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        color="white"
                        size="sm"
                        height="40px"
                    />

                    <HStack w="full" gap={3}>
                        <Input 
                            _placeholder={{ color: "whiteAlpha.800" }} 
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            _hover={{ borderColor: "whiteAlpha.500" }}
                            _focus={{ borderColor: "blue.300" }}
                            placeholder="Nick Name (Optional)"
                            name="nickName"
                            value={formData.nickName}
                            onChange={handleChange}
                            color="white"
                            size="sm"
                            height="40px"
                            flex="1"
                        />
                        
                        {/* Role Select */}
                        <Select.Root
                            collection={roleCollection}
                            size="sm"
                            width="full"
                            value={formData.role ? [formData.role] : []}
                            onValueChange={(e) => handleSelectChange("role", e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger
                                    borderColor="whiteAlpha.300"
                                    _hover={{ borderColor: "whiteAlpha.500" }}
                                    _focus={{ borderColor: "blue.300" }}
                                    color="white"
                                    height="40px"
                                >
                                    <Select.ValueText 
                                        placeholder="Role"
                                        color={formData.role ? "white" : "whiteAlpha.600"}
                                    />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator color="whiteAlpha.800" />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="whiteAlpha.200" backdropFilter="blur(10px)">
                                        {roleCollection.items.map((item) => (
                                            <Select.Item 
                                                item={item} 
                                                key={item.value}
                                                _hover={{ bg: "whiteAlpha.300" }}
                                                _selected={{ bg: "blue.500" }}
                                                color="white"
                                            >
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </HStack>

                    <Input 
                        _placeholder={{ color: "whiteAlpha.800" }} 
                        variant="outline"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "whiteAlpha.500" }}
                        _focus={{ borderColor: "blue.300" }}
                        placeholder="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        color="white"
                        size="sm"
                        height="40px"
                    />

                    <Input 
                        _placeholder={{ color: "whiteAlpha.800" }} 
                        variant="outline"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "whiteAlpha.500" }}
                        _focus={{ borderColor: "blue.300" }}
                        placeholder="Address Line 2 (Optional)"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        color="white"
                        size="sm"
                        height="40px"
                    />

                    <HStack w="full" gap={3}>
                        <Input 
                            _placeholder={{ color: "whiteAlpha.800" }} 
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            _hover={{ borderColor: "whiteAlpha.500" }}
                            _focus={{ borderColor: "blue.300" }}
                            placeholder="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            color="white"
                            size="sm"
                            height="40px"
                            flex="1"
                        />
                        
                        {/* Province Select */}
                        <Select.Root
                            collection={provinceCollection}
                            size="sm"
                            width="full"
                            value={formData.province ? [formData.province] : []}
                            onValueChange={(e) => handleSelectChange("province", e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger
                                    borderColor="whiteAlpha.300"
                                    _hover={{ borderColor: "whiteAlpha.500" }}
                                    _focus={{ borderColor: "blue.300" }}
                                    color="white"
                                    height="40px"
                                >
                                    <Select.ValueText 
                                        placeholder="Province" 
                                        color={formData.province ? "white" : "whiteAlpha.600"}
                                    />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator color="whiteAlpha.800" />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="whiteAlpha.200" backdropFilter="blur(10px)">
                                        {provinceCollection.items.map((item) => (
                                            <Select.Item 
                                                item={item} 
                                                key={item.value}
                                                _hover={{ bg: "whiteAlpha.300" }}
                                                _selected={{ bg: "blue.500" }}
                                                color="white"
                                            >
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </HStack>

                    <Input 
                        _placeholder={{ color: "whiteAlpha.800" }} 
                        variant="outline"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "whiteAlpha.500" }}
                        _focus={{ borderColor: "blue.300" }}
                        placeholder="Postal Code (Optional)"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        color="white"
                        size="sm"
                        height="40px"
                    />

                    <Button 
                        width="100%" 
                        onClick={handleRegister} 
                        colorScheme="blue"
                        size="md"
                        mt={1}
                        height="40px"
                    >
                        Register
                    </Button>
                    
                    {/* <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
                        Already have an account?{" "}
                        <Text 
                            as="span" 
                            color="blue.300" 
                            cursor="pointer" 
                            onClick={() => navigate("/login")}
                            _hover={{ color: "blue.200", textDecoration: "underline" }}
                        >
                            Login
                        </Text>
                    </Text> */}
                </VStack>
            </Box>
        </Box>
    );
}

export default ExternalUserRegister;