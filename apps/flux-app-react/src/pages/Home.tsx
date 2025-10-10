import {
  Box,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
  Input,
} from '@mond-design-system/theme';
import { ModernIcon } from '../components/ModernIcon';

// Static festival data
const featuredFestivals = [
  {
    id: "1",
    name: "Electric Dreams 2024",
    date: "July 15-17, 2024",
    location: "Neon Valley, CA",
    icon: "festival" as const,
    status: "selling-fast" as const,
    description: "3 days of electronic bliss with the world's top DJs and immersive art installations.",
    genres: ["Electronic", "Techno", "House"],
    headliners: ["Cosmic DJ", "Bass Queen", "Synth Master"],
    attendees: 45000,
    price: "$299"
  },
  {
    id: "2",
    name: "Neon Nights Festival",
    date: "August 22-24, 2024",
    location: "Electric City, NV",
    icon: "star" as const,
    status: "available" as const,
    description: "Underground music meets futuristic art in the desert's most electric gathering.",
    genres: ["Dubstep", "Trap", "Future Bass"],
    headliners: ["Wave Rider", "Digital Storm", "Neon Prophet"],
    attendees: 28000,
    price: "$249"
  },
  {
    id: "3",
    name: "Aurora Bass Fest",
    date: "September 5-8, 2024",
    location: "Crystal Lake, OR",
    icon: "rainbow" as const,
    status: "sold-out" as const,
    description: "4 nights of bass-heavy beats under the northern lights simulation dome.",
    genres: ["Bass", "Riddim", "Melodic Dubstep"],
    headliners: ["Aurora Bass", "Crystal Clear", "Northern Beats"],
    attendees: 35000,
    price: "SOLD OUT"
  },
];

const trendingArtists = [
  { id: "1", name: "Cosmic DJ", icon: "rocket" as const, followers: "2.1M", genre: "Electronic" },
  { id: "2", name: "Bass Queen", icon: "crown" as const, followers: "1.8M", genre: "Dubstep" },
  { id: "3", name: "Synth Master", icon: "keyboard" as const, followers: "1.5M", genre: "Synthwave" },
  { id: "4", name: "Wave Rider", icon: "wave" as const, followers: "1.2M", genre: "Future Bass" },
  { id: "5", name: "Digital Storm", icon: "lightning" as const, followers: "980K", genre: "Trap" },
  { id: "6", name: "Neon Prophet", icon: "diamond" as const, followers: "850K", genre: "Techno" },
];

export default function Home() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search functionality
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selling-fast': return { variant: 'warning' as const, text: 'SELLING FAST' };
      case 'sold-out': return { variant: 'error' as const, text: 'SOLD OUT' };
      default: return { variant: 'success' as const, text: 'AVAILABLE' };
    }
  };

  return (
    <div className="page-container">
      <Box display="flex" flexDirection="column" gap="xl">
        {/* Hero Section */}
        <div className="hero-section">
          <Box display="flex" flexDirection="column" gap="lg" alignItems="center">
            <div className="hero-title">
              <Heading size="4xl" weight="bold" semantic="primary">
                DISCOVER ELECTRIC FESTIVALS
              </Heading>
            </div>
            <div className="hero-subtitle">
              <Text variant="body-lg" semantic="primary" alignItems="center">
                Underground music • Immersive art • Electric vibes • Festival communities
              </Text>
            </div>
          </Box>

          {/* Search */}
          <div className="search-container">
            <Input
              placeholder="Search festivals, artists, genres..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <Box display="flex" gap="lg" alignItems="center" justifyContent="center">
            <Badge variant="primary" size="lg">
              45 FESTIVALS LIVE
            </Badge>
            <Badge variant="success" size="lg">
              2.1M RAVERS CONNECTED
            </Badge>
          </Box>
        </div>

        {/* Featured Festivals Grid */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="2xl" weight="bold" semantic="primary">
            FEATURED FESTIVALS
          </Heading>

          <div className="responsive-grid festivals">
            {featuredFestivals.map((festival) => {
              const statusBadge = getStatusBadge(festival.status);
              return (
                <Box key={festival.id} bg="surface.elevated" p="xl" borderRadius={8}>
                  <Box display="flex" flexDirection="column" gap="xl">
                    {/* Festival Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" flexDirection="column" gap="sm">
                        <ModernIcon type={festival.icon} size="xl" />
                        <Heading size="lg" weight="bold" semantic="primary">
                          {festival.name}
                        </Heading>
                      </Box>
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.text}
                      </Badge>
                    </Box>

                    {/* Festival Details */}
                    <Box display="flex" flexDirection="column" gap="lg">
                      <Box display="flex" justifyContent="space-between">
                        <Text variant="body-sm" semantic="secondary">
                          {festival.date}
                        </Text>
                        <Text variant="body-sm" semantic="secondary">
                          {festival.location}
                        </Text>
                      </Box>

                      <Text variant="body-sm" semantic="primary">
                        {festival.description}
                      </Text>

                      <Box display="flex" gap="sm">
                        {festival.genres.map(genre => (
                          <Badge key={genre} variant="secondary" size="sm">
                            {genre}
                          </Badge>
                        ))}
                      </Box>

                      <Box display="flex" flexDirection="column" gap="sm">
                        <Text variant="body-sm" weight="medium" semantic="primary">
                          Headliners
                        </Text>
                        <Box display="flex" gap="sm">
                          {festival.headliners.map((artist) => (
                            <Badge key={artist} variant="primary" size="sm">
                              {artist}
                            </Badge>
                          ))}
                        </Box>
                      </Box>

                      <Divider />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" flexDirection="column" gap="xs">
                          <Text variant="body-sm" semantic="primary">
                            {festival.attendees.toLocaleString()} attending
                          </Text>
                          <Text variant="body-md" weight="bold" semantic="primary">
                            {festival.price}
                          </Text>
                        </Box>

                        <Button
                          variant={festival.status === 'sold-out' ? 'outline' : 'primary'}
                          disabled={festival.status === 'sold-out'}
                        >
                          {festival.status === 'sold-out' ? 'SOLD OUT' : 'GET TICKETS'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </div>
        </Box>

        {/* Trending Artists */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="2xl" weight="bold" semantic="primary">
            TRENDING ARTISTS
          </Heading>

          <div className="responsive-grid artists">
            {trendingArtists.map((artist) => (
              <Box key={artist.id} bg="surface.elevated" p="lg" borderRadius={8}>
                <Box display="flex" flexDirection="column" gap="lg" alignItems="center">
                  <ModernIcon type={artist.icon} size="lg" />
                  <Box display="flex" flexDirection="column" gap="sm" alignItems="center">
                    <Text variant="body-sm" weight="bold" semantic="primary">
                      {artist.name}
                    </Text>
                    <Text variant="caption" semantic="secondary">
                      {artist.genre}
                    </Text>
                    <Badge variant="primary" size="sm">
                      {artist.followers}
                    </Badge>
                  </Box>
                  <Button variant="primary" size="sm">
                    FOLLOW
                  </Button>
                </Box>
              </Box>
            ))}
          </div>
        </Box>

        {/* Stats Section */}
        <Box bg="surface.elevated" p="2xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="xl">
            <Heading size="2xl" weight="bold" semantic="primary" alignItems="center">
              FLUX COMMUNITY STATS
            </Heading>

            <div className="responsive-grid stats">
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">2.1M</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Active Ravers</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">450+</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Festivals Listed</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">12K+</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Artists Featured</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">95%</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Satisfaction Rate</Text>
              </Box>
            </div>
          </Box>
        </Box>

      </Box>
    </div>
  );
}