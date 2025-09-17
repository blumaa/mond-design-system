'use client';

import React, { useState } from 'react';
import {
  Card,
  Stack,
  Box,
  Text,
  Badge,
  Heading,
  Grid,
  Divider,
  Button,
  ButtonGroup,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Modal,
  Alert,
  Pagination,
} from "@mond-design-system/theme";
import { PulseAnimation } from "../../components/PulseAnimation";
import { ModernIcon } from "../../components/ModernIcon";

// Mock social feed data
const feedPosts = [
  {
    id: "1",
    user: {
      name: "Bass Queen",
      icon: "crown" as const,
      handle: "@bassqueen",
      verified: true,
      followers: "1.8M"
    },
    timestamp: "2h ago",
    content: "Just dropped my latest track 'Underground Pulse'! Taking you deep into the bass caves. Who's ready to feel the DROP?",
    mediaIcon: "music" as const,
    mediaType: "audio",
    likes: 12500,
    reposts: 3200,
    comments: 890,
    tags: ["#NewMusic", "#Bass", "#Underground", "#Drop"],
    liked: false,
    reposted: true,
  },
  {
    id: "2",
    user: {
      name: "Cosmic DJ",
      icon: "rocket" as const,
      handle: "@cosmicdj",
      verified: true,
      followers: "2.1M"
    },
    timestamp: "4h ago",
    content: "Stellar Journey just hit 15M plays! Thank you to all my cosmic ravers who joined me on this interstellar adventure. Next stop: Electric Dreams 2024!",
    mediaIcon: "star" as const,
    mediaType: "image",
    likes: 28900,
    reposts: 8100,
    comments: 2100,
    tags: ["#StellarJourney", "#15Million", "#ElectricDreams", "#Grateful"],
    liked: true,
    reposted: false,
  },
  {
    id: "3",
    user: {
      name: "Wave Rider",
      icon: "wave" as const,
      handle: "@waverider",
      verified: false,
      followers: "1.2M"
    },
    timestamp: "6h ago",
    content: "Behind the scenes at the studio working on my Aurora Bass Fest set! These new future bass tracks are going to melt minds. Can't wait to share this journey with you all!",
    mediaIcon: "wave" as const,
    mediaType: "video",
    likes: 15600,
    reposts: 4300,
    comments: 1200,
    tags: ["#AuroraBassFest", "#FutureBass", "#Studio", "#BTS"],
    liked: false,
    reposted: false,
  },
  {
    id: "4",
    user: {
      name: "Digital Storm",
      icon: "lightning" as const,
      handle: "@digitalstorm",
      verified: true,
      followers: "980K"
    },
    timestamp: "8h ago",
    content: "Just announced my collaboration with @bassqueen for Neon Nights Festival! When trap meets bass... pure MAGIC happens! Mark your calendars: August 22-24!",
    mediaIcon: "lightning" as const,
    mediaType: "announcement",
    likes: 19800,
    reposts: 5600,
    comments: 1800,
    tags: ["#Collaboration", "#NeonNights", "#TrapMeetsBass", "#Magic"],
    liked: true,
    reposted: true,
  },
];

const trendingTopics = [
  { tag: "#ElectricDreams2024", posts: "45.2K" },
  { tag: "#NewMusic", posts: "128K" },
  { tag: "#Bass", posts: "89.1K" },
  { tag: "#Festival", posts: "234K" },
  { tag: "#Underground", posts: "67.3K" },
];

