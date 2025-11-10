'use client';
import { useState } from 'react';
import { Box, Text, Badge, Heading, Divider, Select, Button } from '@mond-design-system/theme';

const timeRanges = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' }
];

const metricTypes = [
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'errors', label: 'Error Logs' },
  { value: 'usage', label: 'Resource Usage' }
];

export function InteractiveChartFilters() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  return (
    <Box bg="surface.elevated" p="xl" borderRadius={8}>
      <Box display="flex" flexDirection="column" gap="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" semantic="primary">
            NEURAL ANALYSIS CONTROLS
          </Heading>
          <Badge variant="primary" size="sm">INTERACTIVE</Badge>
        </Box>

        <Divider />

        <Box display="flex" gap="xl" alignItems="flex-end">
          <Box display="flex" flexDirection="column" gap="sm" flex="1">
            <Text variant="body-sm" semantic="secondary">Time Range</Text>
            <Select
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              options={timeRanges}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap="sm" flex="1">
            <Text variant="body-sm" semantic="secondary">Metric Type</Text>
            <Select
              value={selectedMetric}
              onChange={setSelectedMetric}
              options={metricTypes}
            />
          </Box>

          <Button
            variant="primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Box>

        {isAnalyzing && (
          <Box display="flex" flexDirection="column" gap="sm">
            <Badge variant="warning" size="sm">PROCESSING</Badge>
            <Text variant="caption" semantic="secondary">
              Neural network analyzing {selectedMetric} data for {timeRanges.find(r => r.value === selectedTimeRange)?.label.toLowerCase()}...
            </Text>
          </Box>
        )}

        <Box display="flex" gap="md">
          <Text variant="caption" semantic="secondary">
            Selected: {metricTypes.find(m => m.value === selectedMetric)?.label} • {timeRanges.find(r => r.value === selectedTimeRange)?.label}
          </Text>
          <Badge variant="success" size="sm">QUANTUM ENCRYPTED</Badge>
        </Box>
      </Box>
    </Box>
  );
}