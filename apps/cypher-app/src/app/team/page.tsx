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

  const getStatusVariant = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'critical': return 'error';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getAccessLevelVariant = (level: TeamMember['accessLevel']) => {
    switch (level) {
      case 'admin': return 'error';
      case 'developer': return 'success';
      case 'operator': return 'default';
      case 'guest': return 'default';
      default: return 'default';
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
      bg="surface.background"
      p="2xl"
      maxWidth="1280px"
      mx="auto"
    >
      <Stack spacing="xl">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <Box>
            <Text 
              variant="body-lg" 
              weight="bold" 
              color="brand.interactive.background"
              fontFamily="mono"
            >
              TEAM MANAGEMENT
            </Text>
            <Text variant="body-sm" color="text.accent">
              Neural network operatives • Access control • Status monitoring
            </Text>
          </Box>
          <Stack direction="horizontal" spacing="lg" align="center">
            <Badge 
              variant="success"
            >
              {filteredMembers.filter(m => m.status === 'online').length} ONLINE
            </Badge>
            <Badge 
              variant="warning"
            >
              {filteredMembers.filter(m => m.status === 'away').length} AWAY
            </Badge>
            <Badge 
              variant="error"
            >
              {filteredMembers.filter(m => m.status === 'critical').length} CRITICAL
            </Badge>
          </Stack>
        </Stack>

        {/* Filters */}
        <Card 
          bg="surface.elevated"
          borderColor="brand.interactive.background"
          p="xl"
        >
          <Box 
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap="lg"
            alignItems="end"
          >
            <Box>
              <Text variant="body-sm" color="brand.interactive.background" mb="sm">
                SEARCH OPERATIVES
              </Text>
              <Input
                placeholder="Name, handle, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                
              />
            </Box>
            <Box>
              <Text variant="body-sm" color="brand.interactive.background" mb="sm">
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
            <Stack direction="horizontal" align="center" gap="sm">
              <Switch 
                checked={showOffline}
                onChange={(e) => setShowOffline((e.target as HTMLInputElement).checked)}
              />
              <Text variant="body-sm" color="text.primary">
                Show offline operatives
              </Text>
            </Stack>
          </Box>
        </Card>

        {/* Team Grid */}
        <Box 
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))"
          gap="xl"
        >
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              bg="surface.elevated"
              p="xl"
            >
              <Stack gap={3}>
                {/* Member Header */}
                <Stack direction="horizontal" align="start" gap="lg">
                  <Avatar 
                    src="" 
                    alt={member.name} 
                    size="md"
                  />
                  <Box flex="1">
                    <Stack direction="horizontal" align="center" gap="sm" mb="xs">
                      <Text variant="body-lg" weight="bold" color="text.primary">
                        {member.name}
                      </Text>
                      <Text fontSize="sm">{getStatusIcon(member.status)}</Text>
                    </Stack>
                    <Text variant="body-sm" color="text.accent" fontFamily="mono">
                      {member.handle}
                    </Text>
                    <Text variant="caption" color="text.secondary">
                      {member.role} • {member.location}
                    </Text>
                  </Box>
                  <Badge 
                    variant={getAccessLevelVariant(member.accessLevel)}
                  >
                    {member.accessLevel.toUpperCase()}
                  </Badge>
                </Stack>

                <Divider />

                {/* Status & Last Seen */}
                <Stack direction="horizontal" justify="between" align="center">
                  <Box>
                    <Text variant="caption" color="text.secondary">STATUS</Text>
                    <Badge variant={getStatusVariant(member.status)}>
                      {member.status.toUpperCase()}
                    </Badge>
                  </Box>
                  <Box>
                    <Text variant="caption" color="text.secondary">LAST SEEN</Text>
                    <Text variant="body-sm" color="text.primary">
                      {member.lastSeen}
                    </Text>
                  </Box>
                </Stack>

                {/* Projects */}
                <Box>
                  <Text variant="caption" color="text.secondary" mb="sm">
                    ACTIVE PROJECTS
                  </Text>
                  <Stack direction="horizontal" gap="sm">
                    {member.projects.map((project, index) => (
                      <Tag 
                        key={index}
                         
                        semantic="info"
                      >
                        {project}
                      </Tag>
                    ))}
                  </Stack>
                </Box>

                {/* Skills */}
                <Box>
                  <Text variant="caption" color="text.secondary" mb="sm">
                    SKILLS
                  </Text>
                  <Stack direction="horizontal" gap="sm">
                    {member.skills.map((skill, index) => (
                      <Tag 
                        key={index}
                         
                        semantic="success"
                      >
                        {skill}
                      </Tag>
                    ))}
                  </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="horizontal" gap="sm" mt="sm">
                  <Button 
                    size="sm" 
                    
                  >
                    MESSAGE
                  </Button>
                  <Button 
                    size="sm" 
                    
                  >
                    PERMISSIONS
                  </Button>
                  <Button 
                    size="sm" 
                    
                  >
                    TRACK
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* No results */}
        {filteredMembers.length === 0 && (
          <Card 
            bg="surface.elevated"
            borderColor="border.error"
            p="3xl"
            textAlign="center"
          >
            <Text variant="body-lg" color="text.error" mb="sm">
              NO OPERATIVES FOUND
            </Text>
            <Text variant="body-sm" color="text.secondary">
              Adjust your search criteria or status filters to find team members.
            </Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}