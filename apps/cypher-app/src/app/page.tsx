'use client';

import {
  Box,
  Text,
  Badge,
  Heading,
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
      <Box display="flex" flexDirection="column" gap="xl" mb="3xl">
        <Heading size="4xl" semantic="primary">
          CYPHER COMMAND CENTER
        </Heading>
        <Text variant="body-lg" semantic="secondary">
          Secure neural network interface • Real-time system monitoring
        </Text>
      </Box>

      {/* Main Dashboard Grid */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="xl">

        {/* System Metrics */}
        <Box bg="surface.elevated" p="xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="lg">
            <Heading size="lg" semantic="primary">
              SYSTEM METRICS
            </Heading>
            <Divider />

            <Box display="flex" flexDirection="column" gap="md">
              <Box display="flex" justifyContent="space-between">
                <Text variant="body-sm">CPU Usage</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.cpu}%
                </Text>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Text variant="body-sm">Memory</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.memory}%
                </Text>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Text variant="body-sm">Network I/O</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.network} KB/s
                </Text>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Text variant="body-sm">Uptime</Text>
                <Text variant="body-sm" weight="bold" semantic="primary">
                  {systemStats.uptime}
                </Text>
              </Box>
            </Box>

            <Badge variant="success" size="lg">
              ALL SYSTEMS OPERATIONAL
            </Badge>
          </Box>
        </Box>

        {/* Active Sessions */}
        <Box bg="surface.elevated" p="xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="lg">
            <Heading size="lg" semantic="primary">
              ACTIVE SESSIONS
            </Heading>
            <Divider />

            <Box display="flex" flexDirection="column" gap="md">
              {activeSessions.map((session) => (
                <Box key={session.id} display="flex" flexDirection="column" gap="sm">
                  <Box display="flex" justifyContent="space-between">
                    <Text variant="body-sm" weight="bold">
                      {session.id}
                    </Text>
                    <Badge
                      variant={session.status === "active" ? "success" : "warning"}
                      size="sm"
                    >
                      {session.status.toUpperCase()}
                    </Badge>
                  </Box>
                  <Text variant="caption" semantic="secondary">
                    {session.user}
                  </Text>
                  <Text variant="caption" semantic="secondary">
                    Location: {session.location}
                  </Text>
                  <Divider />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Security Controls */}
        <Box bg="surface.elevated" p="xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="lg">
            <Heading size="lg" semantic="primary">
              SECURITY STATUS
            </Heading>
            <Divider />

            <Box display="flex" flexDirection="column" gap="md">
              {securityControls.map((control) => (
                <Box key={control.name} display="flex" flexDirection="column" gap="sm">
                  <Box display="flex" justifyContent="space-between">
                    <Text variant="body-sm">{control.name}</Text>
                    <Badge variant="primary" size="sm">
                      {control.status.toUpperCase()}
                    </Badge>
                  </Box>
                  <Text variant="caption" semantic="primary">
                    Security Level: {control.level}
                  </Text>
                  <Divider />
                </Box>
              ))}
            </Box>

            <Badge variant="success" size="lg">
              MAXIMUM SECURITY ENABLED
            </Badge>
          </Box>
        </Box>

      </Box>

      {/* Live System Status - Client Island */}
      <Box mt="2xl">
        <LiveSystemStatus />
      </Box>

    </Box>
  );
}