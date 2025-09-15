'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Card, Input, Button, Badge, Stack } from '@mond-design-system/theme';

interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
}

const mockCommands = [
  { cmd: 'help', response: 'Available commands: status, scan, users, deploy, logs, clear' },
  { cmd: 'status', response: 'System Status: ONLINE | CPU: 73.2% | RAM: 45.8% | Network: 892.1 KB/s' },
  { cmd: 'scan', response: 'Security scan initiated... 3 vulnerabilities found. Check /var/log/security.log' },
  { cmd: 'users', response: 'Active users: admin@cypher.sys, dev@localhost, root@matrix.net' },
  { cmd: 'deploy', response: 'Deployment pipeline started. Build #247 queued for production.' },
  { cmd: 'logs', response: 'Tailing system logs...\n[INFO] Authentication successful\n[WARN] High CPU usage detected\n[ERROR] Connection timeout to cdn.neural.io' },
];

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'system',
      content: 'CYPHER Terminal v2.1.7 initialized'
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'system',
      content: 'Neural interface connected. Type "help" for available commands.'
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      content
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command line
    addLine('command', `cypher@matrix:~$ ${command}`);
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setLines([]);
      setIsProcessing(false);
      return;
    }

    const mockCommand = mockCommands.find(c => c.cmd === cmd);
    
    if (mockCommand) {
      addLine('output', mockCommand.response);
    } else if (cmd.startsWith('echo ')) {
      addLine('output', command.slice(5));
    } else {
      addLine('error', `Command not found: ${command}. Type "help" for available commands.`);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isProcessing) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  const getLineColorToken = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'brand.interactive.background';
      case 'output': return 'text.primary';
      case 'error': return 'text.error';
      case 'system': return 'text.accent';
      default: return 'text.primary';
    }
  };

  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'system': return '[SYS]';
      case 'error': return '[ERR]';
      case 'output': return '';
      case 'command': return '';
      default: return '';
    }
  };

  return (
    <Box
      bg="surface.background"
      p="2xl"
      maxWidth="1280px"
      mx="auto"
    >
      <Stack gap="xl">
        {/* Terminal Header */}
        <Stack direction="horizontal" justify="between" align="center" mb="2xl">
          <Stack gap="xs">
            <Text 
              variant="body-lg" 
              weight="bold" 
              color="brand.interactive.background"
              fontFamily="mono"
            >
              NEURAL TERMINAL INTERFACE
            </Text>
            <Text variant="body-sm" color="text.accent">
              Direct system access • Elevated privileges • Encrypted session
            </Text>
          </Stack>
          <Stack direction="horizontal" gap="lg">
            <Badge variant="success">
              CONNECTED
            </Badge>
            <Badge variant="primary">
              ROOT ACCESS
            </Badge>
          </Stack>
        </Stack>

        {/* Terminal Window */}
        <Card bg="surface.overlay" borderColor="brand.interactive.background" p="none" overflow="hidden">
          {/* Terminal Header Bar */}
          <Stack direction="horizontal" align="center" justify="between" p="lg" bg="surface.secondary" borderBottom="1px solid" borderColor="brand.interactive.background">
            <Stack direction="horizontal" gap="sm">
              <Box width="12px" height="12px" borderRadius="50%" bg="text.error" />
              <Box width="12px" height="12px" borderRadius="50%" bg="text.warning" />
              <Box width="12px" height="12px" borderRadius="50%" bg="brand.interactive.background" />
            </Stack>
            <Text variant="caption" color="text.accent" fontFamily="mono">
              terminal.cypher.sys
            </Text>
            <Stack direction="horizontal" gap="sm">
              <Button 
                size="sm" 
                 
                onClick={() => setLines([])}
              >
                CLEAR
              </Button>
            </Stack>
          </Stack>

          {/* Terminal Content */}
          <Box 
            ref={terminalRef}
            height="500px"
            p="xl"
            fontFamily="mono"
            fontSize="sm"
            lineHeight="1.5"
            overflowY="auto"
            bg="surface.background"
          >
            {/* Terminal Lines */}
            {lines.map((line) => (
              <Box key={line.id} mb="xs">
                <Text color={getLineColorToken(line.type)}>
                  {getLinePrefix(line.type) && (
                    <Box as="span" mr="sm" opacity="0.7">
                      {getLinePrefix(line.type)}
                    </Box>
                  )}
                  {line.content}
                </Text>
              </Box>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <Box mb="xs">
                <Text color="text.accent">
                  Processing...
                  <Box as="span" ml="sm">█</Box>
                </Text>
              </Box>
            )}

            {/* Current Input Line */}
            <Stack direction="horizontal" align="center" mt="sm">
              <Text color="brand.interactive.background" mr="sm">
                cypher@matrix:~$
              </Text>
              <Box as="form" onSubmit={handleSubmit} flex="1">
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  disabled={isProcessing}
                  
                  placeholder={isProcessing ? "Processing..." : "Enter command..."}
                />
              </Box>
              <Text color="brand.interactive.background" ml="xs">
                █
              </Text>
            </Stack>
          </Box>
        </Card>

        {/* Command Help */}
        <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
          <Text weight="bold" color="brand.interactive.background" mb="lg">
            AVAILABLE COMMANDS
          </Text>
          <Box 
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap="lg"
            fontSize="sm"
            fontFamily="mono"
          >
            {mockCommands.map((cmd, index) => (
              <Stack key={index} direction="horizontal" gap="sm">
                <Text color="text.accent" minWidth="60px">{cmd.cmd}</Text>
                <Text color="text.secondary">{cmd.response.split('.')[0]}...</Text>
              </Stack>
            ))}
            <Stack direction="horizontal" gap="sm">
              <Text color="text.accent" minWidth="60px">clear</Text>
              <Text color="text.secondary">Clear terminal output</Text>
            </Stack>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}