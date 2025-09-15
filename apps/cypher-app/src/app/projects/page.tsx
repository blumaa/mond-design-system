'use client';
import React, { useState } from 'react';
import { Box, Text, Card, Stack, Badge, Button, Input } from '@mond-design-system/theme';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  status: 'modified' | 'staged' | 'committed' | 'conflict';
  children?: FileNode[];
  isExpanded?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'critical' | 'maintenance';
  lastCommit: string;
  branch: string;
  contributors: number;
  files: FileNode[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'neural-interface',
    description: 'Core neural network interface for system control',
    status: 'active',
    lastCommit: '2 hours ago',
    branch: 'feature/neural-enhancement',
    contributors: 3,
    files: [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        modified: '2 hours ago',
        status: 'modified',
        isExpanded: true,
        children: [
          { id: '2', name: 'components', type: 'folder', modified: '1 day ago', status: 'committed' },
          { id: '3', name: 'neural.ts', type: 'file', size: '12.4 KB', modified: '2 hours ago', status: 'modified' },
          { id: '4', name: 'interface.tsx', type: 'file', size: '8.7 KB', modified: '3 hours ago', status: 'staged' },
          { id: '5', name: 'config.json', type: 'file', size: '2.1 KB', modified: '1 day ago', status: 'conflict' }
        ]
      },
      { id: '6', name: 'README.md', type: 'file', size: '4.2 KB', modified: '1 week ago', status: 'committed' },
      { id: '7', name: 'package.json', type: 'file', size: '1.8 KB', modified: '2 days ago', status: 'committed' }
    ]
  },
  {
    id: '2',
    name: 'security-core',
    description: 'Advanced security protocols and encryption systems',
    status: 'critical',
    lastCommit: '10 minutes ago',
    branch: 'hotfix/security-patch',
    contributors: 2,
    files: [
      {
        id: '8',
        name: 'security',
        type: 'folder',
        modified: '10 minutes ago',
        status: 'modified',
        isExpanded: false,
        children: []
      },
      { id: '9', name: 'auth.ts', type: 'file', size: '15.2 KB', modified: '10 minutes ago', status: 'staged' },
      { id: '10', name: 'encryption.ts', type: 'file', size: '9.8 KB', modified: '1 hour ago', status: 'modified' }
    ]
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFolder = (nodeId: string) => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId && node.type === 'folder') {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };

    setSelectedProject(prev => ({
      ...prev,
      files: toggleNode(prev.files)
    }));
  };


  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return node.isExpanded ? '📂' : '📁';
    }
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': case 'tsx': return '📘';
      case 'js': case 'jsx': return '📙';
      case 'json': return '⚙️';
      case 'md': return '📄';
      case 'css': case 'scss': return '🎨';
      default: return '📄';
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <Box key={node.id}>
        <Stack
          direction="horizontal"
          align="center"
          p="sm"
          pl={`${0.75 + depth * 1.5}rem`}
          cursor="pointer"
          bg={selectedFile?.id === node.id ? 'surface.secondary' : 'transparent'}
          borderLeft={selectedFile?.id === node.id ? '3px solid' : '3px solid transparent'}
          borderColor={selectedFile?.id === node.id ? 'brand.interactive.background' : 'transparent'}
          fontSize="sm"
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node);
            }
          }}
        >
          <Text mr="sm">
            {getFileIcon(node)}
          </Text>
          <Text color="text.primary" flex="1">
            {node.name}
          </Text>
          {node.size && (
            <Text variant="caption" color="text.secondary" mr="sm">
              {node.size}
            </Text>
          )}
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            bg="text.secondary"
          />
        </Stack>
        {node.isExpanded && node.children && renderFileTree(node.children, depth + 1)}
      </Box>
    ));
  };

  return (
    <Box
      bg="surface.background"
      p="2xl"
      maxWidth="1280px"
      mx="auto"
    >
      <Stack gap="xl">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <Stack gap="xs">
            <Text 
              variant="body-lg" 
              weight="bold" 
              color="brand.interactive.background"
              fontFamily="mono"
            >
              PROJECT REPOSITORY
            </Text>
            <Text variant="body-sm" color="text.accent">
              Source code management • Version control • File system access
            </Text>
          </Stack>
          <Stack direction="horizontal" gap="lg">
            <Button variant="outline">
              CLONE REPO
            </Button>
            <Button variant="primary">
              COMMIT CHANGES
            </Button>
          </Stack>
        </Stack>

        {/* Project Selector */}
        <Box 
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap="lg"
        >
          {mockProjects.map((project) => (
            <Card 
              key={project.id}
              bg={selectedProject.id === project.id ? 'surface.secondary' : 'surface.secondary'}
              borderColor={selectedProject.id === project.id ? 'brand.interactive.background' : 'border.default'}
              p="lg"
              cursor="pointer"
              onClick={() => setSelectedProject(project)}
            >
              <Stack direction="horizontal" justify="between" align="start" mb="sm">
                <Text weight="bold" color="text.primary" fontFamily="mono">
                  {project.name}
                </Text>
                <Badge 
                  variant={project.status === 'active' ? 'success' : 
                          project.status === 'critical' ? 'error' : 'default'}
                >
                  {project.status.toUpperCase()}
                </Badge>
              </Stack>
              <Text variant="body-sm" color="text.secondary" mb="lg">
                {project.description}
              </Text>
              <Stack direction="horizontal" justify="between" align="center">
                <Stack direction="horizontal" gap="sm">
                  <Text variant="caption" color="text.accent">
                    {project.branch}
                  </Text>
                  <Text variant="caption" color="text.secondary">
                    • {project.contributors} contributors
                  </Text>
                </Stack>
                <Text variant="caption" color="text.secondary">
                  {project.lastCommit}
                </Text>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* Main Content */}
        <Box 
          display="grid"
          gridTemplateColumns="1fr 2fr"
          gap="2xl"
          height="600px"
        >
          {/* File Tree */}
          <Card bg="surface.secondary" borderColor="brand.interactive.background" p="none" overflow="hidden">
            {/* File Tree Header */}
            <Box p="xl" borderBottom="1px solid" borderColor="brand.interactive.background" bg="surface.secondary">
              <Stack direction="horizontal" justify="between" align="center" mb="lg">
                <Text weight="bold" color="brand.interactive.background">
                  FILE EXPLORER
                </Text>
                <Text variant="caption" color="text.secondary" fontFamily="mono">
                  {selectedProject.name}
                </Text>
              </Stack>
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                
              />
            </Box>

            {/* File Tree Content */}
            <Box 
              height="450px"
              overflowY="auto"
              fontFamily="mono"
            >
              {renderFileTree(selectedProject.files)}
            </Box>
          </Card>

          {/* File Content */}
          <Card bg="surface.overlay" borderColor="brand.interactive.background" p="none" overflow="hidden">
            {/* File Header */}
            <Box p="xl" borderBottom="1px solid" borderColor="brand.interactive.background" bg="surface.secondary">
              <Stack direction="horizontal" justify="between" align="center">
                <Stack gap="sm">
                  <Text weight="bold" color="brand.interactive.background">
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </Text>
                  {selectedFile && (
                    <Stack direction="horizontal" gap="lg">
                      <Text variant="caption" color="text.secondary">
                        {selectedFile.size} • Modified {selectedFile.modified}
                      </Text>
                      <Badge 
                        variant={selectedFile.status === 'conflict' ? 'error' : 
                                selectedFile.status === 'staged' ? 'success' :
                                selectedFile.status === 'modified' ? 'warning' : 'default'}
                      >
                        {selectedFile.status.toUpperCase()}
                      </Badge>
                    </Stack>
                  )}
                </Stack>
                {selectedFile && (
                  <Stack direction="horizontal" gap="sm">
                    <Button variant="outline">
                      EDIT
                    </Button>
                    <Button variant="outline">
                      STAGE
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* File Content */}
            <Box 
              height="450px"
              p="xl"
              fontFamily="mono"
              fontSize="sm"
              lineHeight="1.5"
              overflowY="auto"
              bg="surface.background"
            >
              {selectedFile ? (
                <Box>
                  {selectedFile.name.endsWith('.ts') ? (
                    <>
                      <Text color="text.error">import</Text>
                      <Text color="text.primary"> {"{"} useState, useEffect {"}"} </Text>
                      <Text color="text.error">from</Text>
                      <Text color="brand.interactive.background"> 'react'</Text>
                      <Text color="text.primary">;</Text>
                      <br /><br />
                      <Text color="text.error">interface</Text>
                      <Text color="text.accent"> NeuralConnection </Text>
                      <Text color="text.primary">{"{"}</Text>
                      <br />
                      <Text color="text.primary">  id: </Text>
                      <Text color="text.error">string</Text>
                      <Text color="text.primary">;</Text>
                      <br />
                      <Text color="text.primary">  status: </Text>
                      <Text color="brand.interactive.background">'connected'</Text>
                      <Text color="text.primary"> | </Text>
                      <Text color="brand.interactive.background">'disconnected'</Text>
                      <Text color="text.primary">;</Text>
                      <br />
                      <Text color="text.primary">{"}"}</Text>
                      <br /><br />
                      <Text color="text.error">export</Text>
                      <Text color="text.primary"> </Text>
                      <Text color="text.error">function</Text>
                      <Text color="text.accent"> initializeNeural</Text>
                      <Text color="text.primary">(</Text>
                      <Text color="text.warning">config</Text>
                      <Text color="text.primary">: </Text>
                      <Text color="text.accent">NeuralConfig</Text>
                      <Text color="text.primary">) {"{"}</Text>
                      <br />
                      <Text color="text.secondary">  {`// Neural interface initialization`}</Text>
                      <br />
                      <Text color="text.primary">  console.log(</Text>
                      <Text color="brand.interactive.background">'Initializing neural connection...'</Text>
                      <Text color="text.primary">);</Text>
                      <br />
                      <Text color="text.primary">{"}"}</Text>
                    </>
                  ) : selectedFile.name.endsWith('.json') ? (
                    <>
                      <Text color="text.primary">{"{"}</Text>
                      <br />
                      <Text color="text.accent">  "name"</Text>
                      <Text color="text.primary">: </Text>
                      <Text color="brand.interactive.background">"neural-interface"</Text>
                      <Text color="text.primary">,</Text>
                      <br />
                      <Text color="text.accent">  "version"</Text>
                      <Text color="text.primary">: </Text>
                      <Text color="brand.interactive.background">"2.1.7"</Text>
                      <Text color="text.primary">,</Text>
                      <br />
                      <Text color="text.accent">  "neural_config"</Text>
                      <Text color="text.primary">: {"{"}</Text>
                      <br />
                      <Text color="text.accent">    "security_level"</Text>
                      <Text color="text.primary">: </Text>
                      <Text color="text.warning">9</Text>
                      <Text color="text.primary">,</Text>
                      <br />
                      <Text color="text.accent">    "encryption"</Text>
                      <Text color="text.primary">: </Text>
                      <Text color="brand.interactive.background">"quantum"</Text>
                      <br />
                      <Text color="text.primary">  {"}"}</Text>
                      <br />
                      <Text color="text.primary">{"}"}</Text>
                    </>
                  ) : (
                    <>
                      <Text color="brand.interactive.background"># Neural Interface</Text>
                      <br /><br />
                      <Text color="text.primary">Advanced neural network interface for cyberpunk system control.</Text>
                      <br /><br />
                      <Text color="text.accent">## Features</Text>
                      <br /><br />
                      <Text color="text.primary">- Real-time neural connection monitoring</Text>
                      <br />
                      <Text color="text.primary">- Quantum encryption protocols</Text>
                      <br />
                      <Text color="text.primary">- Matrix integration capabilities</Text>
                      <br />
                      <Text color="text.primary">- AI-powered threat detection</Text>
                    </>
                  )}
                </Box>
              ) : (
                <Stack 
                  align="center" 
                  justify="center"
                  height="100%"
                  textAlign="center"
                >
                  <Stack gap="lg">
                    <Text color="text.secondary" fontSize="3rem">
                      📄
                    </Text>
                    <Text variant="body-lg" color="text.secondary">
                      Select a file to view its contents
                    </Text>
                    <Text variant="body-sm" color="text.tertiary">
                      Click on any file in the explorer to open it
                    </Text>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}