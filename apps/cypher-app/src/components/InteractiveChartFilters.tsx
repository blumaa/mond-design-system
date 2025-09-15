'use client';
import { useState } from 'react';
import { Card, Stack, Text, Badge, Heading, Divider, Select, Button } from '@mond-design-system/theme';

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
    <Card variant="elevated" padding="xl">
      <Stack spacing="lg">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading size="lg" semantic="primary">
            NEURAL ANALYSIS CONTROLS
          </Heading>
          <Badge variant="primary" size="sm">INTERACTIVE</Badge>
        </Stack>

        <Divider />

        <Stack direction="horizontal" spacing="xl" align="end">
          <Stack spacing="sm" flex="1">
            <Text variant="body-sm" semantic="secondary">Time Range</Text>
            <Select
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              options={timeRanges}
            />
          </Stack>

          <Stack spacing="sm" flex="1">
            <Text variant="body-sm" semantic="secondary">Metric Type</Text>
            <Select
              value={selectedMetric}
              onChange={setSelectedMetric}
              options={metricTypes}
            />
          </Stack>

          <Button
            variant="primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Stack>

        {isAnalyzing && (
          <Stack spacing="sm">
            <Badge variant="warning" size="sm">PROCESSING</Badge>
            <Text variant="caption" semantic="secondary">
              Neural network analyzing {selectedMetric} data for {timeRanges.find(r => r.value === selectedTimeRange)?.label.toLowerCase()}...
            </Text>
          </Stack>
        )}

        <Stack direction="horizontal" spacing="md">
          <Text variant="caption" semantic="secondary">
            Selected: {metricTypes.find(m => m.value === selectedMetric)?.label} • {timeRanges.find(r => r.value === selectedTimeRange)?.label}
          </Text>
          <Badge variant="success" size="sm">QUANTUM ENCRYPTED</Badge>
        </Stack>
      </Stack>
    </Card>
  );
}