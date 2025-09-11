'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Text, Badge, Heading, Input, Select, Switch, Divider, Link, Avatar, Checkbox, Spinner, Tag, Grid } from '@mond-design-system/theme';

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0055';
      case 'high': return '#ff9500';
      case 'medium': return '#00d4ff';
      case 'low': return '#00ff41';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#00ff41';
      case 'failed': return '#ff0055';
      case 'in-progress': return '#00d4ff';
      case 'resolved': return '#00ff41';
      default: return '#666';
    }
  };

  return (
    <Box 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 100%)',
        padding: '2rem',
        fontFamily: 'var(--font-jetbrains-mono)',
      }}
    >
      <Stack gap={4}>
        {/* Header */}
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #00ff41',
          paddingBottom: '1rem',
        }}>
          <Box>
            <Heading 
              level={1}
              size="2xl" 
              weight="bold" 
              style={{ 
                color: '#00ff41', 
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
              }}
            >
              ANALYTICS DASHBOARD
            </Heading>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              SYSTEM PERFORMANCE & CODE QUALITY METRICS // UTC: {currentTime}
            </Text>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Box style={{ minWidth: '150px' }}>
              <Select 
                options={[
                  { value: '1h', label: 'Last Hour' },
                  { value: '24h', label: 'Last 24 Hours' },
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' }
                ]}
                value={selectedTimeframe}
                onChange={(value) => setSelectedTimeframe(value)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ff41',
                  color: '#ffffff'
                }}
              />
            </Box>
            <Button 
              variant="primary"
              onClick={refreshData}
              disabled={isRefreshing}
              style={{
                backgroundColor: '#00ff41',
                color: '#0a0a0a',
                border: 'none',
                boxShadow: isRefreshing ? '0 0 25px rgba(0, 255, 65, 0.6)' : '0 0 15px rgba(0, 255, 65, 0.3)',
              }}
            >
              {isRefreshing ? 'REFRESHING...' : 'REFRESH DATA'}
            </Button>
          </Box>
        </Box>

        {/* Metrics Overview Grid */}
        <Grid columns={{ default: 1, md: 2, lg: 4 }} gap={4}>
          {/* Code Quality Score */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
              CODE QUALITY SCORE
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
              style={{ color: '#ffffff', marginBottom: '0.5rem' }}
            >
              {codeQualityMetrics.overallScore}
            </Heading>
            <Text variant="caption" style={{ color: '#00d4ff' }}>
              +2.3 from last week
            </Text>
          </Card>

          {/* Deployment Success Rate */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
              DEPLOYMENT SUCCESS
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
              style={{ color: '#ffffff', marginBottom: '0.5rem' }}
            >
              {deploymentStats.successRate}%
            </Heading>
            <Text variant="caption" style={{ color: '#00d4ff' }}>
              {deploymentStats.deploymentsToday} deployments today
            </Text>
          </Card>

          {/* Test Coverage */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
              TEST COVERAGE
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
              style={{ color: '#ffffff', marginBottom: '0.5rem' }}
            >
              {codeQualityMetrics.testCoverage}%
            </Heading>
            <Text variant="caption" style={{ color: '#ff9500' }}>
              Target: 85%
            </Text>
          </Card>

          {/* System Uptime */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
              SYSTEM UPTIME
            </Text>
            <Heading 
              level={2} 
              size="3xl" 
              weight="bold" 
              style={{ color: '#ffffff', marginBottom: '0.5rem' }}
            >
              {performanceMetrics.uptime}%
            </Heading>
            <Text variant="caption" style={{ color: '#00d4ff' }}>
              SLA: 99.9%
            </Text>
          </Card>
        </Grid>

        {/* Detailed Metrics Grid */}
        <Grid columns={{ default: 1, lg: 2 }} gap={4}>
          {/* Code Quality Details */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              CODE QUALITY BREAKDOWN
            </Text>
            <Stack gap={3}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Technical Debt:</Text>
                <Badge 
                  variant="warning" 
                  style={{ backgroundColor: '#ff9500', color: '#0a0a0a' }}
                >
                  {codeQualityMetrics.technicalDebt}h
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Code Complexity:</Text>
                <Text style={{ color: '#00d4ff' }}>{codeQualityMetrics.codeComplexity}/10</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Vulnerabilities:</Text>
                <Badge 
                  variant="error" 
                  style={{ backgroundColor: '#ff0055', color: '#ffffff' }}
                >
                  {codeQualityMetrics.vulnerabilities}
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Duplicated Lines:</Text>
                <Text style={{ color: '#00d4ff' }}>{codeQualityMetrics.duplicatedLines}%</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Maintainability:</Text>
                <Badge 
                  variant="success" 
                  style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
                >
                  {codeQualityMetrics.maintainabilityIndex}/100
                </Badge>
              </Box>
              <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
              <Text variant="caption" style={{ color: '#888' }}>
                Last analysis: {codeQualityMetrics.lastAnalysis}
              </Text>
            </Stack>
          </Card>

          {/* Performance Metrics */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              PERFORMANCE METRICS
            </Text>
            <Stack gap={3}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Avg Response Time:</Text>
                <Badge 
                  variant="success" 
                  style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
                >
                  {performanceMetrics.responseTime}ms
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Throughput:</Text>
                <Text style={{ color: '#00d4ff' }}>{performanceMetrics.throughput} req/min</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Error Rate:</Text>
                <Badge 
                  variant="success" 
                  style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
                >
                  {performanceMetrics.errorRate}%
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Memory Usage:</Text>
                <Text style={{ color: '#00d4ff' }}>{performanceMetrics.memoryUsage}%</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>CPU Utilization:</Text>
                <Text style={{ color: '#00d4ff' }}>{performanceMetrics.cpuUtilization}%</Text>
              </Box>
              <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox 
                  id="auto-scaling" 
                  style={{ 
                    accentColor: '#00ff41',
                    transform: 'scale(0.9)'
                  }} 
                />
                <Text variant="caption" style={{ color: '#888' }}>Auto-scaling enabled</Text>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Bug Tracking and Recent Deployments */}
        <Grid columns={{ default: 1, lg: 2 }} gap={4}>
          {/* Bug Tracking */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              BUG TRACKING SUMMARY
            </Text>
            <Stack gap={3}>
              {bugTrackingData.map((bug) => (
                <Box key={bug.id} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  border: `1px solid ${getSeverityColor(bug.severity)}`,
                }}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Text variant="body-sm" style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                      {bug.id}
                    </Text>
                    <Box style={{ display: 'flex', gap: '0.5rem' }}>
                      <Badge 
                        style={{ 
                          backgroundColor: getSeverityColor(bug.severity), 
                          color: '#ffffff',
                          fontSize: '0.75rem'
                        }}
                      >
                        {bug.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        style={{ 
                          backgroundColor: getStatusColor(bug.status), 
                          color: '#0a0a0a',
                          fontSize: '0.75rem'
                        }}
                      >
                        {bug.status.toUpperCase()}
                      </Badge>
                    </Box>
                  </Box>
                  <Text variant="body-sm" style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                    {bug.title}
                  </Text>
                  <Text variant="caption" style={{ color: '#888' }}>
                    Assigned: {bug.assigned}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Card>

          {/* Recent Deployments */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <Text weight="bold" style={{ color: '#00ff41' }}>
                RECENT DEPLOYMENTS
              </Text>
              <Text variant="caption" style={{ color: '#00d4ff' }}>
                Next: {deploymentStats.nextScheduled}
              </Text>
            </Box>
            <Stack gap={3}>
              {recentDeployments.map((deployment) => (
                <Box key={deployment.id} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  border: `1px solid ${getStatusColor(deployment.status)}`,
                }}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                        {deployment.version}
                      </Text>
                      <Text variant="caption" style={{ color: '#888' }}>
                        {deployment.id}
                      </Text>
                    </Box>
                    <Badge 
                      style={{ 
                        backgroundColor: getStatusColor(deployment.status), 
                        color: deployment.status === 'failed' ? '#ffffff' : '#0a0a0a',
                        fontSize: '0.75rem'
                      }}
                    >
                      {deployment.status.toUpperCase()}
                    </Badge>
                  </Box>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text variant="caption" style={{ color: '#ffffff' }}>
                      Duration: {deployment.duration}
                    </Text>
                    <Text variant="caption" style={{ color: '#888' }}>
                      By: {deployment.deployer} at {deployment.timestamp}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Divider style={{ borderColor: '#00ff41', opacity: 0.3, margin: '1rem 0' }} />
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="caption" style={{ color: '#888' }}>
                Avg Deploy Time: {deploymentStats.avgDeployTime}m
              </Text>
              <Text variant="caption" style={{ color: '#888' }}>
                Rollback Rate: {deploymentStats.rollbackRate}%
              </Text>
            </Box>
          </Card>
        </Grid>
      </Stack>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}