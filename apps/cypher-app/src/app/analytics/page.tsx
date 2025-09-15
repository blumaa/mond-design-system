'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Text, Badge, Heading, Select, Divider, Checkbox } from '@mond-design-system/theme';

// Mock data for code quality metrics
const codeQualityMetrics = {
  overallScore: 87.3,
  technicalDebt: 23.5, // hours
  testCoverage: 78.9,
  codeComplexity: 6.2,
  vulnerabilities: 3,
  duplicatedLines: 4.7, // percentage
  maintainabilityIndex: 82.1,
  lastAnalysis: '2024-01-15 23:42:18'
};

const deploymentStats = {
  deploymentsToday: 12,
  successRate: 94.7, // percentage
  avgDeployTime: 8.3, // minutes
  rollbackRate: 2.1, // percentage
  failureCount: 1,
  lastDeployment: '47 minutes ago',
  nextScheduled: 'Tomorrow 02:00 UTC'
};

const performanceMetrics = {
  responseTime: 187, // ms
  throughput: 2847, // requests/min
  errorRate: 0.12, // percentage
  uptime: 99.97,
  memoryUsage: 67.3, // percentage
  cpuUtilization: 34.8 // percentage
};

const bugTrackingData = [
  { id: 'BUG-001', severity: 'critical', title: 'Memory leak in user session handler', assigned: 'sarah.chen@cypher.dev', status: 'in-progress' },
  { id: 'BUG-002', severity: 'high', title: 'API rate limiting not working correctly', assigned: 'alex.rodriguez@cypher.dev', status: 'open' },
  { id: 'BUG-003', severity: 'medium', title: 'UI glitch on mobile dashboard', assigned: 'jamie.kim@cypher.dev', status: 'resolved' },
  { id: 'BUG-004', severity: 'low', title: 'Terminal cursor position offset', assigned: 'morgan.silva@cypher.dev', status: 'open' },
];

const recentDeployments = [
  { id: 'DEPLOY-4783', version: 'v2.1.7', status: 'success', duration: '6m 23s', timestamp: '23:42:18', deployer: 'auto-deploy' },
  { id: 'DEPLOY-4782', version: 'v2.1.6', status: 'success', duration: '8m 11s', timestamp: '22:15:42', deployer: 'sarah.chen' },
  { id: 'DEPLOY-4781', version: 'v2.1.5', status: 'failed', duration: '3m 07s', timestamp: '21:33:29', deployer: 'alex.rodriguez' },
  { id: 'DEPLOY-4780', version: 'v2.1.4', status: 'success', duration: '7m 45s', timestamp: '20:18:56', deployer: 'auto-deploy' },
];

