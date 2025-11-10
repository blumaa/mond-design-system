import { useState } from 'react';
import {
  Box,
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
      <Box gap="md">
        {/* Header */}
        <div className="hero-section">
          <Heading size="4xl" weight="bold" semantic="primary">
            FESTIVAL FEED
          </Heading>
          <Text semantic="secondary">
            Discover the latest beats, events, and community vibes
          </Text>
        </div>

        {/* Main Content Layout */}
        <div className="responsive-grid feed-layout">
          {/* Main Feed */}
          <div className="feed-main">
            <Box gap="md">
              {/* Post Creation */}
              <Box>
                <Box gap="md">
                  <div className="responsive-grid post-creator">
                    <div className="post-avatar">
                      <ModernIcon type="crown" size="lg" />
                    </div>
                    <Box gap="md" className="post-input">
                      <textarea
                        className="post-textarea"
                        placeholder="Share your festival vibes, new tracks, or upcoming shows..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={4}
                      />
                    </Box>
                  </div>

                  <div className="responsive-grid post-actions">
                    <Box display="flex" gap="md" className="media-buttons">
                      <Button size="sm">
                        <ModernIcon type="music" size="sm" />
                      </Button>
                      <Button size="sm">
                        <ModernIcon type="star" size="sm" />
                      </Button>
                      <Button size="sm">
                        <ModernIcon type="wave" size="sm" />
                      </Button>
                      <Button size="sm">
                        <ModernIcon type="diamond" size="sm" />
                      </Button>
                    </Box>
                    <Button
                     
                      size="lg"
                      disabled={!newPost.trim()}
                    >
                      POST TO FEED
                    </Button>
                  </div>
                </Box>
              </Box>

              {/* Feed Filters */}
              <Box>
                <div className="responsive-grid feed-filters">
                  <Box display="flex" gap="md" alignItems="center">
                    <label className="filter-switch">
                      <input
                        type="checkbox"
                        checked={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.checked)}
                      />
                      <span>Verified Artists</span>
                    </label>
                  </Box>

                  <Box display="flex" gap="md" className="sort-buttons">
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
                  </Box>

                  <Badge size="sm" className="live-badge">
                    LIVE FEED
                  </Badge>
                </div>
              </Box>

              {/* Feed Posts */}
              <Box gap="md">
                {posts.map((post) => (
                  <Box key={post.id}>
                    <Box gap="md">
                      {/* Post Header */}
                      <div className="responsive-grid post-header">
                        <Box display="flex" gap="md" alignItems="center">
                          <div className="user-avatar">
                            <ModernIcon type={post.user.icon} size="lg" />
                          </div>
                          <Box gap="md">
                            <Box display="flex" gap="md" alignItems="center">
                              <Text weight="bold" semantic="primary">
                                {post.user.name}
                              </Text>
                              {post.user.verified && (
                                <Badge size="sm">
                                  VERIFIED
                                </Badge>
                              )}
                              <Text semantic="secondary">
                                {post.user.handle}
                              </Text>
                            </Box>
                            <Text semantic="secondary">
                              {post.user.followers} followers • {post.timestamp}
                            </Text>
                          </Box>
                        </Box>

                        <Button size="sm">
                          <ModernIcon type="diamond" size="sm" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <Text semantic="primary">
                        {post.content}
                      </Text>

                      {/* Post Media */}
                      <Box>
                        <Box gap="md" alignItems="center">
                          <div className="media-icon">
                            <ModernIcon type={post.mediaIcon} size="xl" />
                          </div>
                          <Box gap="md" alignItems="center">
                            <Text weight="bold" semantic="primary">
                              {post.mediaType.toUpperCase()} CONTENT
                            </Text>
                            <Text semantic="secondary">
                              Tap to {post.mediaType === 'audio' ? 'play' : 'view'}
                            </Text>
                          </Box>
                        </Box>
                      </Box>

                      {/* Post Tags */}
                      <Box display="flex" gap="md" alignItems="center" className="post-tags">
                        {post.tags.map((tag) => (
                          <Badge key={tag} size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </Box>

                      {/* Post Actions */}
                      <div className="responsive-grid post-interactions">
                        <Box display="flex" gap="md" alignItems="center">
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
                          <Button size="sm">
                            <ModernIcon type="diamond" size="sm" />
                            {formatNumber(post.comments)}
                          </Button>
                        </Box>

                        <Button size="sm">
                          <ModernIcon type="rocket" size="sm" />
                          Share
                        </Button>
                      </div>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </div>

          {/* Sidebar */}
          <div className="feed-sidebar">
            <Box gap="md">
              {/* Trending Topics */}
              <Box>
                <Box gap="md">
                  <Heading size="lg" semantic="primary">
                    TRENDING TOPICS
                  </Heading>
                  <Divider />
                  <Box gap="md">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.tag} className="responsive-grid trending-item">
                        <Box gap="md">
                          <Text weight="bold" semantic="primary">
                            {topic.tag}
                          </Text>
                          <Text semantic="secondary">
                            {topic.posts} posts
                          </Text>
                        </Box>
                        <Badge size="sm">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Quick Actions */}
              <Box>
                <Box gap="md">
                  <Heading size="md" semantic="primary">
                    QUICK ACTIONS
                  </Heading>
                  <Divider />
                  <Box gap="md">
                    <Button size="sm">
                      <ModernIcon type="music" size="sm" /> Share New Track
                    </Button>
                    <Button size="sm">
                      <ModernIcon type="star" size="sm" /> Create Event
                    </Button>
                    <Button size="sm">
                      <ModernIcon type="rocket" size="sm" /> Go Live
                    </Button>
                    <Button size="sm">
                      <ModernIcon type="diamond" size="sm" /> Promote Show
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Community Stats */}
              <Box>
                <Box gap="md">
                  <Heading size="md" semantic="primary">
                    COMMUNITY PULSE
                  </Heading>
                  <Divider />
                  <Box gap="md">
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">Active Users</Text>
                      <Text semantic="primary">234K online</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">Posts Today</Text>
                      <Text semantic="primary">89.2K posts</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">New Tracks</Text>
                      <Text semantic="primary">1.2K releases</Text>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}