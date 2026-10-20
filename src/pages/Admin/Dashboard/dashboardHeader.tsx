
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  MdAdd,
  MdNotificationsNone,
} from "react-icons/md";

import { LuSearch } from "react-icons/lu";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoggedInUser {
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  email?: string;
}

const getStoredUser = (): LoggedInUser | null => {
  const storageKeys = [
    "user",
    "currentUser",
    "authUser",
    "loggedInUser",
    "profile",
  ];

  for (const key of storageKeys) {
    try {
      const storedValue = localStorage.getItem(key);

      if (!storedValue) continue;

      const parsed = JSON.parse(storedValue);
      const user = parsed?.user ?? parsed;

      if (
        user &&
        (user.firstName ||
          user.lastName ||
          user.name ||
          user.email)
      ) {
        return user as LoggedInUser;
      }
    } catch {
      // Ignore values that are not JSON user objects.
    }
  }

  // Fallback: read user details from the JWT payload.
  try {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = token.split(".")[1];

      if (payload) {
        const base64 = payload
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const decoded = JSON.parse(
          decodeURIComponent(
            Array.from(atob(base64))
              .map((char) =>
                `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
              )
              .join("")
          )
        );

        if (
          decoded.firstName ||
          decoded.lastName ||
          decoded.name ||
          decoded.email
        ) {
          return decoded as LoggedInUser;
        }
      }
    }
  } catch {
    // The token may not contain readable user details.
  }

  return null;
};

const getGreeting = (hour: number) => {
  if (hour >= 0 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";

  return "Good evening";
};

export default function DashboardHeader() {
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<LoggedInUser | null>(
    () => getStoredUser()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  const firstName = user?.firstName?.trim() || "";

  const lastName = user?.lastName?.trim() || "";

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") ||
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") ||
    "U";

  const role = user?.role
    ? user.role
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
    : "User";

  const date = currentTime.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const greeting = getGreeting(currentTime.getHours());

  return (
    <Box
      w="100%"
      bg="white"
      border="1px solid"
      borderColor="#D9E7E3"
      rounded="2xl"
      p={{ base: "4", md: "5", lg: "6" }}
      boxShadow="0 8px 24px rgba(7, 59, 76, 0.06)"
    >
      <Flex
        justify="space-between"
        align={{ base: "start", lg: "center" }}
        gap="5"
        flexWrap="wrap"
      >
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.12em"
            textTransform="uppercase"
            color="#15966A"
            mb="2"
          >
            Pharmacy overview
          </Text>

          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="800"
            letterSpacing="-0.02em"
            color="#073B4C"
          >
            {greeting}, {firstName || fullName}!
          </Text>

          <Text fontSize="sm" color="#64748B" mt="1">
            Keep track of your pharmacy operations at a glance.
          </Text>
        </Box>

        <Flex
          gap={{ base: "2", md: "3" }}
          align="center"
          flexWrap="wrap"
          w={{ base: "100%", lg: "auto" }}
          justify={{ base: "space-between", lg: "flex-end" }}
        >
          <Box
            bg="#EAF5F2"
            px="3"
            py="2"
            rounded="lg"
            minW="132px"
            border="1px solid"
            borderColor="#C9E5DC"
          >
            <Text fontSize="xs" color="#64748B">
              {date}
            </Text>
            <Text fontWeight="800" fontSize="sm" color="#073B4C">
              {time}
            </Text>
          </Box>

          <IconButton
            aria-label="Notifications"
            variant="outline"
            rounded="lg"
            size="lg"
            bg="white"
            color="#073B4C"
            borderColor="#D9E7E3"
            _hover={{ bg: "#EAF5F2", borderColor: "#15966A" }}
          >
            <MdNotificationsNone />
          </IconButton>

          <HStack
            bg="#F8FBFA"
            px="2"
            py="2"
            rounded="xl"
            border="1px solid"
            borderColor="#D9E7E3"
            gap="3"
            minW="0"
          >
            <Avatar.Root size="md" bg="#073B4C" color="white">
              <Avatar.Fallback name={fullName}>{initials}</Avatar.Fallback>
            </Avatar.Root>

            <VStack align="start" gap="0" minW="0">
              <Text
                fontWeight="700"
                fontSize="sm"
                color="#073B4C"
                maxW={{ base: "120px", md: "150px" }}
                truncate
              >
                {fullName}
              </Text>
              <Text fontSize="xs" color="#64748B">
                {role}
              </Text>
            </VStack>
          </HStack>
        </Flex>
      </Flex>

      <Flex
        mt={{ base: "5", md: "6" }}
        gap="3"
        align="center"
        direction={{ base: "column", sm: "row" }}
      >
        <InputGroup startElement={<LuSearch />} flex="1" w="100%">
          <Input
            placeholder="Search products by name, barcode or Product ID..."
            bg="#F8FBFA"
            color="#073B4C"
            border="1px solid"
            borderColor="#D9E7E3"
            rounded="lg"
            h="11"
            _placeholder={{ color: "#94A3B8" }}
            _focus={{
              borderColor: "#15966A",
              boxShadow: "0 0 0 1px #15966A",
              bg: "white",
            }}
          />
        </InputGroup>

        <Button
          bg="#15966A"
          color="white"
          rounded="lg"
          h="11"
          px="5"
          w={{ base: "100%", sm: "auto" }}
          flexShrink={0}
          onClick={() => {
            const user = JSON.parse(
              localStorage.getItem("user") || "{}"
            );

            if (user.role === "CASHIER") {
              navigate("/cashier/orders/create");
            } else if (user.role === "ADMIN") {
              navigate("/admin/orders/create");
            }
          }}
          _hover={{ bg: "#117B58", transform: "translateY(-1px)" }}
          transition="all 0.2s ease"
        >
          <MdAdd />
          Create Bill
        </Button>
      </Flex>
    </Box>
  );
}
