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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  ProgressStepper,
} from "@mond-design-system/theme";
import { PulseAnimation } from "../../components/PulseAnimation";
import { ModernIcon } from "../../components/ModernIcon";

// Mock artist data
const featuredArtist = {
  id: "cosmic-dj",
  name: "Cosmic DJ",
  icon: "rocket" as const,
  genre: "Electronic",
  followers: "2.1M",
  verified: true,
  bio: "Pioneering the future of electronic music with cosmic soundscapes and interstellar beats. Taking ravers on a journey through space and time.",
  location: "Neo Tokyo",
  yearsActive: "2018-Present",
  labels: ["Cosmic Records", "Future Sounds"],
  stats: {
    monthlyListeners: "2.1M",
    totalTracks: 247,
    festivals: 89,
    countries: 34,
  },
  socialLinks: {
    spotify: "2.1M followers",
    soundcloud: "890K followers",
    instagram: "1.5M followers",
    twitter: "750K followers",
  },
  upcomingShows: [
    { date: "July 15", festival: "Electric Dreams 2024", location: "Neon Valley, CA" },
    { date: "Aug 22", festival: "Neon Nights Festival", location: "Electric City, NV" },
    { date: "Sep 5", festival: "Aurora Bass Fest", location: "Crystal Lake, OR" },
  ],
  topTracks: [
    { title: "Stellar Journey", plays: "15.2M", duration: "4:32" },
    { title: "Cosmic Waves", plays: "12.8M", duration: "5:18" },
    { title: "Interstellar Bass", plays: "9.6M", duration: "3:47" },
    { title: "Galaxy Dreams", plays: "8.2M", duration: "4:55" },
    { title: "Nebula Nights", plays: "6.7M", duration: "4:12" },
  ],
  collaborators: [
    { name: "Bass Queen", icon: "crown" as const, role: "Frequent Collaborator" },
    { name: "Synth Master", icon: "keyboard" as const, role: "Producer" },
    { name: "Wave Rider", icon: "wave" as const, role: "Remix Artist" },
  ],
};

const similarArtists = [
  { name: "Digital Storm", icon: "lightning" as const, followers: "980K", genre: "Trap" },
  { name: "Neon Prophet", icon: "diamond" as const, followers: "850K", genre: "Techno" },
  { name: "Aurora Bass", icon: "rainbow" as const, followers: "1.2M", genre: "Bass" },
  { name: "Crystal Clear", icon: "diamond" as const, followers: "760K", genre: "Melodic Dubstep" },
];

