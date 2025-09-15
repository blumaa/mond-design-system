'use client';

import {
  Card,
  Stack,
  Box,
  Text,
  Badge,
  Heading,
  Grid,
  Divider,
} from "@mond-design-system/theme";
import { LiveSystemStatus } from "../components/LiveSystemStatus";
import { MatrixRain } from "../components/MatrixRain";

// Static system data (server-side)
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
    status: "active" as const,
  },
  {
    id: "SX-002",
    user: "dev@localhost",
    location: "Terminal-3",
    status: "idle" as const,
  },
  {
    id: "SX-003",
    user: "root@matrix.net",
    location: "Core-9",
    status: "active" as const,
  },
];

const securityControls = [
  { name: "Firewall", status: "enabled", level: "MAXIMUM" },
  { name: "Intrusion Detection", status: "active", level: "HIGH" },
  { name: "Data Encryption", status: "enabled", level: "QUANTUM" },
  { name: "Access Control", status: "restricted", level: "BIOMETRIC" },
];

export default function Dashboard() {
  return (
    <Box bg="surface.background" p="2xl" position="relative">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Dashboard Header */}
      <Stack spacing="xl" mb="3xl">
        <Heading size="4xl" semantic="primary">
          CYPHER COMMAND CENTER
        </Heading>
        <Text variant="body-lg" semantic="secondary">
          Secure neural network interface • Real-time system monitoring
        </Text>
      </Stack>

      {/* Main Dashboard Grid */}
      <Grid columns={3} gap="xl">

        {/* System Metrics */}
        <Card variant="elevated" padding="xl">
          <Stack spacing="lg">
            <Heading size="lg" semantic="primary">
              SYSTEM METRICS
            </Heading>
            <Divider />

            <Stack spacing="md">
              <Stack direction="horizontal" justify="between">
                <Text variant="body-sm">CPU Usage</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.cpu}%
                </Text>
              </Stack>

              <Stack direction="horizontal" justify="between">
                <Text variant="body-sm">Memory</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.memory}%
                </Text>
              </Stack>

              <Stack direction="horizontal" justify="between">
                <Text variant="body-sm">Network I/O</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.network} KB/s
                </Text>
              </Stack>

              <Stack direction="horizontal" justify="between">
                <Text variant="body-sm">Uptime</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.uptime}
                </Text>
              </Stack>
            </Stack>

            <Badge variant="success" size="lg">
              ALL SYSTEMS OPERATIONAL
            </Badge>
          </Stack>
        </Card>

        {/* Active Sessions */}
        <Card variant="elevated" padding="xl">
          <Stack spacing="lg">
            <Heading size="lg" semantic="primary">
              ACTIVE SESSIONS
            </Heading>
            <Divider />

            <Stack spacing="md">
              {activeSessions.map((session) => (
                <Stack key={session.id} spacing="sm">
                  <Stack direction="horizontal" justify="between">
                    <Text variant="body-sm" weight="bold">
                      {session.id}
                    </Text>
                    <Badge
                      variant={session.status === "active" ? "success" : "warning"}
                      size="sm"
                    >
                      {session.status.toUpperCase()}
                    </Badge>
                  </Stack>
                  <Text variant="caption" semantic="secondary">
                    {session.user}
                  </Text>
                  <Text variant="caption" semantic="secondary">
                    Location: {session.location}
                  </Text>
                  <Divider />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>

        {/* Security Controls */}
        <Card variant="elevated" padding="xl">
          <Stack spacing="lg">
            <Heading size="lg" semantic="primary">
              SECURITY STATUS
            </Heading>
            <Divider />

            <Stack spacing="md">
              {securityControls.map((control) => (
                <Stack key={control.name} spacing="sm">
                  <Stack direction="horizontal" justify="between">
                    <Text variant="body-sm">{control.name}</Text>
                    <Badge variant="primary" size="sm">
                      {control.status.toUpperCase()}
                    </Badge>
                  </Stack>
                  <Text variant="caption" semantic="primary">
                    Security Level: {control.level}
                  </Text>
                  <Divider />
                </Stack>
              ))}
            </Stack>

            <Badge variant="success" size="lg">
              MAXIMUM SECURITY ENABLED
            </Badge>
          </Stack>
        </Card>

      </Grid>

      {/* Live System Status - Client Island */}
      <Box mt="2xl">
        <LiveSystemStatus />
      </Box>

    </Box>
  );
}