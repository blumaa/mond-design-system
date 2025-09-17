'use client';

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
  TagList,
  SearchForm,
} from "@mond-design-system/theme";
import { PulseAnimation } from "../components/PulseAnimation";
import { ModernIcon } from "../components/ModernIcon";

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

export default function FestivalDiscovery() {
  const handleSearch = (_query: string) => {
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
    <Box bg="surface.background" p="32" maxWidth="1400px" mx="auto" position="relative">
      {/* Pulse Animation Background */}
      <PulseAnimation />

      <Stack spacing="24">
        {/* Hero Section */}
        <Stack spacing="20" align="center">
          <Stack spacing="4" align="center">
            <Heading size="4xl" weight="bold" semantic="primary">
              DISCOVER ELECTRIC FESTIVALS
            </Heading>
            <Text variant="body-lg" semantic="primary" align="center">
              Underground music • Immersive art • Electric vibes • Festival communities
            </Text>
          </Stack>

          {/* Search */}
          <Box width="100%" maxWidth="500px">
            <SearchForm
              placeholder="Search festivals, artists, genres..."
              onSearch={handleSearch}
              size="lg"
            />
          </Box>

          <Stack direction="horizontal" spacing="4" align="center">
            <Badge variant="primary" size="lg">
              45 FESTIVALS LIVE
            </Badge>
            <Badge variant="success" size="lg">
              2.1M RAVERS CONNECTED
            </Badge>
          </Stack>
        </Stack>

        {/* Featured Festivals Grid */}
        <Stack spacing="6">
          <Heading size="2xl" weight="bold" semantic="primary">
            FEATURED FESTIVALS
          </Heading>

          <Grid columns={3} gap="24">
            {featuredFestivals.map((festival) => {
              const statusBadge = getStatusBadge(festival.status);
              return (
                <Card key={festival.id} variant="floating" padding="24">
                  <Stack spacing="6">
                    {/* Festival Header */}
                    <Stack direction="horizontal" justify="between" align="start">
                      <Stack spacing="2">
                        <ModernIcon type={festival.icon} size="xl" />
                        <Heading size="lg" weight="bold" semantic="primary">
                          {festival.name}
                        </Heading>
                      </Stack>
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.text}
                      </Badge>
                    </Stack>

                    {/* Festival Details */}
                    <Stack spacing="4">
                      <Stack direction="horizontal" justify="between">
                        <Text variant="body-sm" semantic="secondary">
                          {festival.date}
                        </Text>
                        <Text variant="body-sm" semantic="secondary">
                          {festival.location}
                        </Text>
                      </Stack>

                      <Text variant="body-sm" semantic="primary">
                        {festival.description}
                      </Text>

                      <TagList
                        tags={festival.genres.map(genre => ({ id: genre, label: genre }))}
                        size="sm"
                      />

                      <Stack spacing="2">
                        <Text variant="body-sm" weight="medium" semantic="primary">
                          Headliners
                        </Text>
                        <Stack direction="horizontal" spacing="2">
                          {festival.headliners.map((artist) => (
                            <Badge key={artist} variant="primary" size="sm">
                              {artist}
                            </Badge>
                          ))}
                        </Stack>
                      </Stack>

                      <Divider />

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" semantic="primary">
                            {festival.attendees.toLocaleString()} attending
                          </Text>
                          <Text variant="body-md" weight="bold" semantic="primary">
                            {festival.price}
                          </Text>
                        </Stack>

                        <Button
                          variant={festival.status === 'sold-out' ? 'outline' : 'gradient'}
                          disabled={festival.status === 'sold-out'}
                        >
                          {festival.status === 'sold-out' ? 'SOLD OUT' : 'GET TICKETS'}
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        </Stack>

        {/* Trending Artists */}
        <Stack spacing="6">
          <Heading size="2xl" weight="bold" semantic="primary">
            TRENDING ARTISTS
          </Heading>

          <Grid columns={6} gap="16">
            {trendingArtists.map((artist) => (
              <Card key={artist.id} variant="glass" padding="20">
                <Stack spacing="4" align="center">
                  <ModernIcon type={artist.icon} size="lg" />
                  <Stack spacing="2" align="center">
                    <Text variant="body-sm" weight="bold" semantic="primary">
                      {artist.name}
                    </Text>
                    <Text variant="caption" semantic="secondary">
                      {artist.genre}
                    </Text>
                    <Badge variant="primary" size="sm">
                      {artist.followers}
                    </Badge>
                  </Stack>
                  <Button variant="glow" size="sm">
                    FOLLOW
                  </Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>

        {/* Stats Section */}
        <Card variant="glass" padding="32">
          <Stack spacing="6">
            <Heading size="2xl" weight="bold" semantic="primary" align="center">
              FLUX COMMUNITY STATS
            </Heading>

            <Grid columns={4} gap="6">
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">2.1M</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Active Ravers</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">450+</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Festivals Listed</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">12K+</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Artists Featured</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">95%</Text>
                <Text variant="body-md" weight="medium" semantic="primary">Satisfaction Rate</Text>
              </Stack>
            </Grid>
          </Stack>
        </Card>

      </Stack>
    </Box>
  );
}