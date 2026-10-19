
import {
  Button,
  Dialog,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutDialog({
  open,
  onClose,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement="center"
      motionPreset="scale"
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="2xl"
            p={2}
            maxW="400px"
            mx={4}
          >
            <Dialog.Header>
              <VStack gap={3} align="center" w="full" pt={4}>
                <VStack
                  align="center"
                  justify="center"
                  bg="red.50"
                  color="red.500"
                  borderRadius="full"
                  boxSize="64px"
                  fontSize="28px"
                >
                  <Text>↪</Text>
                </VStack>

                <Dialog.Title fontSize="xl" fontWeight="bold">
                  Confirm Logout
                </Dialog.Title>
              </VStack>
            </Dialog.Header>

            <Dialog.Body>
              <Text textAlign="center" color="gray.500">
                Are you sure you want to log out of your
                account? You will need to log in again to
                access the system.
              </Text>
            </Dialog.Body>

            <Dialog.Footer gap={3} pt={5} pb={4}>
              <Button
                variant="outline"
                flex="1"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                colorPalette="red"
                flex="1"
                onClick={onConfirm}
              >
                Logout
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
