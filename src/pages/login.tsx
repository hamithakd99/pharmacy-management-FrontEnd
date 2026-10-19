import api from "@/api/axios";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    FiArrowRight,
    FiLock,
    FiMail,
    FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const COLORS = {
    navy: "#073B4C",
    green: "#15966A",
    mint: "#EAF5F2",
    white: "#FFFFFF",
    muted: "#64748B",
};

const MotionBox = motion.create(Box);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

    async function handleLogin() {
        if (!email.trim() || !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/user/login", {
                email: email.trim(),
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success("Welcome back!");

            if (response.data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/admin/dashboard");
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Flex
            w="100%"
            h="100dvh"
            minH="0"
            overflow="hidden"
            bg={COLORS.mint}
            align="center"
            justify="center"
            p={{ base: "0", md: "4" }}
        >
            <Flex
                w="full"
                maxW="1200px"
                h={{ base: "100%", md: "min(760px, calc(100dvh - 32px))" }}
                minH="0"
                bg="white"
                rounded={{ base: "none", md: "3xl" }}
                overflow="hidden"
                boxShadow={{ base: "none", md: "2xl" }}
                direction={{ base: "column", md: "row" }}
            >
                {/* Brand Panel */}
                <Flex
                    flex={{ base: "0 0 38%", md: "1" }}
                    minH="0"
                    minW="0"
                    bg={COLORS.navy}
                    color="white"
                    direction="column"
                    justify="space-between"
                    align="center"
                    p={{ base: "4", sm: "5", md: "8", lg: "10" }}
                    position="relative"
                    overflow="hidden"
                >
                    {/* Decorative background glow */}
                    <Box
                        position="absolute"
                        w="300px"
                        h="300px"
                        rounded="full"
                        bg={COLORS.green}
                        opacity="0.14"
                        filter="blur(35px)"
                        top="-140px"
                        right="-110px"
                        pointerEvents="none"
                    />

                    <Box
                        position="absolute"
                        w="240px"
                        h="240px"
                        rounded="full"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        bottom="-120px"
                        left="-100px"
                        pointerEvents="none"
                    />

                    {/* Brand label */}
                    <HStack
                        gap="2"
                        w="full"
                        justify="center"
                        position="relative"
                        zIndex="1"
                    >
                        <Box
                            w="8px"
                            h="8px"
                            rounded="full"
                            bg="#45D6A0"
                            flexShrink="0"
                        />
                        <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            letterSpacing="1.5px"
                            color="whiteAlpha.800"
                            textAlign="center"
                        >
                            PHARMACY MANAGEMENT
                        </Text>
                    </HStack>

                    {/* Centered logo and brand message */}
                    <VStack
                        align="center"
                        justify="center"
                        gap={{ base: "3", md: "5" }}
                        py="3"
                        w="full"
                        position="relative"
                        zIndex="1"
                        flex="1"
                    >
                        {/* Transparent logo with white glow */}
                        <Box
                            w="full"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                            overflow="visible"
                        >
                            {/* Glow behind logo */}
                            <Box
                                position="absolute"
                                w={{ base: "180px", sm: "230px", md: "300px" }}
                                h={{ base: "100px", sm: "130px", md: "160px" }}
                                rounded="full"
                                bg="white"
                                opacity="0.18"
                                filter="blur(45px)"
                                pointerEvents="none"
                            />

                            <MotionBox
                                w="full"
                                maxW={{
                                    base: "260px",
                                    sm: "340px",
                                    md: "440px",
                                }}
                                position="relative"
                                animate={
                                    prefersReducedMotion
                                        ? undefined
                                        : { y: [0, -8, 0] }
                                }
                                transition={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              duration: 3.2,
                                              ease: "easeInOut",
                                              repeat: Infinity,
                                          }
                                }
                            >
                                <img
                                    src="/logo.png"
                                    alt="Sethro Pharmacy Logo"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "clamp(100px, 28dvh, 280px)",
                                        objectFit: "contain",
                                        filter:
                                            "drop-shadow(0 0 10px rgba(255,255,255,0.30)) drop-shadow(0 0 28px rgba(255,255,255,0.15))",
                                    }}
                                />
                            </MotionBox>
                        </Box>

                        {/* Brand message */}
                        <Box
                            textAlign="center"
                            maxW="380px"
                            px="2"
                        >
                            <Heading
                                fontSize={{
                                    base: "xl",
                                    md: "2xl",
                                    lg: "3xl",
                                }}
                                lineHeight="1.25"
                                color="white"
                            >
                                Your pharmacy,
                                <br />
                                managed smarter.
                            </Heading>

                            <Text
                                mt="3"
                                fontSize={{ base: "xs", md: "sm" }}
                                lineHeight="1.8"
                                color="whiteAlpha.800"
                            >
                                Manage products, monitor inventory and
                                streamline your pharmacy operations in
                                one secure workspace.
                            </Text>
                        </Box>
                    </VStack>

                    {/* Security note */}
                    <HStack
                        gap="2"
                        w="full"
                        justify="center"
                        position="relative"
                        zIndex="1"
                    >
                        <FiShield />
                        <Text
                            fontSize="xs"
                            color="whiteAlpha.700"
                            textAlign="center"
                        >
                            Secure access for authorized users
                        </Text>
                    </HStack>
                </Flex>

                {/* Login Panel */}
                <Flex
                    flex="1"
                    minW="0"
                    minH="0"
                    align="center"
                    justify="center"
                    p={{
                        base: "5",
                        sm: "6",
                        md: "8",
                        lg: "12",
                    }}
                    bg={COLORS.white}
                    overflowY="auto"
                >
                    <VStack
                        align="stretch"
                        w="full"
                        maxW="400px"
                        gap={{ base: "4", md: "6" }}
                        flexShrink="0"
                    >
                        {/* Heading */}
                        <Box>
                            <Text
                                color={COLORS.green}
                                fontSize="xs"
                                fontWeight="bold"
                                letterSpacing="2px"
                                mb="2"
                            >
                                WELCOME BACK
                            </Text>

                            <Heading
                                fontSize={{ base: "3xl", md: "4xl" }}
                                color={COLORS.navy}
                                letterSpacing="-1px"
                            >
                                Sign in
                            </Heading>

                            <Text
                                mt="2"
                                color={COLORS.muted}
                                fontSize="sm"
                                lineHeight="1.7"
                            >
                                Enter your credentials to access your
                                pharmacy dashboard.
                            </Text>
                        </Box>

                        {/* Login form */}
                        <VStack
                            as="form"
                            align="stretch"
                            gap="4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleLogin();
                            }}
                        >
                            {/* Email */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color={COLORS.navy}
                                    mb="2"
                                >
                                    Email address
                                </Text>

                                <HStack
                                    border="1px solid"
                                    borderColor="gray.200"
                                    rounded="xl"
                                    px="3"
                                    h="50px"
                                    gap="3"
                                    transition="border-color 0.2s"
                                    _focusWithin={{
                                        borderColor: COLORS.green,
                                        boxShadow: `0 0 0 1px ${COLORS.green}`,
                                    }}
                                >
                                    <Box color={COLORS.green}>
                                        <FiMail size={18} />
                                    </Box>

                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        border="none"
                                        boxShadow="none"
                                        px="0"
                                        h="full"
                                        fontSize="sm"
                                        _focus={{
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                    />
                                </HStack>
                            </Box>

                            {/* Password */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color={COLORS.navy}
                                    mb="2"
                                >
                                    Password
                                </Text>

                                <HStack
                                    border="1px solid"
                                    borderColor="gray.200"
                                    rounded="xl"
                                    px="3"
                                    h="50px"
                                    gap="3"
                                    transition="border-color 0.2s"
                                    _focusWithin={{
                                        borderColor: COLORS.green,
                                        boxShadow: `0 0 0 1px ${COLORS.green}`,
                                    }}
                                >
                                    <Box color={COLORS.green}>
                                        <FiLock size={18} />
                                    </Box>

                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                        border="none"
                                        boxShadow="none"
                                        px="0"
                                        h="full"
                                        fontSize="sm"
                                        _focus={{
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                    />
                                </HStack>
                            </Box>

                            {/* Submit button */}
                            <Button
                                type="submit"
                                w="full"
                                h="52px"
                                mt="2"
                                bg={COLORS.green}
                                color="white"
                                rounded="xl"
                                fontSize="sm"
                                fontWeight="bold"
                                loading={loading}
                                loadingText="Signing in..."
                                _hover={{
                                    bg: "#117B58",
                                    transform: "translateY(-1px)",
                                    boxShadow: "lg",
                                }}
                                _active={{
                                    transform: "translateY(0)",
                                }}
                                transition="all 0.2s"
                            >
                                <HStack gap="2">
                                    <Text>Sign in to dashboard</Text>
                                    <FiArrowRight />
                                </HStack>
                            </Button>
                        </VStack>

                        {/* Security information */}
                        <HStack
                            align="start"
                            gap="3"
                            bg={COLORS.mint}
                            p="3"
                            rounded="xl"
                        >
                            <Box color={COLORS.green} mt="1">
                                <FiShield size={18} />
                            </Box>

                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color={COLORS.navy}
                                >
                                    Secure login
                                </Text>

                                <Text
                                    fontSize="xs"
                                    color={COLORS.muted}
                                    mt="1"
                                    lineHeight="1.6"
                                >
                                    This system is restricted to
                                    authorized pharmacy personnel.
                                </Text>
                            </Box>
                        </HStack>

                        {/* Footer */}
                        <Text
                            textAlign="center"
                            color={COLORS.muted}
                            fontSize="xs"
                        >
                            © {new Date().getFullYear()} Sethro Pharmacy
                        </Text>
                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    );
}