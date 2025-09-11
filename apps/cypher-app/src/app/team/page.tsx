'use client';
import React, { useState } from 'react';
import { Box, Text, Card, Stack, Avatar, Badge, Button, Input, Select, Tag, Divider, Switch } from '@mond-design-system/theme';

interface TeamMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  status: 'online' | 'away' | 'offline' | 'critical';
  location: string;
  accessLevel: 'admin' | 'developer' | 'operator' | 'guest';
  lastSeen: string;
  projects: string[];
  skills: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Matrix',
    handle: 'admin@cypher.sys',
    role: 'System Administrator',
    status: 'online',
    location: 'Node-7',
    accessLevel: 'admin',
    lastSeen: 'Now',
    projects: ['Neural Interface', 'Security Core', 'Data Mining'],
    skills: ['Linux', 'Docker', 'Kubernetes', 'Security']
  },
  {
    id: '2',
    name: 'Zero Cool',
    handle: 'dev@localhost',
    role: 'Lead Developer',
    status: 'away',
    location: 'Terminal-3',
    accessLevel: 'developer',
    lastSeen: '5 min ago',
    projects: ['API Gateway', 'Frontend UI', 'Database'],
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis']
  },
  {
    id: '3',
    name: 'Ghost Protocol',
    handle: 'root@matrix.net',
    role: 'Security Analyst',
    status: 'critical',
    location: 'Core-9',
    accessLevel: 'operator',
    lastSeen: '2 hours ago',
    projects: ['Firewall Config', 'Threat Detection'],
    skills: ['Cybersecurity', 'Monitoring', 'Incident Response']
  },
  {
    id: '4',
    name: 'Cipher Jane',
    handle: 'jane@neural.io',
    role: 'Data Scientist',
    status: 'offline',
    location: 'Remote',
    accessLevel: 'developer',
    lastSeen: '1 day ago',
    projects: ['ML Pipeline', 'Analytics Dashboard'],
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Statistics']
  }
];

