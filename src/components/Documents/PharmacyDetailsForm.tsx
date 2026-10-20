
import {
  Box,
  Field,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import type {
  PharmacyDocumentSettings,
} from "../../pdf/utils/document.types";

interface PharmacyDetailsFormProps {
  settings: PharmacyDocumentSettings;
  onChange: <K extends keyof PharmacyDocumentSettings>(
    key: K,
    value: PharmacyDocumentSettings[K]
  ) => void;
}

export default function PharmacyDetailsForm({
  settings,
  onChange,
}: PharmacyDetailsFormProps) {
  return (
    <Stack gap={4}>
      <Text fontSize="lg" fontWeight="bold">
        Pharmacy Details
      </Text>

      <Field.Root>
        <Field.Label>Address</Field.Label>
        <Textarea
          value={settings.address}
          onChange={(e) =>
            onChange("address", e.target.value)
          }
          placeholder="Enter pharmacy address"
          rows={2}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Telephone Number</Field.Label>
        <Input
          value={settings.phone}
          onChange={(e) =>
            onChange("phone", e.target.value)
          }
          placeholder="Enter telephone number"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Email Address</Field.Label>
        <Input
          type="email"
          value={settings.email}
          onChange={(e) =>
            onChange("email", e.target.value)
          }
          placeholder="Enter email address"
        />
      </Field.Root>

      <Box
        bg="blue.50"
        color="blue.800"
        p={3}
        borderRadius="md"
      >
        <Text fontSize="sm">
          Changes are saved in this browser automatically.
        </Text>
      </Box>
    </Stack>
  );
}
