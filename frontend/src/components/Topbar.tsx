import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  Divider,
} from '@chakra-ui/react'
import {
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiSettings,
  FiLogOut,
  FiAlertTriangle,
  FiClock,
  FiInfo,
  FiCheckCircle,
  FiCheck,
} from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotificacoes, type TipoNotificacao } from '../contexts/NotificacoesContext'

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/analises': 'Análises',
  '/alunos': 'Alunos',
  '/modalidades': 'Modalidades',
  '/turmas': 'Turmas',
  '/mensalidades': 'Mensalidades',
  '/funcionarios': 'Funcionários',
  '/presencas': 'Presenças',
  '/mensagens': 'Mensagens',
  '/notificacoes': 'Notificações',
  '/perfil': 'Meu Perfil',
  '/configuracoes': 'Configurações',
}

const tipoIcon: Record<TipoNotificacao, { icon: React.ElementType; color: string; bg: string }> = {
  atraso: { icon: FiAlertTriangle, color: 'red.500', bg: 'red.50' },
  vencimento: { icon: FiClock, color: 'yellow.600', bg: 'yellow.50' },
  info: { icon: FiInfo, color: 'brand.500', bg: 'brand.50' },
}

export default function TopBar() {
  const { user, signOut } = useAuth()
  const { notificacoes, unreadCount, lidasIds, markAsRead, markAllAsRead } = useNotificacoes()
  const location = useLocation()
  const navigate = useNavigate()

  const pageTitle = routeLabels[location.pathname] ?? 'Painel'
  const userName = user?.nome ?? user?.email ?? 'Usuário'

  return (
    <Flex
      as="header"
      h="64px"
      px={{ base: 4, md: 6 }}
      bg="#0d1b2a"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      align="center"
      justify="space-between"
      position="sticky"
      top={0}
      zIndex={10}
    >
      {/* Left — Page title */}
      <Box>
        <Text fontSize="xs" color="whiteAlpha.500" fontWeight="500" textTransform="uppercase" letterSpacing="wider">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
        <Text fontSize="lg" fontWeight="700" color="white" lineHeight="1.2">
          {pageTitle}
        </Text>
      </Box>

      {/* Right — Actions */}
      <HStack spacing={2}>
        {/* Notifications */}
        <Popover placement="bottom-end" isLazy>
          <PopoverTrigger>
            <Box position="relative" cursor="pointer">
              <IconButton
                aria-label="Notificações"
                icon={<FiBell />}
                variant="ghost"
                rounded="xl"
                color="whiteAlpha.700"
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
              />
              <Badge
                position="absolute"
                top="6px"
                right="6px"
                display={unreadCount > 0 ? 'flex' : 'none'}
                alignItems="center"
                justifyContent="center"
                minW="16px"
                h="16px"
                bg="red.500"
                color="white"
                rounded="full"
                fontSize="9px"
                fontWeight="700"
                border="2px solid #0d1b2a"
                p={0}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            </Box>
          </PopoverTrigger>

          <PopoverContent
            w="380px"
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor="gray.100"
            _focus={{ outline: 'none' }}
          >
            <PopoverBody p={0}>
              {/* Header */}
              <Flex px={4} py={3} align="center" justify="space-between" borderBottom="1px solid" borderColor="gray.100">
                <HStack spacing={2}>
                  <Text fontSize="sm" fontWeight="700" color="gray.800">Notificações</Text>
                  {unreadCount > 0 && (
                    <Badge colorScheme="red" rounded="full" fontSize="xs" px={1.5}>{unreadCount}</Badge>
                  )}
                </HStack>
                {unreadCount > 0 && (
                  <Button size="xs" variant="ghost" colorScheme="brand" leftIcon={<FiCheck />} rounded="lg" onClick={markAllAsRead}>
                    Marcar todas
                  </Button>
                )}
              </Flex>

              {/* Preview list */}
              {notificacoes.length === 0 ? (
                <Flex direction="column" align="center" py={8} px={4}>
                  <Flex w={12} h={12} rounded="xl" bg="gray.50" align="center" justify="center" mb={2}>
                    <Icon as={FiCheckCircle} boxSize={5} color="gray.300" />
                  </Flex>
                  <Text fontSize="sm" fontWeight="600" color="gray.400">Nenhuma notificação</Text>
                  <Text fontSize="xs" color="gray.300" mt={0.5}>Tudo em dia!</Text>
                </Flex>
              ) : (
                <VStack spacing={0} maxH="340px" overflowY="auto" divider={<Divider borderColor="gray.50" />}>
                  {notificacoes.slice(0, 6).map(n => {
                    const cfg = tipoIcon[n.tipo]
                    const isRead = lidasIds.has(n.id)
                    return (
                      <Flex
                        key={n.id}
                        w="full"
                        px={4}
                        py={3}
                        gap={3}
                        align="center"
                        bg={isRead ? 'transparent' : 'brand.50'}
                        _hover={{ bg: isRead ? 'gray.50' : 'blue.50' }}
                        transition="background 0.15s"
                        cursor="pointer"
                        onClick={() => {
                          markAsRead(n.id)
                          navigate('/notificacoes')
                        }}
                      >
                        {/* Icon */}
                        <Flex w={8} h={8} rounded="lg" bg={cfg.bg} align="center" justify="center" flexShrink={0}>
                          <Icon as={cfg.icon} boxSize={3.5} color={cfg.color} />
                        </Flex>

                        {/* Text */}
                        <Box flex={1} minW={0}>
                          <Text fontSize="xs" fontWeight={isRead ? '500' : '700'} color={isRead ? 'gray.600' : 'gray.800'} noOfLines={1}>
                            {n.titulo}
                          </Text>
                          <Text fontSize="xs" color="gray.400" noOfLines={1}>
                            {n.alunoNome} • {n.detalhe}
                          </Text>
                        </Box>

                        {/* Unread dot */}
                        {!isRead && (
                          <Box w="7px" h="7px" rounded="full" bg="brand.500" flexShrink={0} />
                        )}
                      </Flex>
                    )
                  })}
                </VStack>
              )}

              {/* Footer */}
              {notificacoes.length > 0 && (
                <Flex px={4} py={2.5} borderTop="1px solid" borderColor="gray.100" justify="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="brand"
                    rounded="lg"
                    rightIcon={<FiChevronRight />}
                    onClick={() => navigate('/notificacoes')}
                    w="full"
                  >
                    Ver todas as notificações
                  </Button>
                </Flex>
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <Menu>
          <MenuButton
            as={Flex}
            align="center"
            gap={2}
            px={3}
            py={2}
            rounded="xl"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            <Avatar
              size="sm"
              name={userName}
              bg="brand.500"
              color="white"
              fontWeight="600"
            />
            <Box display={{ base: 'none', md: 'block' }} textAlign="left">
              <Text fontSize="sm" fontWeight="600" color="white" lineHeight="1.2">
                {userName.split(' ')[0]}
              </Text>
              <Text fontSize="xs" color="whiteAlpha.500" lineHeight="1.2">
                Administrador
              </Text>
            </Box>
            <Icon as={FiChevronDown} boxSize={4} color="whiteAlpha.500" display={{ base: 'none', md: 'block' }} />
          </MenuButton>

          <MenuList shadow="xl" border="1px solid" borderColor="gray.100" rounded="xl" py={2} minW="180px">
            <Box px={4} py={2} mb={1}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">{userName.split(' ')[0]}</Text>
              <Text fontSize="xs" color="gray.400">{user?.email}</Text>
            </Box>
            <MenuDivider />
            <MenuItem
              icon={<Icon as={FiUser} />}
              fontSize="sm"
              color="gray.600"
              _hover={{ bg: 'gray.50' }}
              onClick={() => navigate('/perfil')}
            >
              Meu perfil
            </MenuItem>
            <MenuItem
              icon={<Icon as={FiSettings} />}
              fontSize="sm"
              color="gray.600"
              _hover={{ bg: 'gray.50' }}
              onClick={() => navigate('/configuracoes')}
            >
              Configurações
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<Icon as={FiLogOut} />}
              fontSize="sm"
              color="red.500"
              _hover={{ bg: 'red.50' }}
              onClick={signOut}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  )
}
