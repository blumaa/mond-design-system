'use client';
import React, { useState } from 'react';
import { Box, Text, Card, Stack, Badge, Button, Input, Tag, Divider } from '@mond-design-system/theme';

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

  const getStatusColor = (status: FileNode['status']) => {
    switch (status) {
      case 'modified': return '#ff9500';
      case 'staged': return '#00ff41';
      case 'committed': return '#00d4ff';
      case 'conflict': return '#ff0055';
      default: return '#666';
    }
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
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.375rem 0.75rem',
            paddingLeft: `${0.75 + depth * 1.5}rem`,
            cursor: 'pointer',
            backgroundColor: selectedFile?.id === node.id ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
            borderLeft: selectedFile?.id === node.id ? '3px solid #00ff41' : '3px solid transparent',
            transition: 'all 150ms ease',
            fontSize: '0.875rem',
          }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node);
            }
          }}
        >
          <Text style={{ marginRight: '0.5rem' }}>
            {getFileIcon(node)}
          </Text>
          <Text style={{ color: '#ffffff', flex: 1 }}>
            {node.name}
          </Text>
          {node.size && (
            <Text variant="caption" style={{ color: '#888', marginRight: '0.5rem' }}>
              {node.size}
            </Text>
          )}
          <Box
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(node.status),
            }}
          />
        </Box>
        {node.isExpanded && node.children && renderFileTree(node.children, depth + 1)}
      </Box>
    ));
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
              PROJECT REPOSITORY
            </Text>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              Source code management • Version control • File system access
            </Text>
          </Box>
          <Box style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              variant="outline"
              style={{
                backgroundColor: 'transparent',
                color: '#00d4ff',
                border: '1px solid #00d4ff',
              }}
            >
              CLONE REPO
            </Button>
            <Button 
              style={{
                backgroundColor: '#00ff41',
                color: '#0a0a0a',
                border: 'none',
              }}
            >
              COMMIT CHANGES
            </Button>
          </Box>
        </Box>

        {/* Project Selector */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          {mockProjects.map((project) => (
            <Card 
              key={project.id}
              style={{
                backgroundColor: selectedProject.id === project.id 
                  ? 'rgba(0, 255, 65, 0.1)' 
                  : 'rgba(26, 26, 30, 0.8)',
                border: selectedProject.id === project.id 
                  ? '1px solid #00ff41' 
                  : '1px solid #333',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onClick={() => setSelectedProject(project)}
            >
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <Text weight="bold" style={{ color: '#ffffff', fontFamily: 'monospace' }}>
                  {project.name}
                </Text>
                <Badge 
                  style={{
                    backgroundColor: project.status === 'active' ? '#00ff41' :
                                    project.status === 'critical' ? '#ff0055' : '#666',
                    color: project.status === 'archived' ? '#ffffff' : '#0a0a0a',
                  }}
                >
                  {project.status.toUpperCase()}
                </Badge>
              </Box>
              <Text variant="body-sm" style={{ color: '#888', marginBottom: '1rem' }}>
                {project.description}
              </Text>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Text variant="caption" style={{ color: '#00d4ff' }}>
                    {project.branch}
                  </Text>
                  <Text variant="caption" style={{ color: '#888', marginLeft: '0.5rem' }}>
                    • {project.contributors} contributors
                  </Text>
                </Box>
                <Text variant="caption" style={{ color: '#888' }}>
                  {project.lastCommit}
                </Text>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Main Content */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2rem',
          height: '600px',
        }}>
          {/* File Tree */}
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: 0,
            overflow: 'hidden',
          }}>
            {/* File Tree Header */}
            <Box style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #00ff41',
              backgroundColor: 'rgba(0, 255, 65, 0.05)',
            }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Text weight="bold" style={{ color: '#00ff41' }}>
                  FILE EXPLORER
                </Text>
                <Text variant="caption" style={{ color: '#888', fontFamily: 'monospace' }}>
                  {selectedProject.name}
                </Text>
              </Box>
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #333',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                }}
              />
            </Box>

            {/* File Tree Content */}
            <Box style={{
              height: '450px',
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}>
              {renderFileTree(selectedProject.files)}
            </Box>
          </Card>

          {/* File Content */}
          <Card style={{
            backgroundColor: 'rgba(10, 10, 11, 0.95)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: 0,
            overflow: 'hidden',
          }}>
            {/* File Header */}
            <Box style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #00ff41',
              backgroundColor: 'rgba(0, 255, 65, 0.05)',
            }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Text weight="bold" style={{ color: '#00ff41' }}>
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </Text>
                  {selectedFile && (
                    <Box style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <Text variant="caption" style={{ color: '#888' }}>
                        {selectedFile.size} • Modified {selectedFile.modified}
                      </Text>
                      <Badge 
                        style={{
                          backgroundColor: getStatusColor(selectedFile.status),
                          color: selectedFile.status === 'conflict' ? '#ffffff' : '#0a0a0a',
                          fontSize: '0.75rem',
                        }}
                      >
                        {selectedFile.status.toUpperCase()}
                      </Badge>
                    </Box>
                  )}
                </Box>
                {selectedFile && (
                  <Box style={{ display: 'flex', gap: '0.5rem' }}>
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
                      EDIT
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
                      STAGE
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* File Content */}
            <Box style={{
              height: '450px',
              padding: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflowY: 'auto',
              backgroundColor: '#0a0a0b',
            }}>
              {selectedFile ? (
                <Box>
                  {selectedFile.name.endsWith('.ts') ? (
                    <>
                      <Text style={{ color: '#ff0055' }}>import</Text>
                      <Text style={{ color: '#ffffff' }}> {"{"} useState, useEffect {"}"} </Text>
                      <Text style={{ color: '#ff0055' }}>from</Text>
                      <Text style={{ color: '#00ff41' }}> 'react'</Text>
                      <Text style={{ color: '#ffffff' }}>;</Text>
                      <br /><br />
                      <Text style={{ color: '#ff0055' }}>interface</Text>
                      <Text style={{ color: '#00d4ff' }}> NeuralConnection </Text>
                      <Text style={{ color: '#ffffff' }}>{"{"}</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>  id: </Text>
                      <Text style={{ color: '#ff0055' }}>string</Text>
                      <Text style={{ color: '#ffffff' }}>;</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>  status: </Text>
                      <Text style={{ color: '#00ff41' }}>'connected'</Text>
                      <Text style={{ color: '#ffffff' }}> | </Text>
                      <Text style={{ color: '#00ff41' }}>'disconnected'</Text>
                      <Text style={{ color: '#ffffff' }}>;</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>{"}"}</Text>
                      <br /><br />
                      <Text style={{ color: '#ff0055' }}>export</Text>
                      <Text style={{ color: '#ffffff' }}> </Text>
                      <Text style={{ color: '#ff0055' }}>function</Text>
                      <Text style={{ color: '#00d4ff' }}> initializeNeural</Text>
                      <Text style={{ color: '#ffffff' }}>(</Text>
                      <Text style={{ color: '#ff9500' }}>config</Text>
                      <Text style={{ color: '#ffffff' }}>: </Text>
                      <Text style={{ color: '#00d4ff' }}>NeuralConfig</Text>
                      <Text style={{ color: '#ffffff' }}>) {"{"}</Text>
                      <br />
                      <Text style={{ color: '#888' }}>  // Neural interface initialization</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>  console.log(</Text>
                      <Text style={{ color: '#00ff41' }}>'Initializing neural connection...'</Text>
                      <Text style={{ color: '#ffffff' }}>);</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>{"}"}</Text>
                    </>
                  ) : selectedFile.name.endsWith('.json') ? (
                    <>
                      <Text style={{ color: '#ffffff' }}>{"{"}</Text>
                      <br />
                      <Text style={{ color: '#00d4ff' }}>  "name"</Text>
                      <Text style={{ color: '#ffffff' }}>: </Text>
                      <Text style={{ color: '#00ff41' }}>"neural-interface"</Text>
                      <Text style={{ color: '#ffffff' }}>,</Text>
                      <br />
                      <Text style={{ color: '#00d4ff' }}>  "version"</Text>
                      <Text style={{ color: '#ffffff' }}>: </Text>
                      <Text style={{ color: '#00ff41' }}>"2.1.7"</Text>
                      <Text style={{ color: '#ffffff' }}>,</Text>
                      <br />
                      <Text style={{ color: '#00d4ff' }}>  "neural_config"</Text>
                      <Text style={{ color: '#ffffff' }}>: {"{"}</Text>
                      <br />
                      <Text style={{ color: '#00d4ff' }}>    "security_level"</Text>
                      <Text style={{ color: '#ffffff' }}>: </Text>
                      <Text style={{ color: '#ff9500' }}>9</Text>
                      <Text style={{ color: '#ffffff' }}>,</Text>
                      <br />
                      <Text style={{ color: '#00d4ff' }}>    "encryption"</Text>
                      <Text style={{ color: '#ffffff' }}>: </Text>
                      <Text style={{ color: '#00ff41' }}>"quantum"</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>  {"}"}</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>{"}"}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: '#00ff41' }}># Neural Interface</Text>
                      <br /><br />
                      <Text style={{ color: '#ffffff' }}>Advanced neural network interface for cyberpunk system control.</Text>
                      <br /><br />
                      <Text style={{ color: '#00d4ff' }}>## Features</Text>
                      <br /><br />
                      <Text style={{ color: '#ffffff' }}>- Real-time neural connection monitoring</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>- Quantum encryption protocols</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>- Matrix integration capabilities</Text>
                      <br />
                      <Text style={{ color: '#ffffff' }}>- AI-powered threat detection</Text>
                    </>
                  )}
                </Box>
              ) : (
                <Box style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <Box>
                    <Text style={{ color: '#888', fontSize: '3rem', marginBottom: '1rem' }}>
                      📄
                    </Text>
                    <Text variant="body-lg" style={{ color: '#888' }}>
                      Select a file to view its contents
                    </Text>
                    <Text variant="body-sm" style={{ color: '#666', marginTop: '0.5rem' }}>
                      Click on any file in the explorer to open it
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}