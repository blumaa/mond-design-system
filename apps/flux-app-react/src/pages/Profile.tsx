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
      <Box gap="md">
        {/* Profile Header */}
        <Box>
          <Box gap="md">
            <div className="responsive-grid profile-header">
              <Box alignItems="center" gap="md">
                <div className="profile-avatar">
                  <ModernIcon type={userData.icon} size="2xl" />
                </div>
                <Box display="flex" gap="md" alignItems="center">
                  {userData.verified && (
                    <Badge size="md">
                      <ModernIcon type="crown" size="sm" />
                      VERIFIED
                    </Badge>
                  )}
                  <Badge size="md">
                    <ModernIcon type="diamond" size="sm" />
                    FLUX MEMBER
                  </Badge>
                </Box>
              </Box>

              <Box gap="md">
                <Box gap="md">
                  <Box display="flex" alignItems="center" gap="md">
                    <Heading size="4xl" weight="bold" semantic="primary">
                      {userData.displayName}
                    </Heading>
                    <Badge size="md">
                      <ModernIcon type="star" size="sm" />
                    </Badge>
                  </Box>

                  <Text semantic="secondary">
                    @{userData.username} • Member since {userData.joinDate}
                  </Text>

                  <Box display="flex" gap="md" alignItems="center" className="profile-info">
                    <Box display="flex" gap="md" alignItems="center">
                      <ModernIcon type="festival" size="sm" />
                      <Text semantic="secondary">{userData.location}</Text>
                    </Box>
                    <Box display="flex" gap="md" alignItems="center">
                      <ModernIcon type="star" size="sm" />
                      <Text semantic="secondary">{userData.email}</Text>
                    </Box>
                  </Box>

                  <Text semantic="primary">
                    {userData.bio}
                  </Text>
                </Box>

                <Box display="flex" gap="md" className="profile-buttons">
                  <Button
                   
                    size="lg"
                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  >
                    <ModernIcon type={editMode ? "star" : "crown"} size="sm" />
                    {editMode ? "SAVE CHANGES" : "EDIT PROFILE"}
                  </Button>
                  <Button size="lg">
                    <ModernIcon type="rocket" size="sm" />
                    SHARE PROFILE
                  </Button>
                  <Button size="lg">
                    <ModernIcon type="diamond" size="sm" />
                    MORE
                  </Button>
                </Box>
              </Box>
            </div>

            {/* Profile Stats */}
            <div className="responsive-grid stats">
              <Box>
                <Box alignItems="center" gap="md">
                  <ModernIcon type="festival" size="lg" />
                  <Text weight="bold" semantic="primary">{userData.stats.festivalsAttended}</Text>
                  <Text semantic="secondary" weight="medium" alignItems="center">Festivals Attended</Text>
                </Box>
              </Box>
              <Box>
                <Box alignItems="center" gap="md">
                  <ModernIcon type="crown" size="lg" />
                  <Text weight="bold" semantic="primary">{userData.stats.artistsFollowed}</Text>
                  <Text semantic="secondary" weight="medium" alignItems="center">Artists Following</Text>
                </Box>
              </Box>
              <Box>
                <Box alignItems="center" gap="md">
                  <ModernIcon type="butterfly" size="lg" />
                  <Text weight="bold" semantic="primary">{userData.stats.friendsConnected}</Text>
                  <Text semantic="secondary" weight="medium" alignItems="center">Friends Connected</Text>
                </Box>
              </Box>
              <Box>
                <Box alignItems="center" gap="md">
                  <ModernIcon type="star" size="lg" />
                  <Text weight="bold" semantic="primary">{userData.stats.postsShared}</Text>
                  <Text semantic="secondary" weight="medium" alignItems="center">Posts Shared</Text>
                </Box>
              </Box>
            </div>
          </Box>
        </Box>

        {/* Tab Navigation */}
        <Box>
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
        </Box>

        {/* Main Content Layout */}
        <div className="responsive-grid profile-layout">
          {/* Main Content */}
          <div className="profile-main">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <Box gap="md">
                {/* Recent Activity */}
                <Box>
                  <Box gap="md">
                    <Heading size="2xl" weight="bold" semantic="primary">RECENT ACTIVITY</Heading>
                    <Divider />

                    <Box gap="md">
                      {userData.recentActivity.map((activity, index) => (
                        <div key={index} className="responsive-grid activity-item">
                          <Box display="flex" gap="md" alignItems="center">
                            <ModernIcon type={activity.icon as any} size="md" />
                            <Box gap="md">
                              <Text semantic="primary">
                                {activity.action}
                              </Text>
                              <Text semantic="secondary">
                                {activity.date}
                              </Text>
                            </Box>
                          </Box>
                          <Badge size="sm">
                            {activity.type.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Achievements */}
                <Box>
                  <Box gap="md">
                    <Heading size="2xl" weight="bold" semantic="primary">ACHIEVEMENTS</Heading>
                    <Divider />

                    <div className="responsive-grid achievements">
                      {userData.achievements.map((achievement) => (
                        <Box
                          key={achievement.id}
                          bg={achievement.earned ? "surface.elevated" : undefined}
                          p="lg"
                          borderRadius={8}
                        >
                          <Box gap="md" alignItems="center">
                            <ModernIcon type={achievement.icon} size="lg" />
                            <Box gap="md" alignItems="center">
                              <Text weight="bold" semantic="primary">
                                {achievement.name}
                              </Text>
                              <Text semantic="secondary" alignItems="center">
                                {achievement.description}
                              </Text>
                            </Box>
                            {achievement.earned ? (
                              <Badge size="sm">EARNED</Badge>
                            ) : (
                              <Text semantic="secondary">85% Complete</Text>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </div>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <Box>
                <Box gap="md">
                  <Heading size="2xl" weight="bold" semantic="primary">UPCOMING EVENTS</Heading>
                  <Divider />

                  <Box gap="md">
                    {userData.upcomingEvents.map((event) => {
                      const statusBadge = getEventStatusBadge(event.status);
                      return (
                        <Box key={event.name}>
                          <div className="responsive-grid event-item">
                            <Box gap="md">
                              <Text weight="bold" semantic="primary">
                                {event.name}
                              </Text>
                              <Box display="flex" gap="md">
                                <Text semantic="secondary">
                                  {event.date}
                                </Text>
                                <Text semantic="secondary">
                                  {event.location}
                                </Text>
                              </Box>
                            </Box>
                            <Badge variant={statusBadge.variant} size="sm">
                              {statusBadge.text}
                            </Badge>
                          </div>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <Box>
                <Box gap="md">
                  <div className="responsive-grid friends-header">
                    <Heading size="2xl" weight="bold" semantic="primary">FESTIVAL FRIENDS</Heading>
                    <Button size="sm">
                      FIND FRIENDS
                    </Button>
                  </div>
                  <Divider />

                  <div className="responsive-grid friends">
                    {userData.friends.map((friend) => {
                      const statusBadge = getStatusBadge(friend.status);
                      return (
                        <Box key={friend.name}>
                          <div className="responsive-grid friend-item">
                            <Box display="flex" gap="md" alignItems="center">
                              <ModernIcon type={friend.icon} size="lg" />
                              <Box gap="md">
                                <Text weight="bold" semantic="primary">
                                  {friend.name}
                                </Text>
                                <Text semantic="secondary">
                                  {friend.mutualFriends} mutual friends
                                </Text>
                              </Box>
                            </Box>
                            <Box display="flex" gap="md" alignItems="center">
                              <Badge variant={statusBadge.variant} size="sm">
                                {statusBadge.text}
                              </Badge>
                              <Button size="sm">
                                VIEW
                              </Button>
                            </Box>
                          </div>
                        </Box>
                      );
                    })}
                  </div>
                </Box>
              </Box>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Box gap="md">
                {/* Profile Settings */}
                <Box>
                  <Box gap="md">
                    <Heading size="2xl" weight="bold" semantic="primary">PROFILE SETTINGS</Heading>
                    <Divider />

                    {editMode ? (
                      <Box gap="md">
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
                      </Box>
                    ) : (
                      <Text semantic="secondary">
                        Click "Edit Profile" to modify your information
                      </Text>
                    )}
                  </Box>
                </Box>

                {/* Privacy Settings */}
                <Box>
                  <Box gap="md">
                    <Heading size="2xl" weight="bold" semantic="primary">PRIVACY SETTINGS</Heading>
                    <Divider />

                    <Box gap="md">
                      <div className="responsive-grid setting-item">
                        <Box gap="md">
                          <Text weight="bold" semantic="primary">Public Profile</Text>
                          <Text semantic="secondary">Allow others to find your profile</Text>
                        </Box>
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
                        <Box gap="md">
                          <Text weight="bold" semantic="primary">Show Location</Text>
                          <Text semantic="secondary">Display your location on profile</Text>
                        </Box>
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
                        <Box gap="md">
                          <Text weight="bold" semantic="primary">Activity Visibility</Text>
                          <Text semantic="secondary">Show your festival activity to friends</Text>
                        </Box>
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
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <Box>
                <Box gap="md">
                  <Heading size="2xl" weight="bold" semantic="primary">ACTIVITY TIMELINE</Heading>
                  <Divider />

                  <Box>
                    <Text semantic="primary">
                      📊 <strong>Activity Feed:</strong> Your detailed activity timeline shows all your festival interactions, music discoveries, and social connections.
                    </Text>
                  </Box>
                </Box>
              </Box>
            )}
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <Box gap="md">
              {/* Music Preferences */}
              <Box>
                <Box gap="md">
                  <Heading size="lg" weight="bold" semantic="primary">MUSIC TASTE</Heading>
                  <Divider />

                  <Box display="flex" gap="sm">
                    {userData.stats.favoriteGenres.map(genre => (
                      <Badge key={genre} size="sm">
                        {genre}
                      </Badge>
                    ))}
                  </Box>

                  <Box bg="surface.elevated" p="md" borderRadius={8}>
                    <Text semantic="primary">
                      🎵 <strong>Recommendation:</strong> Based on your taste, check out the new Techno Rising playlist!
                    </Text>
                  </Box>
                </Box>
              </Box>

              {/* Quick Stats */}
              <Box>
                <Box gap="md">
                  <Heading size="lg" weight="bold" semantic="primary">THIS MONTH</Heading>
                  <Divider />

                  <Box gap="md">
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">Festivals Attended</Text>
                      <Text semantic="primary">2</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">New Friends</Text>
                      <Text semantic="primary">8</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">Hours Listened</Text>
                      <Text semantic="primary">127h</Text>
                    </div>
                    <div className="responsive-grid stat-item">
                      <Text semantic="secondary">Posts Shared</Text>
                      <Text semantic="primary">12</Text>
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