export default function SocialFeed() {
  const [posts, setPosts] = useState(feedPosts);
  const [newPost, setNewPost] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterVerified, setFilterVerified] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleRepost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, reposted: !post.reposted, reposts: post.reposted ? post.reposts - 1 : post.reposts + 1 }
        : post
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Box bg="surface.background" position="relative">
      <PulseAnimation />

      {/* Header */}
      <Box py="32" px="16">
        <Stack spacing="4" align="center" maxWidth="1400px" mx="auto">
          <Heading size="4xl" semantic="primary">
            FESTIVAL FEED
          </Heading>
          <Text variant="body-lg" semantic="secondary">
            Discover the latest beats, events, and community vibes
          </Text>
        </Stack>
      </Box>

      {/* Responsive Layout */}
      <div className="responsive-main-layout">
        {/* Main Feed */}
        <Box>
          <Stack spacing="24">
            <Text variant="body-lg" semantic="secondary">
              Connect with artists • Share your vibes • Discover new music
            </Text>

            {/* Post Creation */}
            <Card variant="elevated" padding="24">
              <Stack spacing="20">
                <Stack direction="horizontal" spacing="4" align="start">
                  <Box
                    width="48px"
                    height="48px"
                    borderRadius="full"
                    bg="gradient.primary"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ModernIcon type="crown" size="md" />
                  </Box>
                  <Stack flex="1" spacing="3">
                    <Textarea
                      placeholder="Share your festival vibes, new tracks, or upcoming shows..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                    />
                  </Stack>
                </Stack>

                <Stack direction="horizontal" justify="between" align="center" spacing="3">
                  <Stack direction="horizontal" spacing="3">
                    <Button variant="ghost" size="md">
                      <ModernIcon type="music" size="sm" /> Track
                    </Button>
                    <Button variant="ghost" size="md">
                      <ModernIcon type="star" size="sm" /> Photo
                    </Button>
                    <Button variant="ghost" size="md">
                      <ModernIcon type="wave" size="sm" /> Video
                    </Button>
                    <Button variant="ghost" size="md">
                      <ModernIcon type="diamond" size="sm" /> Event
                    </Button>
                  </Stack>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={!newPost.trim()}
                  >
                    <ModernIcon type="rocket" size="sm" />
                    POST TO FEED
                  </Button>
                </Stack>
              </Stack>
            </Card>

            {/* Feed Filters */}
            <Card variant="elevated" padding="20">
              <Stack direction="horizontal" justify="between" align="center" spacing="4">
                <Stack direction="horizontal" spacing="6" align="center">
                  <Stack direction="horizontal" spacing="3" align="center">
                    <ModernIcon type="crown" size="sm" />
                    <Switch
                      checked={filterVerified}
                      onChange={(e) => setFilterVerified(e.target.checked)}
                      label="Verified Artists"
                      size="md"
                    />
                  </Stack>

                  <Stack direction="horizontal" spacing="3" align="center">
                    <Text variant="body-sm" weight="medium" semantic="secondary">
                      Sort by:
                    </Text>
                    <ButtonGroup gap="2">
                      <Button
                        variant={sortBy === 'recent' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('recent')}
                      >
                        <ModernIcon type="lightning" size="sm" /> Recent
                      </Button>
                      <Button
                        variant={sortBy === 'popular' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('popular')}
                      >
                        <ModernIcon type="star" size="sm" /> Popular
                      </Button>
                      <Button
                        variant={sortBy === 'trending' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('trending')}
                      >
                        <ModernIcon type="rocket" size="sm" /> Trending
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Stack>

                <Badge variant="success" size="sm">
                  LIVE FEED
                </Badge>
              </Stack>
            </Card>

            {/* Feed Posts */}
            <Stack spacing="16">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  variant="elevated"
                  padding="24"
                >
                    <Stack spacing="20">
                      {/* Post Header */}
                      <Stack direction="horizontal" justify="between" align="start">
                        <Stack direction="horizontal" spacing="4" align="center">
                          <Box
                            width="48px"
                            height="48px"
                            borderRadius="full"
                            bg="gradient.primary"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <ModernIcon type={post.user.icon} size="md" />
                          </Box>
                          <Stack spacing="1">
                            <Stack direction="horizontal" spacing="2" align="center">
                              <Text variant="body-md" weight="bold" semantic="primary">
                                {post.user.name}
                              </Text>
                              {post.user.verified && (
                                <Badge variant="success" size="sm">
                                  <ModernIcon type="crown" size="sm" /> VERIFIED
                                </Badge>
                              )}
                              <Text variant="caption" semantic="secondary">
                                {post.user.handle}
                              </Text>
                            </Stack>
                            <Text variant="caption" semantic="secondary">
                              {post.user.followers} followers • {post.timestamp}
                            </Text>
                          </Stack>
                        </Stack>

                        <Button variant="ghost" size="sm">
                          <ModernIcon type="diamond" size="sm" />
                        </Button>
                      </Stack>

                      {/* Post Content */}
                      <Text variant="body-lg" semantic="primary">
                        {post.content}
                      </Text>

                      {/* Post Media */}
                      <Card variant="outlined" padding="20">
                        <Stack spacing="4" align="center">
                          <Box
                            width="64px"
                            height="64px"
                            borderRadius="full"
                            bg="gradient.primary"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <ModernIcon type={post.mediaIcon} size="xl" />
                          </Box>
                          <Stack spacing="1" align="center">
                            <Text variant="body-sm" weight="bold" semantic="primary">
                              {post.mediaType.toUpperCase()} CONTENT
                            </Text>
                            <Text variant="caption" semantic="secondary">
                              Tap to {post.mediaType === 'audio' ? 'play' : 'view'}
                            </Text>
                          </Stack>
                        </Stack>
                      </Card>

                      {/* Post Tags */}
                      <Stack direction="horizontal" spacing="2" align="center">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            size="md"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Stack>

                      {/* Post Actions */}
                      <Stack direction="horizontal" justify="between" align="center" py="4" spacing="3">
                        <Stack direction="horizontal" spacing="4" align="center">
                          <Button
                            variant={post.liked ? 'primary' : 'ghost'}
                            size="md"
                            onClick={() => handleLike(post.id)}
                          >
                            <ModernIcon type="star" size="sm" />
                            {formatNumber(post.likes)}
                          </Button>
                          <Button
                            variant={post.reposted ? 'primary' : 'ghost'}
                            size="md"
                            onClick={() => handleRepost(post.id)}
                          >
                            <ModernIcon type="wave" size="sm" />
                            {formatNumber(post.reposts)}
                          </Button>
                          <Button
                            variant="ghost"
                            size="md"
                          >
                            <ModernIcon type="diamond" size="sm" />
                            {formatNumber(post.comments)}
                          </Button>
                        </Stack>

                        <Button
                          variant="outline"
                          size="md"
                        >
                          <ModernIcon type="rocket" size="sm" />
                          Share
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
              ))}

              {/* Pagination */}
              <Box>
                <Pagination
                  currentPage={currentPage}
                  totalItems={100}
                  itemsPerPage={10}
                  onPageChange={setCurrentPage}
                />
              </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Sidebar */}
          <div className="desktop-sidebar">
            <Stack spacing="6">
              {/* Trending Topics */}
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Heading size="lg" semantic="primary">
                    TRENDING TOPICS
                  </Heading>
                  <Divider />
                  <Stack spacing="2">
                    {trendingTopics.map((topic, index) => (
                      <Stack key={topic.tag} direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">
                            {topic.tag}
                          </Text>
                          <Text variant="caption" semantic="secondary">
                            {topic.posts} posts
                          </Text>
                        </Stack>
                        <Badge variant="primary" size="sm">
                          #{index + 1}
                        </Badge>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Heading size="md" semantic="primary">
                    QUICK ACTIONS
                  </Heading>
                  <Divider />
                  <Stack spacing="2">
                    <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                      <ModernIcon type="music" size="sm" /> Share New Track
                    </Button>
                    <Button variant="outline" size="sm">
                      <ModernIcon type="star" size="sm" /> Create Event
                    </Button>
                    <Button variant="outline" size="sm">
                      <ModernIcon type="rocket" size="sm" /> Go Live
                    </Button>
                    <Button variant="outline" size="sm">
                      <ModernIcon type="diamond" size="sm" /> Promote Show
                    </Button>
                  </Stack>
                </Stack>
              </Card>

              {/* Festival Alerts */}
              <Alert variant="info" title="Festival Updates">
                <Text variant="body-sm">
                  Electric Dreams 2024 lineup announcement in 2 days!
                  Turn on notifications to be the first to know.
                </Text>
              </Alert>

              {/* Community Stats */}
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Heading size="md" semantic="primary">
                    COMMUNITY PULSE
                  </Heading>
                  <Divider />
                  <Stack spacing="2">
                    <Stack direction="horizontal" justify="between">
                      <Text variant="caption" semantic="secondary">Active Users</Text>
                      <Text variant="caption" semantic="primary">234K online</Text>
                    </Stack>
                    <Stack direction="horizontal" justify="between">
                      <Text variant="caption" semantic="secondary">Posts Today</Text>
                      <Text variant="caption" semantic="primary">89.2K posts</Text>
                    </Stack>
                    <Stack direction="horizontal" justify="between">
                      <Text variant="caption" semantic="secondary">New Tracks</Text>
                      <Text variant="caption" semantic="primary">1.2K releases</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </div>
        </div>

      {/* Share Track Modal */}
      {showModal && (
        <Modal
          title="Share New Track"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <Stack spacing="4">
            <Input placeholder="Track title" />
            <Textarea placeholder="Tell your fans about this track..." rows={4} />
            <Stack direction="horizontal" spacing="2">
              <Checkbox label="Available on Spotify" />
              <Checkbox label="Available on SoundCloud" />
            </Stack>
            <ButtonGroup>
              <Button variant="primary">Share Track</Button>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        </Modal>
      )}
    </Box>
  );
}