export default function AnalyticsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        timeZone: 'UTC'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'in-progress': return 'default';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box
      bg="surface.background"
      p="2xl"
      fontFamily="mono"
      maxWidth="1280px"
      mx="auto"
    >
      <Stack gap="xl">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" borderBottom="1px solid" borderColor="brand.interactive.background" pb="lg">
          <Stack gap="xs">
            <Heading 
              level={1}
              size="2xl" 
              weight="bold" 
              color="brand.interactive.background"
              fontFamily="mono"
            >
              ANALYTICS DASHBOARD
            </Heading>
            <Text variant="body-sm" color="text.accent">
              SYSTEM PERFORMANCE & CODE QUALITY METRICS // UTC: {currentTime}
            </Text>
          </Stack>
          <Stack direction="horizontal" align="center" gap="lg">
            <Box minWidth="150px">
              <Select 
                options={[
                  { value: '1h', label: 'Last Hour' },
                  { value: '24h', label: 'Last 24 Hours' },
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' }
                ]}
                value={selectedTimeframe}
                onChange={(value) => setSelectedTimeframe(value)}
              />
            </Box>
            <Button 
              variant="primary"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'REFRESHING...' : 'REFRESH DATA'}
            </Button>
          </Stack>
        </Stack>

        {/* Metrics Overview Grid */}
        <Box 
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap="xl"
        >
          {/* Code Quality Score */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="sm">
              CODE QUALITY SCORE
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
color="text.primary" mb="sm"
            >
              {codeQualityMetrics.overallScore}
            </Heading>
            <Text variant="caption" color="text.accent">
              +2.3 from last week
            </Text>
          </Card>

          {/* Deployment Success Rate */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="sm">
              DEPLOYMENT SUCCESS
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
color="text.primary" mb="sm"
            >
              {deploymentStats.successRate}%
            </Heading>
            <Text variant="caption" color="text.accent">
              {deploymentStats.deploymentsToday} deployments today
            </Text>
          </Card>

          {/* Test Coverage */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="sm">
              TEST COVERAGE
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
color="text.primary" mb="sm"
            >
              {codeQualityMetrics.testCoverage}%
            </Heading>
            <Text variant="caption" color="text.warning">
              Target: 85%
            </Text>
          </Card>

          {/* System Uptime */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="sm">
              SYSTEM UPTIME
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
color="text.primary" mb="sm"
            >
              {performanceMetrics.uptime}%
            </Heading>
            <Text variant="caption" color="text.accent">
              SLA: 99.9%
            </Text>
          </Card>
        </Box>

        {/* Detailed Metrics Grid */}
        <Box 
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))"
          gap="xl"
        >
          {/* Code Quality Details */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="lg">
              CODE QUALITY BREAKDOWN
            </Text>
            <Stack gap="lg">
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Technical Debt:</Text>
                <Badge 
                  variant="warning" 
                >
                  {codeQualityMetrics.technicalDebt}h
                </Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Code Complexity:</Text>
                <Text color="text.accent">{codeQualityMetrics.codeComplexity}/10</Text>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Vulnerabilities:</Text>
                <Badge 
                  variant="error" 
                >
                  {codeQualityMetrics.vulnerabilities}
                </Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Duplicated Lines:</Text>
                <Text color="text.accent">{codeQualityMetrics.duplicatedLines}%</Text>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Maintainability:</Text>
                <Badge 
                  variant="success" 
                >
                  {codeQualityMetrics.maintainabilityIndex}/100
                </Badge>
              </Stack>
              <Divider borderColor="brand.interactive.background" opacity="0.3" />
              <Text variant="caption" color="text.secondary">
                Last analysis: {codeQualityMetrics.lastAnalysis}
              </Text>
            </Stack>
          </Card>

          {/* Performance Metrics */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="lg">
              PERFORMANCE METRICS
            </Text>
            <Stack gap="lg">
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Avg Response Time:</Text>
                <Badge 
                  variant="success" 
                >
                  {performanceMetrics.responseTime}ms
                </Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Throughput:</Text>
                <Text color="text.accent">{performanceMetrics.throughput} req/min</Text>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Error Rate:</Text>
                <Badge 
                  variant="success" 
                >
                  {performanceMetrics.errorRate}%
                </Badge>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">Memory Usage:</Text>
                <Text color="text.accent">{performanceMetrics.memoryUsage}%</Text>
              </Stack>
              <Stack direction="horizontal" justify="between" align="center">
                <Text color="text.primary">CPU Utilization:</Text>
                <Text color="text.accent">{performanceMetrics.cpuUtilization}%</Text>
              </Stack>
              <Divider borderColor="brand.interactive.background" opacity="0.3" />
              <Stack direction="horizontal" align="center" gap="sm">
                <Checkbox 
                  id="auto-scaling"
                />
                <Text variant="caption" color="text.secondary">Auto-scaling enabled</Text>
              </Stack>
            </Stack>
          </Card>
        </Box>

        {/* Bug Tracking and Recent Deployments */}
        <Box 
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))"
          gap="xl"
        >
          {/* Bug Tracking */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Text weight="bold" color="brand.interactive.background" mb="lg">
              BUG TRACKING SUMMARY
            </Text>
            <Stack gap="lg">
              {bugTrackingData.map((bug) => (
                <Card key={bug.id} p="lg" bg="surface.secondary">
                  <Stack direction="horizontal" justify="between" align="start" mb="sm">
                    <Text variant="body-sm" color="text.accent" weight="bold">
                      {bug.id}
                    </Text>
                    <Stack direction="horizontal" gap="sm">
                      <Badge 
                        variant={getSeverityVariant(bug.severity)}
                      >
                        {bug.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant={getStatusVariant(bug.status)}
                      >
                        {bug.status.toUpperCase()}
                      </Badge>
                    </Stack>
                  </Stack>
                  <Text variant="body-sm" color="text.primary" mb="sm">
                    {bug.title}
                  </Text>
                  <Text variant="caption" color="text.secondary">
                    Assigned: {bug.assigned}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Card>

          {/* Recent Deployments */}
          <Card bg="surface.elevated" borderColor="brand.interactive.background" p="xl">
            <Stack direction="horizontal" justify="between" align="center" mb="lg">
              <Text weight="bold" color="brand.interactive.background">
                RECENT DEPLOYMENTS
              </Text>
              <Text variant="caption" color="text.accent">
                Next: {deploymentStats.nextScheduled}
              </Text>
            </Stack>
            <Stack gap="lg">
              {recentDeployments.map((deployment) => (
                <Card key={deployment.id} bg="surface.secondary" p="lg">
                  <Stack direction="horizontal" justify="between" align="start" mb="sm">
                    <Box>
                      <Text variant="body-sm" color="text.accent" weight="bold">
                        {deployment.version}
                      </Text>
                      <Text variant="caption" color="text.secondary">
                        {deployment.id}
                      </Text>
                    </Box>
                    <Badge 
                      variant={getStatusVariant(deployment.status)}
                    >
                      {deployment.status.toUpperCase()}
                    </Badge>
                  </Stack>
                  <Stack direction="horizontal" justify="between" align="center">
                    <Text variant="caption" color="text.primary">
                      Duration: {deployment.duration}
                    </Text>
                    <Text variant="caption" color="text.secondary">
                      By: {deployment.deployer} at {deployment.timestamp}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
            <Divider borderColor="brand.interactive.background" opacity="0.3" m="lg" />
            <Stack direction="horizontal" justify="between" align="center">
              <Text variant="caption" color="text.secondary">
                Avg Deploy Time: {deploymentStats.avgDeployTime}m
              </Text>
              <Text variant="caption" color="text.secondary">
                Rollback Rate: {deploymentStats.rollbackRate}%
              </Text>
            </Stack>
          </Card>
        </Box>
      </Stack>

    </Box>
  );
}