export default function ArtistProfile() {
  return (
    <Box bg="surface.background" p="32" maxWidth="1400px" mx="auto" position="relative">
      <PulseAnimation />

      <Stack spacing="24">
        {/* Artist Header */}
        <Card variant="glass" padding="32">
          <Stack spacing="8">

            {/* Main Artist Info */}
            <Stack direction="horizontal" spacing="8" align="start">
              <Stack align="center" spacing="4">
                <ModernIcon type={featuredArtist.icon} size="2xl" />
                <Stack direction="horizontal" spacing="2" align="center">
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                  <Badge variant="primary" size="sm">TRENDING</Badge>
                </Stack>
              </Stack>

              <Stack spacing="6" flex="1">
                <Stack spacing="4">
                  <Stack direction="horizontal" align="center" spacing="4">
                    <Heading size="4xl" weight="bold" semantic="primary">
                      {featuredArtist.name}
                    </Heading>
                    <Tooltip content="Verified Artist">
                      <Text variant="body-lg">✓</Text>
                    </Tooltip>
                  </Stack>

                  <TagList
                    tags={[
                      { id: "genre", label: featuredArtist.genre },
                      { id: "location", label: featuredArtist.location },
                      { id: "years", label: featuredArtist.yearsActive },
                    ]}
                    size="md"
                  />

                  <Text variant="body-lg" semantic="secondary">
                    {featuredArtist.bio}
                  </Text>
                </Stack>

                <Stack direction="horizontal" spacing="6">
                  <Button variant="gradient" size="lg">
                    FOLLOW ({featuredArtist.followers})
                  </Button>
                  <Button variant="gradient-secondary" size="lg">
                    PLAY ALL
                  </Button>
                  <Button variant="ghost" size="lg">
                    SHARE
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            {/* Artist Stats */}
            <Grid columns={4} gap="6">
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.monthlyListeners}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Monthly Listeners</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.totalTracks}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Total Tracks</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.festivals}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Festivals Played</Text>
              </Stack>
              <Stack align="center" spacing="2">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.countries}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Countries Toured</Text>
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultActiveTab="music">
          <TabsList>
            <TabsTrigger value="music">MUSIC & TRACKS</TabsTrigger>
            <TabsTrigger value="shows">UPCOMING SHOWS</TabsTrigger>
            <TabsTrigger value="collaborations">COLLABORATIONS</TabsTrigger>
            <TabsTrigger value="social">SOCIAL & STATS</TabsTrigger>
          </TabsList>

          {/* Music & Tracks Tab */}
          <TabsContent value="music">
            <Stack spacing="6">
              <Heading size="2xl" weight="bold" semantic="primary">TOP TRACKS</Heading>

              <Grid columns={1} gap="2">
                {featuredArtist.topTracks.map((track, index) => (
                  <Card key={track.title} variant="floating" padding="20">
                    <Stack direction="horizontal" justify="between" align="center">
                      <Stack direction="horizontal" spacing="4" align="center">
                        <Text variant="body-lg" weight="bold" semantic="accent" width="40px">
                          #{index + 1}
                        </Text>
                        <Stack spacing="1">
                          <Text variant="body-lg" weight="bold" semantic="primary">
                            {track.title}
                          </Text>
                          <Stack direction="horizontal" spacing="4">
                            <Text variant="body-sm" weight="medium" semantic="secondary">
                              {track.plays} plays
                            </Text>
                            <Text variant="body-sm" semantic="tertiary">
                              {track.duration}
                            </Text>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack direction="horizontal" spacing="2">
                        <Button variant="primary" size="sm">PLAY</Button>
                        <Button variant="outline" size="sm">LIKE</Button>
                        <Button variant="ghost" size="sm">SHARE</Button>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </TabsContent>

          {/* Upcoming Shows Tab */}
          <TabsContent value="shows">
            <Stack spacing="6">
              <Heading size="2xl" weight="bold" semantic="primary">UPCOMING FESTIVAL APPEARANCES</Heading>

              <ProgressStepper
                steps={featuredArtist.upcomingShows.map((show, index) => ({
                  label: show.festival,
                  description: `${show.date} • ${show.location}`,
                  status: index === 0 ? 'active' : 'disabled',
                }))}
                currentStep={0}
              />

              <Grid columns={1} gap="4">
                {featuredArtist.upcomingShows.map((show) => (
                  <Card key={show.festival} variant="glass" padding="lg">
                    <Stack direction="horizontal" justify="between" align="center">
                      <Stack spacing="2">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          {show.festival}
                        </Text>
                        <Stack direction="horizontal" spacing="4">
                          <Text variant="caption" semantic="secondary">
                            {show.date}
                          </Text>
                          <Text variant="caption" semantic="secondary">
                            {show.location}
                          </Text>
                        </Stack>
                      </Stack>
                      <Stack direction="horizontal" spacing="2">
                        <Button variant="outline" size="sm">GET TICKETS</Button>
                        <Button variant="ghost" size="sm">NOTIFY ME</Button>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </TabsContent>

          {/* Collaborations Tab */}
          <TabsContent value="collaborations">
            <Stack spacing="6">
              <Heading size="2xl" weight="bold" semantic="primary">FREQUENT COLLABORATORS</Heading>

              <Stack direction="horizontal" spacing="4" align="center">
                {featuredArtist.collaborators.map((collab) => (
                  <ModernIcon key={collab.name} type={collab.icon} size="md" />
                ))}
              </Stack>

              <Grid columns={3} gap="6">
                {featuredArtist.collaborators.map((collaborator) => (
                  <Card key={collaborator.name} variant="floating" padding="lg">
                    <Stack spacing="4" align="center">
                      <ModernIcon type={collaborator.icon} size="xl" />
                      <Stack spacing="2" align="center">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          {collaborator.name}
                        </Text>
                        <Text variant="caption" semantic="secondary">
                          {collaborator.role}
                        </Text>
                        <Badge variant="primary" size="sm">
                          COLLABORATOR
                        </Badge>
                      </Stack>
                      <Button variant="outline" size="sm">
                        VIEW PROFILE
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Grid>

              <Heading size="xl" weight="bold" semantic="primary">SIMILAR ARTISTS</Heading>
              <Grid columns={4} gap="4">
                {similarArtists.map((artist) => (
                  <Card key={artist.name} variant="glass" padding="md">
                    <Stack spacing="2" align="center">
                      <ModernIcon type={artist.icon} size="lg" />
                      <Stack spacing="1" align="center">
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
                      <Button variant="ghost" size="sm">
                        FOLLOW
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </TabsContent>

          {/* Social & Stats Tab */}
          <TabsContent value="social">
            <Stack spacing="6">
              <Heading size="2xl" weight="bold" semantic="primary">SOCIAL MEDIA PRESENCE</Heading>

              <Grid columns={2} gap="6">
                {Object.entries(featuredArtist.socialLinks).map(([platform, followers]) => (
                  <Card key={platform} variant="elevated" padding="lg">
                    <Stack direction="horizontal" justify="between" align="center">
                      <Stack spacing="2">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Text>
                        <Text variant="caption" semantic="secondary">
                          {followers}
                        </Text>
                      </Stack>
                      <Button variant="outline" size="sm">
                        FOLLOW
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Grid>

              <Divider />

              <Stack spacing="4">
                <Heading size="xl" weight="bold" semantic="primary">RECORD LABELS</Heading>
                <TagList
                  tags={featuredArtist.labels.map(label => ({ id: label, label }))}
                  size="lg"
                />
              </Stack>
            </Stack>
          </TabsContent>
        </Tabs>
      </Stack>
    </Box>
  );
}