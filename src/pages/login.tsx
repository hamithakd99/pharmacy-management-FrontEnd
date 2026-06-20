import { Box, Button, HStack, Input, VStack} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            const response =  await axios.post(import.meta.env.VITE_BACKEND_URL+"/user/login" , {
                email : email,
                password : password
            })
            toast.success("Login successful");
            localStorage.setItem("token", response.data.token);
            console.log(response.data);
            console.log(response.data.role);
            if(response.data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

            
        } catch (e) {
            toast.error("Login failed");
            console.log(e);
        }
    }

    return (
        <Box h="100vh" bgImage="url('/login.jpg')" bgSize={"cover"} bgPos="center" bgRepeat={"no-repeat"}>
            <HStack h="full" w="full" gap={0}>
                <Box w="50%" h="full"></Box>
                <Box w="50%" h="full" display="flex" justifyContent="center" alignItems="center" boxShadow="xl" shadow="lg, black">
                    <Box w="400px" h="400px" bg="whiteAlpha.200" backdropFilter="blur(10px)" borderRadius="xl" p={8}>
                        <Box textAlign="center" fontSize="3xl" fontWeight="bold" mb={-3}>
                            Welcome
                        </Box>
                        <VStack gap="8" h="full" justifyContent="center">
                            <Input 
                            _placeholder={{ color: "inherit" }} 
                            variant="outline" 
                            placeholder="Username"
                            value={email}
                            onChange={(e)=> {
                                setEmail(e.target.value)
                                
                            }} />

                            <Input 
                            _placeholder={{ color: "inherit" }} 
                            variant="outline" 
                            placeholder="Password" 
                            type="password"
                            value={password}
                            onChange={(e)=> {
                                setPassword(e.target.value)
                            }} />

                            <Button width="100%" onClick={handleLogin}>
                                Login
                            </Button>
                        </VStack>
                    </Box>
                </Box>
            </HStack>
        </Box>
    );
}

export default Login;