import { useState } from 'react';
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

// Mock user data
const userData = {
  id: "raver-001",
  username: "ElectricDreamer",
  displayName: "Alex Storm",
  icon: "lightning" as const,
  email: "alex.storm@flux.fest",
  bio: "Professional raver and music explorer | Following the beat from festival to festival | Bass lover • Techno enthusiast • Living the electric dream",
  location: "Los Angeles, CA",
  joinDate: "March 2022",
  verified: true,
  settings: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profilePublic: true,
      showLocation: true,
      showActivity: true,
    },
    preferences: {
      autoPlay: true,
      highQuality: true,
      darkMode: false,
    }
  },
  stats: {
    festivalsAttended: 47,
    artistsFollowed: 156,
    postsShared: 89,
    friendsConnected: 324,
    hoursListened: 2847,
    favoriteGenres: ["Electronic", "Bass", "Techno", "Future Bass"],
  },
  recentActivity: [
    { type: "festival", action: "Attended Electric Dreams 2024", date: "2 days ago", icon: "festival" as const },
    { type: "follow", action: "Started following Cosmic DJ", date: "1 week ago", icon: "crown" },
    { type: "post", action: "Shared festival moments", date: "1 week ago", icon: "star" },
    { type: "ticket", action: "Bought tickets to Neon Nights", date: "2 weeks ago", icon: "diamond" },
  ],
  upcomingEvents: [
    { name: "Neon Nights Festival", date: "Aug 22-24", location: "Electric City, NV", status: "confirmed" },
    { name: "Aurora Bass Fest", date: "Sep 5-8", location: "Crystal Lake, OR", status: "waitlist" },
    { name: "Winter Electric", date: "Dec 15-17", location: "Snow Valley, CO", status: "interested" },
  ],
  friends: [
    { name: "Bass Queen", icon: "crown" as const, status: "online", mutualFriends: 12 },
    { name: "Synth Master", icon: "keyboard" as const, status: "offline", mutualFriends: 8 },
    { name: "Wave Rider", icon: "wave" as const, status: "at festival", mutualFriends: 15 },
    { name: "Digital Storm", icon: "lightning" as const, status: "online", mutualFriends: 23 },
  ],
  achievements: [
    { id: "first-festival", name: "First Festival", description: "Attended your first festival", earned: true, icon: "festival" as const },
    { id: "social-butterfly", name: "Social Butterfly", description: "Connected with 100 friends", earned: true, icon: "butterfly" as const },
    { id: "music-explorer", name: "Music Explorer", description: "Discovered 50 new artists", earned: true, icon: "star" as const },
    { id: "festival-veteran", name: "Festival Veteran", description: "Attended 50 festivals", earned: false, icon: "crown" as const },
  ],
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: userData.displayName,
    bio: userData.bio,
    location: userData.location,
  });
  const [settings, setSettings] = useState(userData.settings);

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return { variant: 'success' as const, text: 'ONLINE' };
      case 'offline': return { variant: 'secondary' as const, text: 'OFFLINE' };
      case 'at festival': return { variant: 'warning' as const, text: 'AT FESTIVAL' };
      default: return { variant: 'secondary' as const, text: 'UNKNOWN' };
    }
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return { variant: 'success' as const, text: 'CONFIRMED' };
      case 'waitlist': return { variant: 'warning' as const, text: 'WAITLIST' };
      case 'interested': return { variant: 'primary' as const, text: 'INTERESTED' };
      default: return { variant: 'secondary' as const, text: status.toUpperCase() };
    }
  };

  return (
    <div className="page-container">
      <Stack spacing="6">
        {/* Profile Header */}
        <Card variant="elevated" padding="32">
          <Stack spacing="6">
            <div className="responsive-grid profile-header">
              <Stack align="center" spacing="4">
                <div className="profile-avatar">
                  <ModernIcon type={userData.icon} size="2xl" />
                </div>
                <Stack direction="horizontal" spacing="2" align="center">
                  {userData.verified && (
                    <Badge variant="success" size="md">
                      <ModernIcon type="crown" size="sm" />
                      VERIFIED
                    </Badge>
                  )}
                  <Badge variant="primary" size="md">
                    <ModernIcon type="diamond" size="sm" />
                    FLUX MEMBER
                  </Badge>
                </Stack>
              </Stack>

              <Stack spacing="4">
                <Stack spacing="2">
                  <Stack direction="horizontal" align="center" spacing="2">
                    <Heading size="4xl" weight="bold" semantic="primary">
                      {userData.displayName}
                    </Heading>
                    <Badge variant="success" size="md">
                      <ModernIcon type="star" size="sm" />
                    </Badge>
                  </Stack>

                  <Text variant="body-lg" semantic="secondary">
                    @{userData.username} • Member since {userData.joinDate}
                  </Text>

                  <Stack direction="horizontal" spacing="4" align="center" className="profile-info">
                    <Stack direction="horizontal" spacing="2" align="center">
                      <ModernIcon type="festival" size="sm" />
                      <Text variant="body-sm" semantic="secondary">{userData.location}</Text>
                    </Stack>
                    <Stack direction="horizontal" spacing="2" align="center">
                      <ModernIcon type="star" size="sm" />
                      <Text variant="body-sm" semantic="secondary">{userData.email}</Text>
                    </Stack>
                  </Stack>

                  <Text variant="body-lg" semantic="primary">
                    {userData.bio}
                  </Text>
                </Stack>

                <Stack direction="horizontal" spacing="3" className="profile-buttons">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  >
                    <ModernIcon type={editMode ? "star" : "crown"} size="sm" />
                    {editMode ? "SAVE CHANGES" : "EDIT PROFILE"}
                  </Button>
                  <Button variant="outline" size="lg">
                    <ModernIcon type="rocket" size="sm" />
                    SHARE PROFILE
                  </Button>
                  <Button variant="ghost" size="lg">
                    <ModernIcon type="diamond" size="sm" />
                    MORE
                  </Button>
                </Stack>
              </Stack>
            </div>

            {/* Profile Stats */}
            <div className="responsive-grid stats">
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="2">
                  <ModernIcon type="festival" size="lg" />
                  <Text variant="display" weight="bold" semantic="primary">{userData.stats.festivalsAttended}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Festivals Attended</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="2">
                  <ModernIcon type="crown" size="lg" />
                  <Text variant="display" weight="bold" semantic="primary">{userData.stats.artistsFollowed}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Artists Following</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="2">
                  <ModernIcon type="butterfly" size="lg" />
                  <Text variant="display" weight="bold" semantic="primary">{userData.stats.friendsConnected}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Friends Connected</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="2">
                  <ModernIcon type="star" size="lg" />
                  <Text variant="display" weight="bold" semantic="primary">{userData.stats.postsShared}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Posts Shared</Text>
                </Stack>
              </Card>
            </div>
          </Stack>
        </Card>

        {/* Tab Navigation */}
        <Card variant="glass" padding="20">
          <div className="responsive-grid profile-tabs">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: 'star' },
              { id: 'activity', label: 'ACTIVITY', icon: 'lightning' },
              { id: 'events', label: 'EVENTS', icon: 'festival' },
              { id: 'friends', label: 'FRIENDS', icon: 'butterfly' },
              { id: 'settings', label: 'SETTINGS', icon: 'crown' },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="md"
                onClick={() => setActiveTab(tab.id)}
              >
                <ModernIcon type={tab.icon as any} size="sm" />
                {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Content Layout */}
        <div className="responsive-grid profile-layout">
          {/* Main Content */}
          <div className="profile-main">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <Stack spacing="6">
                {/* Recent Activity */}
                <Card variant="elevated" padding="20">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">RECENT ACTIVITY</Heading>
                    <Divider />

                    <Stack spacing="3">
                      {userData.recentActivity.map((activity, index) => (
                        <div key={index} className="responsive-grid activity-item">
                          <Stack direction="horizontal" spacing="3" align="center">
                            <ModernIcon type={activity.icon as any} size="md" />
                            <Stack spacing="1">
                              <Text variant="body-sm" semantic="primary">
                                {activity.action}
                              </Text>
                              <Text variant="caption" semantic="secondary">
                                {activity.date}
                              </Text>
                            </Stack>
                          </Stack>
                          <Badge variant="secondary" size="sm">
                            {activity.type.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </Stack>
                  </Stack>
                </Card>

                {/* Achievements */}
                <Card variant="elevated" padding="20">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">ACHIEVEMENTS</Heading>
                    <Divider />

                    <div className="responsive-grid achievements">
                      {userData.achievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          variant={achievement.earned ? "elevated" : "outlined"}
                          padding="16"
                        >
                          <Stack spacing="3" align="center">
                            <ModernIcon type={achievement.icon} size="lg" />
                            <Stack spacing="1" align="center">
                              <Text variant="body-sm" weight="bold" semantic="primary">
                                {achievement.name}
                              </Text>
                              <Text variant="caption" semantic="secondary" align="center">
                                {achievement.description}
                              </Text>
                            </Stack>
                            {achievement.earned ? (
                              <Badge variant="success" size="sm">EARNED</Badge>
                            ) : (
                              <Text variant="caption" semantic="secondary">85% Complete</Text>
                            )}
                          </Stack>
                        </Card>
                      ))}
                    </div>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="2xl" weight="bold" semantic="primary">UPCOMING EVENTS</Heading>
                  <Divider />

                  <Stack spacing="3">
                    {userData.upcomingEvents.map((event) => {
                      const statusBadge = getEventStatusBadge(event.status);
                      return (
                        <Card key={event.name} variant="outlined" padding="16">
                          <div className="responsive-grid event-item">
                            <Stack spacing="2">
                              <Text variant="body-md" weight="bold" semantic="primary">
                                {event.name}
                              </Text>
                              <Stack direction="horizontal" spacing="4">
                                <Text variant="caption" semantic="secondary">
                                  {event.date}
                                </Text>
                                <Text variant="caption" semantic="secondary">
                                  {event.location}
                                </Text>
                              </Stack>
                            </Stack>
                            <Badge variant={statusBadge.variant} size="sm">
                              {statusBadge.text}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </Stack>
                </Stack>
              </Card>
            )}

            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <div className="responsive-grid friends-header">
                    <Heading size="2xl" weight="bold" semantic="primary">FESTIVAL FRIENDS</Heading>
                    <Button variant="primary" size="sm">
                      FIND FRIENDS
                    </Button>
                  </div>
                  <Divider />

                  <div className="responsive-grid friends">
                    {userData.friends.map((friend) => {
                      const statusBadge = getStatusBadge(friend.status);
                      return (
                        <Card key={friend.name} variant="outlined" padding="16">
                          <div className="responsive-grid friend-item">
                            <Stack direction="horizontal" spacing="3" align="center">
                              <ModernIcon type={friend.icon} size="lg" />
                              <Stack spacing="1">
                                <Text variant="body-sm" weight="bold" semantic="primary">
                                  {friend.name}
                                </Text>
                                <Text variant="caption" semantic="secondary">
                                  {friend.mutualFriends} mutual friends
                                </Text>
                              </Stack>
                            </Stack>
                            <Stack direction="horizontal" spacing="2" align="center">
                              <Badge variant={statusBadge.variant} size="sm">
                                {statusBadge.text}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                VIEW
                              </Button>
                            </Stack>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </Stack>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Stack spacing="6">
                {/* Profile Settings */}
                <Card variant="elevated" padding="20">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">PROFILE SETTINGS</Heading>
                    <Divider />

                    {editMode ? (
                      <Stack spacing="4">
                        <input
                          type="text"
                          placeholder="Display Name"
                          value={userInfo.displayName}
                          onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                          className="form-input"
                        />
                        <textarea
                          placeholder="Bio"
                          value={userInfo.bio}
                          onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                          rows={3}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={userInfo.location}
                          onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                          className="form-input"
                        />
                      </Stack>
                    ) : (
                      <Text variant="caption" semantic="secondary">
                        Click "Edit Profile" to modify your information
                      </Text>
                    )}
                  </Stack>
                </Card>

                {/* Privacy Settings */}
                <Card variant="elevated" padding="20">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">PRIVACY SETTINGS</Heading>
                    <Divider />

                    <Stack spacing="4">
                      <div className="responsive-grid setting-item">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Public Profile</Text>
                          <Text variant="caption" semantic="secondary">Allow others to find your profile</Text>
                        </Stack>
                        <label className="setting-switch">
                          <input
                            type="checkbox"
                            checked={settings.privacy.profilePublic}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, profilePublic: e.target.checked }
                            })}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="responsive-grid setting-item">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Show Location</Text>
                          <Text variant="caption" semantic="secondary">Display your location on profile</Text>
                        </Stack>
                        <label className="setting-switch">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showLocation}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, showLocation: e.target.checked }
                            })}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="responsive-grid setting-item">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Activity Visibility</Text>
                          <Text variant="caption" semantic="secondary">Show your festival activity to friends</Text>
                        </Stack>
                        <label className="setting-switch">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showActivity}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, showActivity: e.target.checked }
                            })}
                          />
                          <span></span>
                        </label>
                      </div>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="2xl" weight="bold" semantic="primary">ACTIVITY TIMELINE</Heading>
                  <Divider />

                  <Card variant="glass" padding="16">
                    <Text variant="body-sm" semantic="primary">
                      📊 <strong>Activity Feed:</strong> Your detailed activity timeline shows all your festival interactions, music discoveries, and social connections.
                    </Text>
                  </Card>
                </Stack>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <Stack spacing="6">
              {/* Music Preferences */}
              <Card variant="elevated" padding="20">
                <Stack spacing="4">
                  <Heading size="lg" weight="bold" semantic="primary">MUSIC TASTE</Heading>
                  <Divider />

                  <TagList
                    tags={userData.stats.favoriteGenres.map(genre => ({ id: genre, label: genre }))}
                    size="md"
                  />

                  <Card variant="glass" padding="16">
                    <Text variant="body-sm" semantic="primary">
                      🎵 <strong>Recommendation:</strong> Based on your taste, check out the new Techno Rising playlist!
                    </Text>
                  </Card>
                </Stack>
              </Card>

              {/* Quick Stats */}
              <Card variant="outlined" padding="20">
                <Stack spacing="4">
                  <Heading size="lg" weight="bold" semantic="primary">THIS MONTH</Heading>
                  <Divider />

                  <Stack spacing="2">
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">Festivals Attended</Text>
                      <Text variant="caption" semantic="primary">2</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">New Friends</Text>
                      <Text variant="caption" semantic="primary">8</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">Hours Listened</Text>
                      <Text variant="caption" semantic="primary">127h</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text variant="caption" semantic="secondary">Posts Shared</Text>
                      <Text variant="caption" semantic="primary">12</Text>
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