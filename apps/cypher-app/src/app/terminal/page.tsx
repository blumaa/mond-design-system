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

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return '#00ff41';
      case 'output': return '#ffffff';
      case 'error': return '#ff0055';
      case 'system': return '#00d4ff';
      default: return '#ffffff';
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
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 100%)',
        padding: '2rem',
      }}
    >
      <Stack gap={4}>
        {/* Terminal Header */}
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <Box>
            <Text 
              variant="body-lg" 
              weight="bold" 
              style={{ 
                color: '#00ff41',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
                fontSize: '1.5rem'
              }}
            >
              NEURAL TERMINAL INTERFACE
            </Text>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              Direct system access • Elevated privileges • Encrypted session
            </Text>
          </Box>
          <Box style={{ display: 'flex', gap: '1rem' }}>
            <Badge 
              variant="success" 
              style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
            >
              CONNECTED
            </Badge>
            <Badge 
              variant="primary" 
              style={{ backgroundColor: '#00d4ff', color: '#0a0a0a' }}
            >
              ROOT ACCESS
            </Badge>
          </Box>
        </Box>

        {/* Terminal Window */}
        <Card style={{
          backgroundColor: 'rgba(10, 10, 11, 0.95)',
          border: '1px solid #00ff41',
          borderRadius: '8px',
          padding: 0,
          boxShadow: '0 0 30px rgba(0, 255, 65, 0.15)',
          overflow: 'hidden',
        }}>
          {/* Terminal Header Bar */}
          <Box style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(0, 255, 65, 0.1)',
            borderBottom: '1px solid #00ff41',
          }}>
            <Box style={{ display: 'flex', gap: '0.5rem' }}>
              <Box style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff0055' }} />
              <Box style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff9500' }} />
              <Box style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00ff41' }} />
            </Box>
            <Text variant="caption" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>
              terminal.cypher.sys
            </Text>
            <Box style={{ display: 'flex', gap: '0.5rem' }}>
              <Button 
                size="sm" 
                variant="ghost" 
                style={{ color: '#888', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => setLines([])}
              >
                CLEAR
              </Button>
            </Box>
          </Box>

          {/* Terminal Content */}
          <Box 
            ref={terminalRef}
            style={{
              height: '500px',
              padding: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflowY: 'auto',
              backgroundColor: '#0a0a0b',
            }}
          >
            {/* Terminal Lines */}
            {lines.map((line) => (
              <Box key={line.id} style={{ marginBottom: '0.25rem' }}>
                <Text style={{ color: getLineColor(line.type) }}>
                  {getLinePrefix(line.type) && (
                    <span style={{ marginRight: '0.5rem', opacity: 0.7 }}>
                      {getLinePrefix(line.type)}
                    </span>
                  )}
                  {line.content}
                </Text>
              </Box>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <Box style={{ marginBottom: '0.25rem' }}>
                <Text style={{ color: '#00d4ff' }}>
                  Processing...
                  <span style={{ animation: 'blink 1s infinite', marginLeft: '0.5rem' }}>█</span>
                </Text>
              </Box>
            )}

            {/* Current Input Line */}
            <Box style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <Text style={{ color: '#00ff41', marginRight: '0.5rem' }}>
                cypher@matrix:~$
              </Text>
              <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  disabled={isProcessing}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    padding: 0,
                    outline: 'none',
                  }}
                  placeholder={isProcessing ? "Processing..." : "Enter command..."}
                />
              </form>
              <Text style={{ 
                color: '#00ff41', 
                animation: 'blink 1s infinite',
                marginLeft: '0.25rem'
              }}>
                █
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Command Help */}
        <Card style={{
          backgroundColor: 'rgba(26, 26, 30, 0.8)',
          border: '1px solid #00ff41',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
        }}>
          <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
            AVAILABLE COMMANDS
          </Text>
          <Box style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}>
            {mockCommands.map((cmd, index) => (
              <Box key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                <Text style={{ color: '#00d4ff', minWidth: '60px' }}>{cmd.cmd}</Text>
                <Text style={{ color: '#888' }}>{cmd.response.split('.')[0]}...</Text>
              </Box>
            ))}
            <Box style={{ display: 'flex', gap: '0.5rem' }}>
              <Text style={{ color: '#00d4ff', minWidth: '60px' }}>clear</Text>
              <Text style={{ color: '#888' }}>Clear terminal output</Text>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}