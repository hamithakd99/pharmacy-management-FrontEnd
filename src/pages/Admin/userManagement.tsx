import { HStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const userManagement = () => {

    return (
        <>
        <HStack>
            <h1>User Management</h1>
        </HStack>
        <HStack>
            <h1>Users</h1>
            <Link to="/admin/register/newuser"><p>create user</p></Link>
            
        </HStack>

        </>
    )
}

export default userManagement