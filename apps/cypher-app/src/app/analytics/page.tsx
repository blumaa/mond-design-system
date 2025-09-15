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
import { InteractiveChartFilters } from "../../components/InteractiveChartFilters";
import { MatrixRain } from "../../components/MatrixRain";

// Static analytics data (server-side)
const deploymentStats = {
  total: 247,
  successful: 231,
  failed: 16,
  successRate: 93.5,
  avgDuration: "3.2min"
};

const codeQualityMetrics = [
  { name: "Code Coverage", value: 89.2, unit: "%", status: "good" },
  { name: "Technical Debt", value: 2.3, unit: "hours", status: "excellent" },
  { name: "Cyclomatic Complexity", value: 4.1, unit: "avg", status: "good" },
  { name: "Maintainability Index", value: 82.7, unit: "/100", status: "good" },
  { name: "Duplication", value: 1.8, unit: "%", status: "excellent" },
  { name: "Security Vulnerabilities", value: 0, unit: "critical", status: "excellent" }
];

const performanceData = [
  { metric: "Response Time", current: "127ms", target: "< 200ms", trend: "improving" },
  { metric: "Throughput", current: "1,247 req/s", target: "> 1,000 req/s", trend: "stable" },
  { metric: "Error Rate", current: "0.03%", target: "< 0.1%", trend: "improving" },
  { metric: "CPU Usage", current: "23.4%", target: "< 80%", trend: "stable" },
  { metric: "Memory Usage", current: "45.8%", target: "< 85%", trend: "stable" },
  { metric: "Disk I/O", current: "156 MB/s", target: "< 500 MB/s", trend: "stable" }
];

const securityInsights = [
  { category: "Authentication", score: 95, issues: 0, status: "secure" },
  { category: "Authorization", score: 92, issues: 1, status: "secure" },
  { category: "Data Encryption", score: 98, issues: 0, status: "secure" },
  { category: "Input Validation", score: 87, issues: 3, status: "review" },
  { category: "Session Management", score: 94, issues: 0, status: "secure" },
  { category: "Error Handling", score: 89, issues: 2, status: "review" }
];

const recentDeployments = [
  { id: "D-247", timestamp: "2024-01-15 23:45:12", status: "success", duration: "2.8min", environment: "production" },
  { id: "D-246", timestamp: "2024-01-15 22:13:45", status: "success", duration: "3.1min", environment: "staging" },
  { id: "D-245", timestamp: "2024-01-15 20:07:23", status: "failed", duration: "1.2min", environment: "production" },
  { id: "D-244", timestamp: "2024-01-15 18:34:56", status: "success", duration: "3.7min", environment: "staging" },
  { id: "D-243", timestamp: "2024-01-15 16:22:11", status: "success", duration: "2.9min", environment: "production" }
];

