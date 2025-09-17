import { useState } from 'react';
import {
  Card,
  Stack,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
} from '@mond-design-system/theme';
import { ModernIcon } from '../components/ModernIcon';

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

export default function Feed() {
  const [posts, setPosts] = useState(feedPosts);
  const [newPost, setNewPost] = useState('');
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
    <div className="page-container">
      <Stack spacing="6">
        {/* Header */}
        <div className="hero-section">
          <Heading size="4xl" weight="bold" semantic="primary">
            FESTIVAL FEED
          </Heading>
          <Text variant="body-lg" semantic="secondary">
            Discover the latest beats, events, and community vibes
          </Text>
        </div>

        {/* Main Content Layout */}
        <div className="responsive-grid feed-layout">
          {/* Main Feed */}
          <div className="feed-main">
            <Stack spacing="6">
              {/* Post Creation */}
              <Card variant="elevated" padding="24">
                <Stack spacing="4">
                  <div className="responsive-grid post-creator">
                    <div className="post-avatar">
                      <ModernIcon type="crown" size="lg" />
                    </div>
                    <Stack spacing="3" className="post-input">
                      <textarea
                        className="post-textarea"
                        placeholder="Share your festival vibes, new tracks, or upcoming shows..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={4}
                      />
                    </Stack>
                  </div>

                  <div className="responsive-grid post-actions">
                    <Stack direction="horizontal" spacing="2" className="media-buttons">
                      <Button variant="ghost" size="sm">
                        <ModernIcon type="music" size="sm" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ModernIcon type="star" size="sm" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ModernIcon type="wave" size="sm" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ModernIcon type="diamond" size="sm" />
                      </Button>
                    </Stack>
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={!newPost.trim()}
                    >
                      POST TO FEED
                    </Button>
                  </div>
                </Stack>
              </Card>

              {/* Feed Filters */}
              <Card variant="elevated" padding="20">
                <div className="responsive-grid feed-filters">
                  <Stack direction="horizontal" spacing="4" align="center">
                    <label className="filter-switch">
                      <input
                        type="checkbox"
                        checked={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.checked)}
                      />
                      <span>Verified Artists</span>
                    </label>
                  </Stack>

                  <Stack direction="horizontal" spacing="2" className="sort-buttons">
                    <Button
                      variant={sortBy === 'recent' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
                    >
                      Recent
                    </Button>
                    <Button
                      variant={sortBy === 'popular' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('popular')}
                    >
                      Popular
                    </Button>
                    <Button
                      variant={sortBy === 'trending' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('trending')}
                    >
                      Trending
                    </Button>
                  </Stack>

                  <Badge variant="success" size="sm" className="live-badge">
                    LIVE FEED
                  </Badge>
                </div>
              </Card>

              {/* Feed Posts */}
              <Stack spacing="4">
                {posts.map((post) => (
                  <Card key={post.id} variant="elevated" padding="24">
                    <Stack spacing="4">
                      {/* Post Header */}
                      <div className="responsive-grid post-header">
                        <Stack direction="horizontal" spacing="3" align="center">
                          <div className="user-avatar">
                            <ModernIcon type={post.user.icon} size="lg" />
                          </div>
                          <Stack spacing="1">
                            <Stack direction="horizontal" spacing="2" align="center">
                              <Text variant="body-md" weight="bold" semantic="primary">
                                {post.user.name}
                              </Text>
                              {post.user.verified && (
                                <Badge variant="success" size="sm">
                                  VERIFIED
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
                      </div>

                      {/* Post Content */}
                      <Text variant="body-lg" semantic="primary">
                        {post.content}
                      </Text>

                      {/* Post Media */}
                      <Card variant="outlined" padding="20">
                        <Stack spacing="3" align="center">
                          <div className="media-icon">
                            <ModernIcon type={post.mediaIcon} size="xl" />
                          </div>
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
                      <Stack direction="horizontal" spacing="2" align="center" className="post-tags">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </Stack>

                      {/* Post Actions */}
                      <div className="responsive-grid post-interactions">
                        <Stack direction="horizontal" spacing="3" align="center">
                          <Button
                            variant={post.liked ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => handleLike(post.id)}
                          >
                            <ModernIcon type="star" size="sm" />
                            {formatNumber(post.likes)}
                          </Button>
                          <Button
                            variant={post.reposted ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => handleRepost(post.id)}
                          >
                            <ModernIcon type="wave" size="sm" />
                            {formatNumber(post.reposts)}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ModernIcon type="diamond" size="sm" />
                            {formatNumber(post.comments)}
                          </Button>
                        </Stack>

                        <Button variant="outline" size="sm">
                          <ModernIcon type="rocket" size="sm" />
                          Share
                        </Button>
                      </div>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </div>

          {/* Sidebar */}
          <div className="feed-sidebar">
            <Stack spacing="6">
              {/* Trending Topics */}
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="lg" semantic="primary">
                    TRENDING TOPICS
                  </Heading>
                  <Divider />
                  <Stack spacing="3">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.tag} className="responsive-grid trending-item">
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
                      </div>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="md" semantic="primary">
                    QUICK ACTIONS
                  </Heading>
                  <Divider />
                  <Stack spacing="2">
                    <Button variant="outline" size="sm">
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

              {/* Community Stats */}
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="md" semantic="primary">
                    COMMUNITY PULSE
                  </Heading>
                  <Divider />
                  <Stack spacing="2">
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">Active Users</Text>
                      <Text variant="caption" semantic="primary">234K online</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">Posts Today</Text>
                      <Text variant="caption" semantic="primary">89.2K posts</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">New Tracks</Text>
                      <Text variant="caption" semantic="primary">1.2K releases</Text>
                    </div>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </div>
        </div>
      </Stack>
    </div>
  );
}