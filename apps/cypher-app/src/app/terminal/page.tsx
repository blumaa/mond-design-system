'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Input, Badge, Heading, Divider } from '@mond-design-system/theme';
import { MatrixRain } from '../../components/MatrixRain';

interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
}

const mockCommands = [
  { cmd: 'help', response: 'Available commands: status, scan, users, deploy, logs, clear, hack' },
  { cmd: 'status', response: 'System Status: ONLINE | CPU: 73.2% | RAM: 45.8% | Network: 892.1 KB/s' },
  { cmd: 'scan', response: 'Security scan initiated...\n[SCANNING] Neural pathways: 247 found\n[FOUND] 3 vulnerabilities in firewall matrix\n[REPORT] Check /var/log/security.log for details' },
  { cmd: 'users', response: 'Active users: admin@cypher.sys, dev@localhost, root@matrix.net\nTotal sessions: 3 | Authentication: BIOMETRIC' },
  { cmd: 'deploy', response: 'Deployment pipeline started...\n[INFO] Build #247 queued for production\n[INFO] Estimated deployment time: 2.3 minutes\n[SUCCESS] All systems ready for deployment' },
  { cmd: 'logs', response: 'Tailing system logs...\n[23:47:15] [INFO] Authentication successful\n[23:47:12] [WARN] High CPU usage detected on Node-7\n[23:47:08] [ERROR] Connection timeout to neural.io\n[23:47:05] [INFO] Data backup completed successfully' },
  { cmd: 'hack', response: '[INITIATING] Neural network breach protocol...\n[ACCESSING] Quantum encryption matrix...\n[DECRYPTING] Firewall signatures...\n[SUCCESS] Access granted to mainframe\n[WARNING] This action has been logged' }
];

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'system',
      content: 'CYPHER Terminal v3.0.0 initialized'
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'system',
      content: 'Neural network connection established'
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'system',
      content: 'Type "help" for available commands'
    }
  ]);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      content
    };
    setLines(prev => [...prev, newLine]);
  };

  const processCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();

    // Add the command line
    addLine('command', `> ${command}`);

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    if (cmd === 'clear') {
      setLines([]);
      setIsProcessing(false);
      return;
    }

    // Find matching command
    const matchedCommand = mockCommands.find(c => c.cmd === cmd);

    if (matchedCommand) {
      addLine('output', matchedCommand.response);
    } else if (cmd === '') {
      // Empty command, do nothing
    } else {
      addLine('error', `Command not found: ${command}. Type "help" for available commands.`);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processCommand(input);
      setInput('');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'text.accent';
      case 'error': return 'feedback.error.text';
      case 'system': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  return (
    <Box bg="surface.background" p="2xl" position="relative">
      <MatrixRain />

      <Box display="flex" flexDirection="column" gap="xl">
        <Box display="flex" flexDirection="column" gap="md">
          <Heading size="4xl" semantic="primary">
            CYPHER TERMINAL
          </Heading>
          <Text variant="body-lg" semantic="secondary">
            Neural network command interface • Quantum encryption enabled
          </Text>
        </Box>

        <Box bg="surface.elevated" p="xl" borderRadius={8} minHeight="600px">
          <Box display="flex" flexDirection="column" gap="lg" height="100%">

            {/* Terminal Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap="md" alignItems="center">
                <Badge variant="success" size="sm">CONNECTED</Badge>
                <Text variant="caption" semantic="secondary">
                  Session: admin@cypher.sys
                </Text>
              </Box>
              <Box display="flex" gap="md" alignItems="center">
                <Text variant="caption" semantic="secondary">
                  Encryption: QUANTUM
                </Text>
                <Badge variant="primary" size="sm">SECURE</Badge>
              </Box>
            </Box>

            <Divider />

            {/* Terminal Output */}
            <Box
              flex="1"
              overflow="auto"
              p="md"
              bg="surface.background"
              borderRadius={8}
              maxHeight="400px"
            >
              <Box display="flex" flexDirection="column" gap="xs">
                {lines.map((line) => (
                  <Text
                    key={line.id}
                    variant="body-sm"
                    color={getLineColor(line.type)}
                    whiteSpace="pre-wrap"
                  >
                    {line.content}
                  </Text>
                ))}

                {isProcessing && (
                  <Box display="flex" gap="sm" alignItems="center">
                    <Text variant="body-sm" semantic="primary">
                      Processing...
                    </Text>
                    <Badge variant="warning" size="sm">WORKING</Badge>
                  </Box>
                )}

                <div ref={terminalEndRef} />
              </Box>
            </Box>

            {/* Input Area */}
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap="sm" alignItems="center">
                <Text variant="body-sm" semantic="primary">
                  cypher@neural:~$
                </Text>
                <Box flex="1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command..."
                    disabled={isProcessing}
                    autoComplete="off"
                  />
                </Box>
                {isProcessing && (
                  <Badge variant="warning" size="sm">PROCESSING</Badge>
                )}
              </Box>
            </form>

            {/* Command Help */}
            <Text variant="caption" semantic="secondary">
              Available commands: help, status, scan, users, deploy, logs, clear, hack
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}