export default function Analytics() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return { variant: 'success' as const, text: 'EXCELLENT' };
      case 'good': return { variant: 'primary' as const, text: 'GOOD' };
      case 'review': return { variant: 'warning' as const, text: 'REVIEW' };
      case 'secure': return { variant: 'success' as const, text: 'SECURE' };
      case 'success': return { variant: 'success' as const, text: 'SUCCESS' };
      case 'failed': return { variant: 'error' as const, text: 'FAILED' };
      case 'improving': return { variant: 'success' as const, text: '↗ IMPROVING' };
      case 'stable': return { variant: 'primary' as const, text: '→ STABLE' };
      default: return { variant: 'secondary' as const, text: status.toUpperCase() };
    }
  };

  return (
    <Box bg="surface.background" p="2xl" position="relative">
      <MatrixRain />

      <Stack spacing="xl">
        <Stack spacing="md">
          <Heading size="4xl" semantic="primary">
            SYSTEM ANALYTICS
          </Heading>
          <Text variant="body-lg" semantic="secondary">
            Neural network performance insights • Quantum data analysis
          </Text>
        </Stack>

        {/* Interactive Chart Filters - Client Island */}
        <InteractiveChartFilters />

        {/* Deployment Overview */}
        <Card variant="elevated" padding="xl">
          <Stack spacing="lg">
            <Heading size="lg" semantic="primary">
              DEPLOYMENT OVERVIEW
            </Heading>
            <Divider />

            <Grid columns={5} gap="lg">
              <Stack spacing="sm" align="center">
                <Text variant="title" semantic="primary">
                  {deploymentStats.total}
                </Text>
                <Text variant="caption" semantic="secondary">Total Deployments</Text>
              </Stack>

              <Stack spacing="sm" align="center">
                <Text variant="title" color="feedback.success.text">
                  {deploymentStats.successful}
                </Text>
                <Text variant="caption" semantic="secondary">Successful</Text>
              </Stack>

              <Stack spacing="sm" align="center">
                <Text variant="title" color="feedback.error.text">
                  {deploymentStats.failed}
                </Text>
                <Text variant="caption" semantic="secondary">Failed</Text>
              </Stack>

              <Stack spacing="sm" align="center">
                <Text variant="title" semantic="primary">
                  {deploymentStats.successRate}%
                </Text>
                <Text variant="caption" semantic="secondary">Success Rate</Text>
              </Stack>

              <Stack spacing="sm" align="center">
                <Text variant="title" semantic="primary">
                  {deploymentStats.avgDuration}
                </Text>
                <Text variant="caption" semantic="secondary">Avg Duration</Text>
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Main Analytics Grid */}
        <Grid columns={2} gap="xl">

          {/* Code Quality Metrics */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                CODE QUALITY METRICS
              </Heading>
              <Divider />

              <Stack spacing="md">
                {codeQualityMetrics.map((metric) => {
                  const statusBadge = getStatusBadge(metric.status);
                  return (
                    <Stack key={metric.name} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-sm">{metric.name}</Text>
                        <Badge variant={statusBadge.variant} size="sm">
                          {statusBadge.text}
                        </Badge>
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="end">
                        <Text variant="body-lg" semantic="primary">
                          {metric.value}
                        </Text>
                        <Text variant="caption" semantic="secondary">
                          {metric.unit}
                        </Text>
                      </Stack>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

          {/* Performance Metrics */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                PERFORMANCE METRICS
              </Heading>
              <Divider />

              <Stack spacing="md">
                {performanceData.map((item) => {
                  const trendBadge = getStatusBadge(item.trend);
                  return (
                    <Stack key={item.metric} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-sm">{item.metric}</Text>
                        <Badge variant={trendBadge.variant} size="sm">
                          {trendBadge.text}
                        </Badge>
                      </Stack>

                      <Stack direction="horizontal" justify="between">
                        <Text variant="body-md" semantic="primary">
                          {item.current}
                        </Text>
                        <Text variant="caption" semantic="secondary">
                          Target: {item.target}
                        </Text>
                      </Stack>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

          {/* Security Analysis */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                SECURITY ANALYSIS
              </Heading>
              <Divider />

              <Stack spacing="md">
                {securityInsights.map((item) => {
                  const statusBadge = getStatusBadge(item.status);
                  return (
                    <Stack key={item.category} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-sm">{item.category}</Text>
                        <Badge variant={statusBadge.variant} size="sm">
                          {statusBadge.text}
                        </Badge>
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-lg" semantic="primary">
                          {item.score}/100
                        </Text>
                        <Text variant="caption" color={item.issues > 0 ? "feedback.warning.text" : "text.secondary"}>
                          {item.issues} issues
                        </Text>
                      </Stack>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

          {/* Recent Deployments */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                RECENT DEPLOYMENTS
              </Heading>
              <Divider />

              <Stack spacing="md" maxHeight="300px" overflow="auto">
                {recentDeployments.map((deployment) => {
                  const statusBadge = getStatusBadge(deployment.status);
                  return (
                    <Stack key={deployment.id} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-sm" weight="bold">
                          {deployment.id}
                        </Text>
                        <Badge variant={statusBadge.variant} size="sm">
                          {statusBadge.text}
                        </Badge>
                      </Stack>

                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">
                          {deployment.timestamp}
                        </Text>
                        <Text variant="caption" semantic="primary">
                          {deployment.duration}
                        </Text>
                      </Stack>

                      <Text variant="caption" semantic="secondary">
                        Environment: {deployment.environment}
                      </Text>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

        </Grid>
      </Stack>
    </Box>
  );
}