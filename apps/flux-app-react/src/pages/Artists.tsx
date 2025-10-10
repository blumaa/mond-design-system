import {
  Box,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
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
      <Box display="flex" flexDirection="column" gap="xl">
        {/* Artist Header */}
        <Box bg="surface.elevated" p="2xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="xl">
            {/* Main Artist Info */}
            <div className="responsive-grid artist-header">
              <Box display="flex" flexDirection="column" alignItems="center" gap="lg">
                <ModernIcon type={featuredArtist.icon} size="2xl" />
                <Box display="flex" gap="sm" alignItems="center">
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                  <Badge variant="primary" size="sm">TRENDING</Badge>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="lg">
                <Box display="flex" flexDirection="column" gap="sm">
                  <Box display="flex" alignItems="center" gap="sm">
                    <Heading size="4xl" weight="bold" semantic="primary">
                      {featuredArtist.name}
                    </Heading>
                    <Text variant="body-lg">✓</Text>
                  </Box>

                  <Box display="flex" gap="sm">
                    <Badge variant="secondary" size="sm">{featuredArtist.genre}</Badge>
                    <Badge variant="secondary" size="sm">{featuredArtist.location}</Badge>
                    <Badge variant="secondary" size="sm">{featuredArtist.yearsActive}</Badge>
                  </Box>

                  <Text variant="body-lg" semantic="secondary">
                    {featuredArtist.bio}
                  </Text>
                </Box>

                <Box display="flex" gap="lg" className="artist-buttons">
                  <Button variant="primary" size="lg">
                    FOLLOW ({featuredArtist.followers})
                  </Button>
                  <Button variant="ghost" size="lg">
                    PLAY ALL
                  </Button>
                  <Button variant="ghost" size="lg">
                    SHARE
                  </Button>
                </Box>
              </Box>
            </div>

            {/* Artist Stats */}
            <div className="responsive-grid stats">
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.monthlyListeners}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Monthly Listeners</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.totalTracks}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Total Tracks</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.festivals}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Festivals Played</Text>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
                <Text variant="display" weight="bold" semantic="accent">{featuredArtist.stats.countries}</Text>
                <Text variant="body-sm" weight="medium" semantic="secondary">Countries Toured</Text>
              </Box>
            </div>
          </Box>
        </Box>

        {/* Top Tracks Section */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="2xl" weight="bold" semantic="primary">TOP TRACKS</Heading>

          <Box display="flex" flexDirection="column" gap="sm">
            {featuredArtist.topTracks.map((track, index) => (
              <Box key={track.title} bg="surface.elevated" p="lg" borderRadius={8}>
                <div className="responsive-grid track-item">
                  <Box display="flex" gap="lg" alignItems="center">
                    <Text variant="body-lg" weight="bold" semantic="accent" style={{ minWidth: '40px' }}>
                      #{index + 1}
                    </Text>
                    <Box display="flex" flexDirection="column" gap="xs">
                      <Text variant="body-lg" weight="bold" semantic="primary">
                        {track.title}
                      </Text>
                      <Box display="flex" gap="lg">
                        <Text variant="body-sm" weight="medium" semantic="secondary">
                          {track.plays} plays
                        </Text>
                        <Text variant="body-sm" semantic="tertiary">
                          {track.duration}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  <Box display="flex" gap="sm">
                    <Button variant="primary" size="sm">PLAY</Button>
                    <Button variant="outline" size="sm">LIKE</Button>
                  </Box>
                </div>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Upcoming Shows Section */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="2xl" weight="bold" semantic="primary">UPCOMING FESTIVAL APPEARANCES</Heading>

          <Box display="flex" flexDirection="column" gap="lg">
            {featuredArtist.upcomingShows.map((show) => (
              <Box key={show.festival} bg="surface.elevated" p="lg" borderRadius={8}>
                <div className="responsive-grid show-item">
                  <Box display="flex" flexDirection="column" gap="sm">
                    <Text variant="body-md" weight="bold" semantic="primary">
                      {show.festival}
                    </Text>
                    <Box display="flex" gap="lg">
                      <Text variant="caption" semantic="secondary">
                        {show.date}
                      </Text>
                      <Text variant="caption" semantic="secondary">
                        {show.location}
                      </Text>
                    </Box>
                  </Box>

                  <Box display="flex" gap="sm">
                    <Button variant="outline" size="sm">GET TICKETS</Button>
                    <Button variant="ghost" size="sm">NOTIFY ME</Button>
                  </Box>
                </div>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Collaborations Section */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="2xl" weight="bold" semantic="primary">FREQUENT COLLABORATORS</Heading>

          <div className="responsive-grid collaborators">
            {featuredArtist.collaborators.map((collaborator) => (
              <Box key={collaborator.name} bg="surface.elevated" p="lg" borderRadius={8}>
                <Box display="flex" flexDirection="column" gap="lg" alignItems="center">
                  <ModernIcon type={collaborator.icon} size="xl" />
                  <Box display="flex" flexDirection="column" gap="sm" alignItems="center">
                    <Text variant="body-md" weight="bold" semantic="primary">
                      {collaborator.name}
                    </Text>
                    <Text variant="caption" semantic="secondary">
                      {collaborator.role}
                    </Text>
                    <Badge variant="primary" size="sm">
                      COLLABORATOR
                    </Badge>
                  </Box>
                  <Button variant="outline" size="sm">
                    VIEW PROFILE
                  </Button>
                </Box>
              </Box>
            ))}
          </div>
        </Box>

        {/* Similar Artists Section */}
        <Box display="flex" flexDirection="column" gap="xl">
          <Heading size="xl" weight="bold" semantic="primary">SIMILAR ARTISTS</Heading>

          <div className="responsive-grid artists">
            {similarArtists.map((artist) => (
              <Box key={artist.name} bg="surface.elevated" p="lg" borderRadius={8}>
                <Box display="flex" flexDirection="column" gap="sm" alignItems="center">
                  <ModernIcon type={artist.icon} size="lg" />
                  <Box display="flex" flexDirection="column" gap="xs" alignItems="center">
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
                  <Button variant="ghost" size="sm">
                    FOLLOW
                  </Button>
                </Box>
              </Box>
            ))}
          </div>
        </Box>

        {/* Social Media Section */}
        <Box bg="surface.elevated" p="xl" borderRadius={8}>
          <Box display="flex" flexDirection="column" gap="xl">
            <Heading size="2xl" weight="bold" semantic="primary">SOCIAL MEDIA PRESENCE</Heading>

            <div className="responsive-grid social">
              {Object.entries(featuredArtist.socialLinks).map(([platform, followers]) => (
                <Box key={platform} bg="surface.elevated" p="lg" borderRadius={8}>
                  <div className="responsive-grid social-item">
                    <Box display="flex" flexDirection="column" gap="sm">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Text>
                      <Text variant="caption" semantic="secondary">
                        {followers}
                      </Text>
                    </Box>
                    <Button variant="outline" size="sm">
                      FOLLOW
                    </Button>
                  </div>
                </Box>
              ))}
            </div>

            <Divider />

            <Box display="flex" flexDirection="column" gap="lg">
              <Heading size="xl" weight="bold" semantic="primary">RECORD LABELS</Heading>
              <Box display="flex" gap="sm">
                {featuredArtist.labels.map(label => (
                  <Badge key={label} variant="secondary" size="lg">
                    {label}
                  </Badge>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
