import {
  Card,
  Stack,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
  TagList,
} from '@mond-design-system/theme';
import { ModernIcon } from '../components/ModernIcon';

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

export default function Artists() {
  return (
    <div className="page-container">
      <Stack spacing="6">
        {/* Artist Header */}
        <Card variant="glass" padding="32">
          <Stack spacing="6">
            {/* Main Artist Info */}
            <div className="responsive-grid artist-header">
              <Stack align="center" spacing="4">
                <ModernIcon type={featuredArtist.icon} size="2xl" />
                <Stack direction="horizontal" spacing="2" align="center">
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                  <Badge variant="primary" size="sm">TRENDING</Badge>
                </Stack>
              </Stack>

              <Stack spacing="4">
                <Stack spacing="2">
                  <Stack direction="horizontal" align="center" spacing="2">
                    <Heading size="4xl" weight="bold" semantic="primary">
                      {featuredArtist.name}
                    </Heading>
                    <Text variant="body-lg">✓</Text>
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

                <Stack direction="horizontal" spacing="4" className="artist-buttons">
                  <Button variant="primary" size="lg">
                    FOLLOW ({featuredArtist.followers})
                  </Button>
                  <Button variant="ghost" size="lg">
                    PLAY ALL
                  </Button>
                  <Button variant="ghost" size="lg">
                    SHARE
                  </Button>
                </Stack>
              </Stack>
            </div>

            {/* Artist Stats */}
            <div className="responsive-grid stats">
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
            </div>
          </Stack>
        </Card>

        {/* Top Tracks Section */}
        <Stack spacing="6">
          <Heading size="2xl" weight="bold" semantic="primary">TOP TRACKS</Heading>

          <Stack spacing="2">
            {featuredArtist.topTracks.map((track, index) => (
              <Card key={track.title} variant="floating" padding="20">
                <div className="responsive-grid track-item">
                  <Stack direction="horizontal" spacing="4" align="center">
                    <Text variant="body-lg" weight="bold" semantic="accent" style={{ minWidth: '40px' }}>
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
                  </Stack>
                </div>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Upcoming Shows Section */}
        <Stack spacing="6">
          <Heading size="2xl" weight="bold" semantic="primary">UPCOMING FESTIVAL APPEARANCES</Heading>

          <Stack spacing="4">
            {featuredArtist.upcomingShows.map((show) => (
              <Card key={show.festival} variant="glass" padding="20">
                <div className="responsive-grid show-item">
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
                </div>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Collaborations Section */}
        <Stack spacing="6">
          <Heading size="2xl" weight="bold" semantic="primary">FREQUENT COLLABORATORS</Heading>

          <div className="responsive-grid collaborators">
            {featuredArtist.collaborators.map((collaborator) => (
              <Card key={collaborator.name} variant="floating" padding="20">
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
          </div>
        </Stack>

        {/* Similar Artists Section */}
        <Stack spacing="6">
          <Heading size="xl" weight="bold" semantic="primary">SIMILAR ARTISTS</Heading>

          <div className="responsive-grid artists">
            {similarArtists.map((artist) => (
              <Card key={artist.name} variant="glass" padding="20">
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
          </div>
        </Stack>

        {/* Social Media Section */}
        <Card variant="elevated" padding="24">
          <Stack spacing="6">
            <Heading size="2xl" weight="bold" semantic="primary">SOCIAL MEDIA PRESENCE</Heading>

            <div className="responsive-grid social">
              {Object.entries(featuredArtist.socialLinks).map(([platform, followers]) => (
                <Card key={platform} variant="glass" padding="20">
                  <div className="responsive-grid social-item">
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
                  </div>
                </Card>
              ))}
            </div>

            <Divider />

            <Stack spacing="4">
              <Heading size="xl" weight="bold" semantic="primary">RECORD LABELS</Heading>
              <TagList
                tags={featuredArtist.labels.map(label => ({ id: label, label }))}
                size="lg"
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}