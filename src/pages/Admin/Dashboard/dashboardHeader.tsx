
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
  if (hour >= 5 && hour < 12) return "Good morning";
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
    <Flex
      justify="space-between"
      align="center"
      gap="4"
      flexWrap="wrap"
      w="100%"
    >
      {/* LEFT SIDE */}
      <Box flex="1" minW={{ base: "100%", lg: "280px" }}>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          color="gray.800"
          mb="3"
        >
          {greeting}, {firstName || fullName}!
        </Text>

        <InputGroup startElement={<LuSearch />}>
          <Input
            placeholder="Search products by name, barcode or Product ID..."
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            _focus={{
              borderColor: "teal.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
            }}
          />
        </InputGroup>
      </Box>

      {/* RIGHT SIDE */}
      <Flex
        gap="3"
        align="center"
        flexWrap="wrap"
        justify={{ base: "space-between", lg: "flex-end" }}
        w={{ base: "100%", lg: "auto" }}
      >
        <Button
          colorPalette="teal"
          onClick={() => navigate("/admin/orders/create")}
        >
          <MdAdd />
          Create Bill
        </Button>

        <Box
          bg="white"
          px="3"
          py="2"
          rounded="lg"
          border="1px solid"
          borderColor="gray.200"
          flexShrink={0}
        >
          <Text fontSize="xs" color="gray.500">
            {date}
          </Text>

          <Text fontWeight="bold" fontSize="sm">
            {time}
          </Text>
        </Box>

        <IconButton
          aria-label="Notifications"
          variant="outline"
          bg="white"
          color="gray.700"
        >
          <MdNotificationsNone />
        </IconButton>

        <HStack
          bg="white"
          p="2"
          rounded="xl"
          border="1px solid"
          borderColor="gray.200"
          gap="3"
          minW="0"
        >
          <Avatar.Root colorPalette="teal" size="md">
            <Avatar.Fallback name={fullName}>
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>

          <VStack align="start" gap="0" minW="0">
            <Text
              fontWeight="bold"
              fontSize="sm"
              color="gray.800"
              maxW="150px"
              truncate
            >
              {fullName}
            </Text>

            <Text fontSize="xs" color="gray.500">
              {role}
            </Text>
          </VStack>
        </HStack>
      </Flex>
    </Flex>
  );
}