export default function Team() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOffline, setShowOffline] = useState(true);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesOffline = showOffline || member.status !== 'offline';
    
    return matchesSearch && matchesStatus && matchesOffline;
  });

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return '#00ff41';
      case 'away': return '#ff9500';
      case 'critical': return '#ff0055';
      case 'offline': return '#666';
      default: return '#666';
    }
  };

  const getAccessLevelColor = (level: TeamMember['accessLevel']) => {
    switch (level) {
      case 'admin': return '#ff0055';
      case 'developer': return '#00ff41';
      case 'operator': return '#00d4ff';
      case 'guest': return '#888';
      default: return '#888';
    }
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'critical': return '🔴';
      case 'offline': return '⚫';
      default: return '⚫';
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
        {/* Header */}
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              TEAM MANAGEMENT
            </Text>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              Neural network operatives • Access control • Status monitoring
            </Text>
          </Box>
          <Box style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Badge 
              variant="success" 
              style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
            >
              {filteredMembers.filter(m => m.status === 'online').length} ONLINE
            </Badge>
            <Badge 
              variant="warning" 
              style={{ backgroundColor: '#ff9500', color: '#0a0a0a' }}
            >
              {filteredMembers.filter(m => m.status === 'away').length} AWAY
            </Badge>
            <Badge 
              variant="error" 
              style={{ backgroundColor: '#ff0055', color: '#ffffff' }}
            >
              {filteredMembers.filter(m => m.status === 'critical').length} CRITICAL
            </Badge>
          </Box>
        </Box>

        {/* Filters */}
        <Card style={{
          backgroundColor: 'rgba(26, 26, 30, 0.8)',
          border: '1px solid #00ff41',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
        }}>
          <Box style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
          }}>
            <Box>
              <Text variant="body-sm" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
                SEARCH OPERATIVES
              </Text>
              <Input
                placeholder="Name, handle, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ff41',
                  color: '#ffffff'
                }}
              />
            </Box>
            <Box>
              <Text variant="body-sm" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
                STATUS FILTER
              </Text>
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'online', label: 'Online' },
                  { value: 'away', label: 'Away' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'offline', label: 'Offline' }
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                placeholder="Select status..."
              />
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Switch 
                checked={showOffline}
                onChange={(e) => setShowOffline((e.target as HTMLInputElement).checked)}
              />
              <Text variant="body-sm" style={{ color: '#ffffff' }}>
                Show offline operatives
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Team Grid */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredMembers.map((member) => (
            <Card key={member.id} style={{
              backgroundColor: 'rgba(26, 26, 30, 0.8)',
              border: `1px solid ${getStatusColor(member.status)}`,
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: `0 0 20px ${getStatusColor(member.status)}20`,
              transition: 'all 150ms ease',
            }}>
              <Stack gap={3}>
                {/* Member Header */}
                <Box style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <Avatar 
                    src="" 
                    alt={member.name} 
                    size="md" 
                    style={{ 
                      backgroundColor: getStatusColor(member.status),
                      color: member.status === 'offline' ? '#fff' : '#0a0a0a',
                      position: 'relative'
                    }} 
                  />
                  <Box style={{ flex: 1 }}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Text variant="body-lg" weight="bold" style={{ color: '#ffffff' }}>
                        {member.name}
                      </Text>
                      <span style={{ fontSize: '0.875rem' }}>{getStatusIcon(member.status)}</span>
                    </Box>
                    <Text variant="body-sm" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>
                      {member.handle}
                    </Text>
                    <Text variant="caption" style={{ color: '#888' }}>
                      {member.role} • {member.location}
                    </Text>
                  </Box>
                  <Badge 
                    style={{
                      backgroundColor: getAccessLevelColor(member.accessLevel),
                      color: member.accessLevel === 'guest' ? '#ffffff' : '#0a0a0a',
                      fontSize: '0.75rem',
                    }}
                  >
                    {member.accessLevel.toUpperCase()}
                  </Badge>
                </Box>

                <Divider style={{ borderColor: getStatusColor(member.status), opacity: 0.3 }} />

                {/* Status & Last Seen */}
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Text variant="caption" style={{ color: '#888' }}>STATUS</Text>
                    <Text variant="body-sm" weight="bold" style={{ color: getStatusColor(member.status) }}>
                      {member.status.toUpperCase()}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="caption" style={{ color: '#888' }}>LAST SEEN</Text>
                    <Text variant="body-sm" style={{ color: '#ffffff' }}>
                      {member.lastSeen}
                    </Text>
                  </Box>
                </Box>

                {/* Projects */}
                <Box>
                  <Text variant="caption" style={{ color: '#888', marginBottom: '0.5rem' }}>
                    ACTIVE PROJECTS
                  </Text>
                  <Box style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {member.projects.map((project, index) => (
                      <Tag 
                        key={index}
                        variant="filled" 
                        semantic="info"
                        style={{ 
                          backgroundColor: 'rgba(0, 212, 255, 0.2)',
                          color: '#00d4ff',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(0, 212, 255, 0.3)'
                        }}
                      >
                        {project}
                      </Tag>
                    ))}
                  </Box>
                </Box>

                {/* Skills */}
                <Box>
                  <Text variant="caption" style={{ color: '#888', marginBottom: '0.5rem' }}>
                    SKILLS
                  </Text>
                  <Box style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {member.skills.map((skill, index) => (
                      <Tag 
                        key={index}
                        variant="filled" 
                        semantic="success"
                        style={{ 
                          backgroundColor: 'rgba(0, 255, 65, 0.1)',
                          color: '#00ff41',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(0, 255, 65, 0.3)'
                        }}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </Box>
                </Box>

                {/* Actions */}
                <Box style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00d4ff',
                      border: '1px solid #00d4ff',
                      fontSize: '0.75rem'
                    }}
                  >
                    MESSAGE
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00ff41',
                      border: '1px solid #00ff41',
                      fontSize: '0.75rem'
                    }}
                  >
                    PERMISSIONS
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ff9500',
                      border: '1px solid #ff9500',
                      fontSize: '0.75rem'
                    }}
                  >
                    TRACK
                  </Button>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* No results */}
        {filteredMembers.length === 0 && (
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #ff0055',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <Text variant="body-lg" style={{ color: '#ff0055', marginBottom: '0.5rem' }}>
              NO OPERATIVES FOUND
            </Text>
            <Text variant="body-sm" style={{ color: '#888' }}>
              Adjust your search criteria or status filters to find team members.
            </Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}