import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function TestPage () {

    const [count, setCount] = useState(0);
    
    return (
        <>
        <Box width="auto" gap="5" height="100vh" bg="red.500" display="flex" justifyContent="center" alignItems="center" shadow="lg, yellow.500">
            <Box width="100px" fontWeight="semibold" textStyle="2xl" height="50px" bg="blue.500" color="white" display="flex" justifyContent="center" alignItems="center" shadow="lg, yellow.500" onClick={() => setCount(count - 1)}>
                -
            </Box>
            <Box width="100px" fontWeight="semibold" textStyle="2xl" height="50px" bg="blue.500" color="white" display="flex" justifyContent="center" alignItems="center" shadow="lg, yellow.500">
                {count}
            </Box>
            <Box width="100px" borderRadius={""} fontWeight="semibold" textStyle="2xl" height="50px" bg="blue.500" color="white" display="flex" justifyContent="center" alignItems="center" shadow="lg, yellow.500" onClick={() => setCount(count + 1)}>
                +
            </Box>
        </Box>
        </>
    )
}