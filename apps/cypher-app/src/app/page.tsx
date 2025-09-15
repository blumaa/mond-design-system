"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Stack,
  Box,
  Text,
  Badge,
  Heading,
  Input,
  Select,
  Switch,
  Divider,
  Link,
  Avatar,
  Checkbox,
  Spinner,
  Tag,
  Grid,
} from "@mond-design-system/theme";
import { MatrixRain } from "../components/MatrixRain";

// Mock data for cyberpunk interface
const systemStats = {
  cpu: 73.2,
  memory: 45.8,
  network: 892.1,
  security: "ENCRYPTED",
  uptime: "47:23:11",
};

const activeSessions = [
  {
    id: "SX-001",
    user: "admin@cypher.sys",
    location: "Node-7",
    status: "active",
  },
  {
    id: "SX-002",
    user: "dev@localhost",
    location: "Terminal-3",
    status: "idle",
  },
  {
    id: "SX-003",
    user: "root@matrix.net",
    location: "Core-9",
    status: "critical",
  },
];

export default function CypherDashboard() {
  const [currentTime, setCurrentTime] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "UTC",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const startSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <Box
      bg="surface.background"
      p="2xl"
      fontFamily="mono"
      position="relative"
      maxWidth="1280px"
      mx="auto"
    >
      {/* Matrix Rain Background Effect */}
      <MatrixRain opacity={0.08} speed={80} fontSize={12} />
      {/* Terminal Header */}
      <Stack spacing="xl" position="relative" zIndex="1">
        <Stack
          direction="horizontal"
          justify="between"
          align="center"
          borderBottom="1px solid"
          borderColor="brand.interactive.background"
          pb="lg"
        >
          <Stack spacing="xs">
            <Heading
              level={1}
              size="2xl"
              weight="bold"
              color="brand.interactive.background"
              fontFamily="mono"
            >
              CYPHER.SYS v2.1.7
            </Heading>
            <Text variant="body-sm" color="text.accent">
              NEURAL INTERFACE ACTIVE // UTC: {currentTime}
            </Text>
          </Stack>
          <Badge variant="success">SYSTEM ONLINE</Badge>
        </Stack>

        {/* System Monitoring Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="xl">
          {/* System Stats */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              SYSTEM METRICS
            </Text>
            <Stack spacing="sm">
              <Stack direction="horizontal" justify="between">
                <Text color="text.primary">CPU Load:</Text>
                <Text color="text.accent">{systemStats.cpu}%</Text>
              </Stack>
              <Stack direction="horizontal" justify="between">
                <Text color="text.primary">Memory:</Text>
                <Text color="text.accent">{systemStats.memory}%</Text>
              </Stack>
              <Stack direction="horizontal" justify="between">
                <Text color="text.primary">Network:</Text>
                <Text color="text.accent">{systemStats.network} KB/s</Text>
              </Stack>
              <Stack direction="horizontal" justify="between">
                <Text color="text.primary">Security:</Text>
                <Badge variant="success">{systemStats.security}</Badge>
              </Stack>
              <Stack direction="horizontal" justify="between">
                <Text color="text.primary">Uptime:</Text>
                <Text color="text.accent">{systemStats.uptime}</Text>
              </Stack>
            </Stack>
          </Card>

          {/* Active Sessions */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              ACTIVE SESSIONS
            </Text>
            <Stack spacing="lg">
              {activeSessions.map((session) => (
                <Stack
                  key={session.id}
                  direction="horizontal"
                  justify="between"
                  align="center"
                  p="md"
                  bg="surface.elevated"
                  borderRadius="md"
                  border="1px solid"
                  borderColor={
                    session.status === "critical"
                      ? "border.error"
                      : "brand.interactive.background"
                  }
                >
                  <Stack spacing="xs">
                    <Text
                      variant="body-sm"
                      weight="bold"
                      color="brand.interactive.background"
                    >
                      {session.id}
                    </Text>
                    <Text variant="caption" color="text.primary">
                      {session.user}
                    </Text>
                    <Text variant="caption" color="text.secondary">
                      {session.location}
                    </Text>
                  </Stack>
                  <Badge
                    variant={
                      session.status === "critical"
                        ? "error"
                        : session.status === "active"
                          ? "success"
                          : "default"
                    }
                  >
                    {session.status.toUpperCase()}
                  </Badge>
                </Stack>
              ))}
            </Stack>
          </Card>

          {/* Security Controls */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              SECURITY CONTROLS
            </Text>
            <Stack spacing="lg">
              <Button
                variant="primary"
                onClick={startSecurityScan}
                disabled={isScanning}
              >
                {isScanning ? "SCANNING..." : "RUN SECURITY SCAN"}
              </Button>
              <Button variant="outline">FIREWALL CONFIG</Button>
              <Button variant="outline">EMERGENCY SHUTDOWN</Button>
            </Stack>
          </Card>

          {/* Terminal Output */}
          <Box
            gridColumn="1 / -1"
          >
            <Card
              bg="surface.elevated"
              borderColor="brand.interactive.background"
              p="xl"
              borderRadius="lg"
              minHeight="200px"
            >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              TERMINAL OUTPUT
            </Text>
            <Box
              fontFamily="mono"
              fontSize="sm"
              lineHeight="1.4"
              color="text.accent"
              whiteSpace="pre-wrap"
            >
              <Text color="terminal.text.prompt">cypher@matrix:~$ </Text>
              <Text color="terminal.text.command">system-monitor --live</Text>
              {"\n"}
              <Text color="terminal.text.timestamp">
                [2024-01-15 23:47:32]{" "}
              </Text>
              <Text color="terminal.text.output">
                Initializing neural interface...
              </Text>
              {"\n"}
              <Text color="terminal.text.timestamp">
                [2024-01-15 23:47:33]{" "}
              </Text>
              <Text color="terminal.text.output">
                Connection established to mainframe
              </Text>
              {"\n"}
              <Text color="terminal.text.timestamp">
                [2024-01-15 23:47:34]{" "}
              </Text>
              <Text color="terminal.text.command">
                Monitoring 3 active sessions
              </Text>
              {"\n"}
              <Text color="terminal.text.timestamp">
                [2024-01-15 23:47:35]{" "}
              </Text>
              <Text color={isScanning ? "text.error" : "text.secondary"}>
                {isScanning
                  ? "Security scan in progress..."
                  : "System idle - awaiting commands"}
              </Text>
              {"\n"}
              <Text color="terminal.text.cursor">█</Text>
            </Box>
            </Card>
          </Box>

          {/* Developer Tools */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              DEVELOPER TOOLS
            </Text>
            <Stack spacing="lg">
              <Stack direction="horizontal" align="center" spacing="lg">
                <Text color="text.primary" minWidth="100px">
                  Auto-Deploy:
                </Text>
                <Switch />
              </Stack>
              <Stack direction="horizontal" align="center" spacing="lg">
                <Text color="text.primary" minWidth="100px">
                  Git Branch:
                </Text>
                <Box minWidth="150px">
                  <Select
                    options={[
                      { value: "main", label: "main" },
                      { value: "develop", label: "develop" },
                      { value: "feature/auth", label: "feature/auth" },
                    ]}
                    placeholder="Select branch..."
                  />
                </Box>
              </Stack>
              <Divider
                borderColor="brand.interactive.background"
                opacity="0.3"
              />
              <Input placeholder="Search repositories..." />
            </Stack>
          </Card>

          {/* System Users */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Text
              variant="title"
              weight="bold"
              color="brand.interactive.background"
              mb="lg"
            >
              SYSTEM USERS
            </Text>
            <Stack spacing="lg">
              <Stack direction="horizontal" align="center" spacing="lg">
                <Avatar src="" alt="Admin" size="sm" />
                <Box flex="1">
                  <Text variant="body-sm" color="text.primary">
                    admin@cypher.sys
                  </Text>
                  <Stack direction="horizontal" spacing="sm" mt="xs">
                    <Tag semantic="success">ROOT</Tag>
                    <Tag semantic="info">ACTIVE</Tag>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="horizontal" align="center" spacing="lg">
                <Avatar src="" alt="Dev" size="sm" />
                <Box flex="1">
                  <Text variant="body-sm" color="text.primary">
                    dev@localhost
                  </Text>
                  <Stack direction="horizontal" spacing="sm" mt="xs">
                    <Tag semantic="default">USER</Tag>
                    <Tag semantic="warning">IDLE</Tag>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="horizontal" align="center" spacing="lg">
                <Avatar src="" alt="Ghost" size="sm" />
                <Box flex="1">
                  <Text variant="body-sm" color="text.primary">
                    root@matrix.net
                  </Text>
                  <Stack direction="horizontal" spacing="sm" mt="xs">
                    <Tag semantic="error">UNKNOWN</Tag>
                    <Tag semantic="error">CRITICAL</Tag>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Card>

          {/* Network Status */}
          <Card
            bg="surface.elevated"
            borderColor="brand.interactive.background"
            p="xl"
            borderRadius="lg"
          >
            <Stack
              direction="horizontal"
              align="center"
              justify="between"
              mb="lg"
            >
              <Text weight="bold" color="brand.interactive.background">
                NETWORK STATUS
              </Text>
              <Spinner size="sm" color="brand.interactive.background" />
            </Stack>
            <Stack spacing="sm">
              <Stack direction="horizontal" justify="between" align="center">
                <Link href="#" color="text.accent">
                  api.cypher.dev
                </Link>
                <Badge variant="success">ONLINE</Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Link href="#" color="text.accent">
                  db.matrix.net
                </Link>
                <Badge variant="warning">SLOW</Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Link href="#" color="text.accent">
                  cdn.neural.io
                </Link>
                <Badge variant="error">DOWN</Badge>
              </Stack>
              <Stack direction="horizontal" align="center" spacing="sm" mt="sm">
                <Checkbox id="auto-reconnect" />
                <Text variant="caption" color="text.secondary">
                  Auto-reconnect failed endpoints
                </Text>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Box>
  );
}

