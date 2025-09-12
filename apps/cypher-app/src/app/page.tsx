'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Text, Badge, Heading, Input, Select, Switch, Divider, Link, Avatar, Checkbox, Spinner, Tag } from '@mond-design-system/theme';
import { MatrixRain } from '../components/MatrixRain';

// Mock data for cyberpunk interface
const systemStats = {
  cpu: 73.2,
  memory: 45.8,
  network: 892.1,
  security: 'ENCRYPTED',
  uptime: '47:23:11'
};

const activeSessions = [
  { id: 'SX-001', user: 'admin@cypher.sys', location: 'Node-7', status: 'active' },
  { id: 'SX-002', user: 'dev@localhost', location: 'Terminal-3', status: 'idle' },
  { id: 'SX-003', user: 'root@matrix.net', location: 'Core-9', status: 'critical' },
];

export default function CypherDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  const [isScanning, setIsScanning] = useState(false);

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

  const startSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <Box 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 100%)',
        padding: '2rem',
        fontFamily: 'var(--font-jetbrains-mono)',
        position: 'relative',
      }}
    >
      {/* Matrix Rain Background Effect */}
      <MatrixRain 
        opacity={0.08}
        speed={80}
        fontSize={12}
        style={{ zIndex: 0 }}
      />
      {/* Terminal Header */}
      <Stack gap={4} style={{ position: 'relative', zIndex: 1 }}>
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
              CYPHER.SYS v2.1.7
            </Heading>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              NEURAL INTERFACE ACTIVE // UTC: {currentTime}
            </Text>
          </Box>
          <Badge 
            variant="success" 
            style={{
              backgroundColor: '#00ff41',
              color: '#0a0a0a',
              boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)'
            }}
          >
            SYSTEM ONLINE
          </Badge>
        </Box>

        {/* System Monitoring Grid */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* System Stats */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              SYSTEM METRICS
            </Text>
            <Stack gap={2}>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff' }}>CPU Load:</Text>
                <Text style={{ color: '#00d4ff' }}>{systemStats.cpu}%</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff' }}>Memory:</Text>
                <Text style={{ color: '#00d4ff' }}>{systemStats.memory}%</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff' }}>Network:</Text>
                <Text style={{ color: '#00d4ff' }}>{systemStats.network} KB/s</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff' }}>Security:</Text>
                <Badge variant="success" style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}>
                  {systemStats.security}
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff' }}>Uptime:</Text>
                <Text style={{ color: '#00d4ff' }}>{systemStats.uptime}</Text>
              </Box>
            </Stack>
          </Card>

          {/* Active Sessions */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              ACTIVE SESSIONS
            </Text>
            <Stack gap={3}>
              {activeSessions.map((session) => (
                <Box key={session.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  border: session.status === 'critical' ? '1px solid #ff0055' : '1px solid rgba(0, 255, 65, 0.2)',
                }}>
                  <Box>
                    <Text variant="body-sm" style={{ color: '#00d4ff' }}>{session.id}</Text>
                    <Text variant="caption" style={{ color: '#ffffff' }}>{session.user}</Text>
                    <Text variant="caption" style={{ color: '#888' }}>{session.location}</Text>
                  </Box>
                  <Badge 
                    variant={session.status === 'critical' ? 'error' : session.status === 'active' ? 'success' : 'default'}
                    style={{
                      backgroundColor: session.status === 'critical' ? '#ff0055' : session.status === 'active' ? '#00ff41' : '#666',
                      color: '#0a0a0a'
                    }}
                  >
                    {session.status.toUpperCase()}
                  </Badge>
                </Box>
              ))}
            </Stack>
          </Card>

          {/* Security Controls */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              SECURITY CONTROLS
            </Text>
            <Stack gap={3}>
              <Button 
                variant="primary"
                onClick={startSecurityScan}
                disabled={isScanning}
                style={{
                  backgroundColor: '#00ff41',
                  color: '#0a0a0a',
                  border: 'none',
                  boxShadow: isScanning ? '0 0 25px rgba(0, 255, 65, 0.6)' : '0 0 15px rgba(0, 255, 65, 0.3)',
                  animation: isScanning ? 'pulse 1s infinite' : 'none',
                }}
              >
                {isScanning ? 'SCANNING...' : 'RUN SECURITY SCAN'}
              </Button>
              <Button 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#00d4ff',
                  border: '1px solid #00d4ff',
                }}
              >
                FIREWALL CONFIG
              </Button>
              <Button 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ff0055',
                  border: '1px solid #ff0055',
                }}
              >
                EMERGENCY SHUTDOWN
              </Button>
            </Stack>
          </Card>

          {/* Terminal Output */}
          <Card style={{
            backgroundColor: 'rgba(10, 10, 11, 0.95)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
            gridColumn: 'span 2',
            minHeight: '200px',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              TERMINAL OUTPUT
            </Text>
            <Box style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.4',
              color: '#00d4ff',
              whiteSpace: 'pre-wrap',
            }}>
              <Text style={{ color: '#00ff41' }}>cypher@matrix:~$ </Text>
              <Text style={{ color: '#ffffff' }}>system-monitor --live</Text>
              {'\n'}
              <Text style={{ color: '#888' }}>[2024-01-15 23:47:32] </Text>
              <Text style={{ color: '#00d4ff' }}>Initializing neural interface...</Text>
              {'\n'}
              <Text style={{ color: '#888' }}>[2024-01-15 23:47:33] </Text>
              <Text style={{ color: '#00ff41' }}>Connection established to mainframe</Text>
              {'\n'}
              <Text style={{ color: '#888' }}>[2024-01-15 23:47:34] </Text>
              <Text style={{ color: '#ffffff' }}>Monitoring 3 active sessions</Text>
              {'\n'}
              <Text style={{ color: '#888' }}>[2024-01-15 23:47:35] </Text>
              <Text style={{ color: isScanning ? '#ff0055' : '#888' }}>
                {isScanning ? 'Security scan in progress...' : 'System idle - awaiting commands'}
              </Text>
              {'\n'}
              <Text style={{ color: '#00ff41', animation: 'blink 1s infinite' }}>█</Text>
            </Box>
          </Card>

          {/* Developer Tools */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              DEVELOPER TOOLS
            </Text>
            <Stack gap={3}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Text style={{ color: '#ffffff', minWidth: '100px' }}>Auto-Deploy:</Text>
                <Switch />
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Text style={{ color: '#ffffff', minWidth: '100px' }}>Git Branch:</Text>
                <Box style={{ minWidth: '150px' }}>
                  <Select 
                    options={[
                      { value: 'main', label: 'main' },
                      { value: 'develop', label: 'develop' },
                      { value: 'feature/auth', label: 'feature/auth' }
                    ]}
                    placeholder="Select branch..."
                  />
                </Box>
              </Box>
              <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
              <Input
                placeholder="Search repositories..."
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ff41',
                  color: '#ffffff'
                }}
              />
            </Stack>
          </Card>

          {/* System Users */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
              SYSTEM USERS
            </Text>
            <Stack gap={3}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar src="" alt="Admin" size="sm" style={{ backgroundColor: '#00ff41' }} />
                <Box style={{ flex: 1 }}>
                  <Text variant="body-sm" style={{ color: '#ffffff' }}>admin@cypher.sys</Text>
                  <Box style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Tag variant="filled" semantic="success" style={{ backgroundColor: '#00ff41', color: '#0a0a0a', fontSize: '0.75rem' }}>
                      ROOT
                    </Tag>
                    <Tag variant="filled" semantic="info" style={{ backgroundColor: '#00d4ff', color: '#0a0a0a', fontSize: '0.75rem' }}>
                      ACTIVE
                    </Tag>
                  </Box>
                </Box>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar src="" alt="Dev" size="sm" style={{ backgroundColor: '#00d4ff' }} />
                <Box style={{ flex: 1 }}>
                  <Text variant="body-sm" style={{ color: '#ffffff' }}>dev@localhost</Text>
                  <Box style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Tag variant="filled" semantic="default" style={{ backgroundColor: '#666', color: '#ffffff', fontSize: '0.75rem' }}>
                      USER
                    </Tag>
                    <Tag variant="filled" semantic="warning" style={{ backgroundColor: '#ff9500', color: '#0a0a0a', fontSize: '0.75rem' }}>
                      IDLE
                    </Tag>
                  </Box>
                </Box>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar src="" alt="Ghost" size="sm" style={{ backgroundColor: '#ff0055' }} />
                <Box style={{ flex: 1 }}>
                  <Text variant="body-sm" style={{ color: '#ffffff' }}>root@matrix.net</Text>
                  <Box style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Tag variant="filled" semantic="error" style={{ backgroundColor: '#ff0055', color: '#ffffff', fontSize: '0.75rem' }}>
                      UNKNOWN
                    </Tag>
                    <Tag variant="filled" semantic="error" style={{ backgroundColor: '#ff0055', color: '#ffffff', fontSize: '0.75rem' }}>
                      CRITICAL
                    </Tag>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Card>

          {/* Network Status */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
          }}>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Text weight="bold" style={{ color: '#00ff41' }}>
                NETWORK STATUS
              </Text>
              <Spinner size="sm" style={{ color: '#00ff41' }} />
            </Box>
            <Stack gap={2}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="#" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  api.cypher.dev
                </Link>
                <Badge variant="success" style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}>
                  ONLINE
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="#" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  db.matrix.net
                </Link>
                <Badge variant="warning" style={{ backgroundColor: '#ff9500', color: '#0a0a0a' }}>
                  SLOW
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="#" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  cdn.neural.io
                </Link>
                <Badge variant="error" style={{ backgroundColor: '#ff0055', color: '#ffffff' }}>
                  DOWN
                </Badge>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Checkbox 
                  id="auto-reconnect" 
                  style={{ 
                    accentColor: '#00ff41',
                    transform: 'scale(0.9)'
                  }} 
                />
                <Text variant="caption" style={{ color: '#888' }}>Auto-reconnect failed endpoints</Text>
              </Box>
            </Stack>
          </Card>
        </Box>
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