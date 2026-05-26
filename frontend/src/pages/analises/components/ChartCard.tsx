import { Box, Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  action?: ReactNode
  children: ReactNode
}

export default function ChartCard({ title, subtitle, action, children }: Props) {
  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={5} minH="280px">
      <Flex justify="space-between" align="start" mb={5} gap={3}>
        <Box>
          <Text fontSize="md" fontWeight="800" color="gray.800">{title}</Text>
          <Text fontSize="xs" color="gray.400">{subtitle}</Text>
        </Box>
        {action}
      </Flex>
      {children}
    </Box>
  )
}
