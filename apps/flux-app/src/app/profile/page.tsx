'use client';

import React, { useState } from 'react';
import {
  Card,
  Stack,
  Box,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
  Input,
  Textarea,
  Select,
  AvatarGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert,
  Switch,
  Tooltip,
  Dropdown,
  Breadcrumb,
  TagList,
} from "@mond-design-system/theme";
import { PulseAnimation } from "../../components/PulseAnimation";
import { ModernIcon } from "../../components/ModernIcon";

// Mock user data
const userData = {
  id: "raver-001",
  username: "ElectricDreamer",
  displayName: "Alex Storm",
  icon: "lightning" as const,
  email: "alex.storm@flux.fest",
  phone: "+1 (555) 123-4567",
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
    { id: "first-festival", name: "First Festival", description: "Attended your first festival", earned: true, icon: "festival" },
    { id: "social-butterfly", name: "Social Butterfly", description: "Connected with 100 friends", earned: true, icon: "butterfly" },
    { id: "music-explorer", name: "Music Explorer", description: "Discovered 50 new artists", earned: true, icon: "search" },
    { id: "festival-veteran", name: "Festival Veteran", description: "Attended 50 festivals", earned: false, icon: "trophy" },
  ],
};


export default function UserProfile() {
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
    // Save logic would go here
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return { variant: 'success' as const, text: 'ONLINE' };
      case 'offline': return { variant: 'default' as const, text: 'OFFLINE' };
      case 'at festival': return { variant: 'warning' as const, text: 'AT FESTIVAL' };
      default: return { variant: 'default' as const, text: 'UNKNOWN' };
    }
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return { variant: 'success' as const, text: 'CONFIRMED' };
      case 'waitlist': return { variant: 'warning' as const, text: 'WAITLIST' };
      case 'interested': return { variant: 'primary' as const, text: 'INTERESTED' };
      default: return { variant: 'default' as const, text: status.toUpperCase() };
    }
  };

  return (
    <Box bg="surface.background" position="relative" minHeight="100vh">
      <PulseAnimation />

      {/* Enhanced Profile Header */}
      <Box bg="surface.elevated" borderBottom="1px solid" borderColor="border.subtle" py="24" px="32">
        <Stack spacing="4" maxWidth="1400px" mx="auto">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Profile', href: '/profile' }
            ]}
          />
        </Stack>
      </Box>

      <Box p="32" maxWidth="1400px" mx="auto">
        <Stack spacing="32">
          {/* Modern Profile Header */}
          <Card variant="elevated" padding="40">
            <Stack spacing="24">
              <Stack direction="horizontal" justify="between" align="start">
                <Stack direction="horizontal" spacing="12" align="start">
                  <Stack align="center" spacing="6">
                    <Box
                      width="120px"
                      height="120px"
                      borderRadius="full"
                      bg="gradient.primary"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ModernIcon type={userData.icon} size="2xl" />
                    </Box>
                    <Stack direction="horizontal" spacing="3" align="center">
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

                  <Stack spacing="8" flex="1">
                    <Stack spacing="6">
                      <Stack direction="horizontal" align="center" spacing="4">
                        <Heading size="4xl" weight="bold" semantic="primary">
                          {userData.displayName}
                        </Heading>
                        <Tooltip content="Verified Festival Enthusiast">
                          <Badge variant="success" size="md">
                            <ModernIcon type="star" size="sm" />
                          </Badge>
                        </Tooltip>
                      </Stack>

                      <Stack spacing="2">
                        <Text variant="body-lg" semantic="secondary">
                          @{userData.username} • Member since {userData.joinDate}
                        </Text>
                        <Stack direction="horizontal" spacing="6" align="center">
                          <Stack direction="horizontal" spacing="2" align="center">
                            <ModernIcon type="festival" size="sm" />
                            <Text variant="body-sm" semantic="secondary">{userData.location}</Text>
                          </Stack>
                          <Stack direction="horizontal" spacing="2" align="center">
                            <ModernIcon type="star" size="sm" />
                            <Text variant="body-sm" semantic="secondary">{userData.email}</Text>
                          </Stack>
                        </Stack>
                      </Stack>

                      <Text variant="body-lg" semantic="primary">
                        {userData.bio}
                      </Text>
                    </Stack>

                    <Stack direction="horizontal" spacing="4">
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

                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="lg">
                            <ModernIcon type="diamond" size="sm" />
                            MORE
                          </Button>
                        }
                      options={[
                        { value: 'export', label: 'Export Data' },
                        { value: 'privacy', label: 'Privacy Settings' },
                        { value: 'block', label: 'Block User' },
                        { value: 'report', label: 'Report Profile' }
                      ]}
                      onSelect={(_value) => {/* Handle selection */}}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* Enhanced Profile Stats */}
            <div className="responsive-stats-grid">
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="3">
                  <ModernIcon type="festival" size="lg" />
                  <Text variant="display" semantic="primary">{userData.stats.festivalsAttended}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Festivals Attended</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="3">
                  <ModernIcon type="crown" size="lg" />
                  <Text variant="display" semantic="primary">{userData.stats.artistsFollowed}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Artists Following</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="3">
                  <ModernIcon type="butterfly" size="lg" />
                  <Text variant="display" semantic="primary">{userData.stats.friendsConnected}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Friends Connected</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="3">
                  <ModernIcon type="star" size="lg" />
                  <Text variant="display" semantic="primary">{userData.stats.postsShared}</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Posts Shared</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="16">
                <Stack align="center" spacing="3">
                  <ModernIcon type="music" size="lg" />
                  <Text variant="display" semantic="primary">{userData.stats.hoursListened}h</Text>
                  <Text variant="body-sm" semantic="secondary" weight="medium" align="center">Music Listened</Text>
                </Stack>
              </Card>
            </div>
          </Stack>
        </Card>

        {/* Enhanced Tabbed Content */}
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              <ModernIcon type="star" size="sm" />
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="activity">
              <ModernIcon type="lightning" size="sm" />
              ACTIVITY
            </TabsTrigger>
            <TabsTrigger value="events">
              <ModernIcon type="festival" size="sm" />
              EVENTS
            </TabsTrigger>
            <TabsTrigger value="friends">
              <ModernIcon type="butterfly" size="sm" />
              FRIENDS
            </TabsTrigger>
            <TabsTrigger value="settings">
              <ModernIcon type="crown" size="sm" />
              SETTINGS
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="responsive-main-layout">
              <Box>
                <Stack spacing="6">
                  {/* Recent Activity */}
                  <Card variant="elevated" padding="20">
                    <Stack spacing="4">
                      <Heading size="2xl" weight="bold" semantic="primary">RECENT ACTIVITY</Heading>
                      <Divider />

                      <Stack spacing="2">
                        {userData.recentActivity.map((activity, index) => (
                          <Stack key={index} direction="horizontal" spacing="4" align="center">
                            <Text variant="body-md">{activity.icon}</Text>
                            <Stack spacing="1" flex="1">
                              <Text variant="body-sm" semantic="primary">
                                {activity.action}
                              </Text>
                              <Text variant="caption" semantic="secondary">
                                {activity.date}
                              </Text>
                            </Stack>
                            <Badge variant="default" size="sm">
                              {activity.type.toUpperCase()}
                            </Badge>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Achievements */}
                  <Card variant="elevated" padding="20">
                    <Stack spacing="4">
                      <Heading size="2xl" weight="bold" semantic="primary">ACHIEVEMENTS</Heading>
                      <Divider />

                      <div className="responsive-cards-grid">
                        {userData.achievements.map((achievement) => (
                          <Card
                            key={achievement.id}
                            variant={achievement.earned ? "elevated" : "outlined"}
                            padding="md"
                          >
                            <Stack spacing="2" align="center">
                              <Box>
                                <ModernIcon type={achievement.icon as any} size="lg" />
                              </Box>
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
              </Box>

              {/* Sidebar */}
              <div className="desktop-sidebar">
                <Stack spacing="6">
                {/* Music Preferences */}
                <Card variant="elevated" padding="lg">
                  <Stack spacing="4">
                    <Heading size="xl" weight="bold" semantic="primary">MUSIC TASTE</Heading>
                    <Divider />

                    <TagList
                      tags={userData.stats.favoriteGenres.map(genre => ({ id: genre, label: genre }))}
                      size="md"
                    />

                    <Alert variant="info" title="Recommendation">
                      <Text variant="body-sm">
                        Based on your taste, check out the new Techno Rising playlist!
                      </Text>
                    </Alert>
                  </Stack>
                </Card>

                {/* Quick Stats */}
                <Card variant="outlined" padding="lg">
                  <Stack spacing="4">
                    <Heading size="xl" weight="bold" semantic="primary">THIS MONTH</Heading>
                    <Divider />

                    <Stack spacing="2">
                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">Festivals Attended</Text>
                        <Text variant="caption" semantic="primary">2</Text>
                      </Stack>
                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">New Friends</Text>
                        <Text variant="caption" semantic="primary">8</Text>
                      </Stack>
                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">Hours Listened</Text>
                        <Text variant="caption" semantic="primary">127h</Text>
                      </Stack>
                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">Posts Shared</Text>
                        <Text variant="caption" semantic="primary">12</Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
                </Stack>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Stack spacing="6">
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Stack direction="horizontal" justify="between" align="center">
                    <Heading size="2xl" weight="bold" semantic="primary">ACTIVITY TIMELINE</Heading>
                    <Select
                      value="all"
                      options={[
                        { value: 'all', label: 'All Activity' },
                        { value: 'festivals', label: 'Festivals Only' },
                        { value: 'social', label: 'Social Only' },
                        { value: 'music', label: 'Music Only' }
                      ]}
                    />
                  </Stack>
                  <Divider />

                  {/* Extended activity list would go here */}
                  <Alert variant="info" title="Activity Feed">
                    <Text variant="body-sm">
                      Your detailed activity timeline will show all your festival interactions, music discoveries, and social connections.
                    </Text>
                  </Alert>
                </Stack>
              </Card>
            </Stack>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Stack spacing="6">
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Heading size="2xl" weight="bold" semantic="primary">UPCOMING EVENTS</Heading>
                  <Divider />

                  <Card variant="outlined" padding="md">
                    <Stack spacing="2">
                      <Text variant="body-sm" weight="bold" semantic="primary">
                        Upcoming Events Overview
                      </Text>
                      <Text variant="caption" semantic="secondary">
                        {userData.upcomingEvents.length} events scheduled
                      </Text>
                    </Stack>
                  </Card>

                  <Stack spacing="2">
                    {userData.upcomingEvents.map((event) => {
                      const statusBadge = getEventStatusBadge(event.status);
                      return (
                        <Card key={event.name} variant="outlined" padding="md">
                          <Stack direction="horizontal" justify="between" align="center">
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
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            <Stack spacing="6">
              <Card variant="elevated" padding="lg">
                <Stack spacing="4">
                  <Stack direction="horizontal" justify="between" align="center">
                    <Heading size="2xl" weight="bold" semantic="primary">FESTIVAL FRIENDS</Heading>
                    <Button variant="primary" size="sm">
                      FIND FRIENDS
                    </Button>
                  </Stack>
                  <Divider />

                  <AvatarGroup
                    avatars={userData.friends.map(friend => ({
                      id: friend.name,
                      name: friend.name,
                      // Using ModernIcon instead of src
                    }))}
                    maxCount={8}
                    size="lg"
                  />

                  <div className="responsive-cards-grid">
                    {userData.friends.map((friend) => {
                      const statusBadge = getStatusBadge(friend.status);
                      return (
                        <Card key={friend.name} variant="outlined" padding="md">
                          <Stack direction="horizontal" justify="between" align="center">
                            <Stack direction="horizontal" spacing="4" align="center">
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
                          </Stack>
                        </Card>
                      );
                    })}
                  </div>
                </Stack>
              </Card>
            </Stack>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="responsive-main-layout">
              <Stack spacing="6">
                {/* Profile Settings */}
                <Card variant="elevated" padding="lg">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">PROFILE SETTINGS</Heading>
                    <Divider />

                    {editMode ? (
                      <Stack spacing="4">
                        <Input
                          label="Display Name"
                          value={userInfo.displayName}
                          onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                        />
                        <Textarea
                          label="Bio"
                          value={userInfo.bio}
                          onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                          rows={3}
                        />
                        <Input
                          label="Location"
                          value={userInfo.location}
                          onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                        />
                        <Input
                          type="file"
                          label="Profile Avatar"
                          accept="image/*"
                          inputSize="md"
                        />
                      </Stack>
                    ) : (
                      <Stack spacing="2">
                        <Text variant="caption" semantic="secondary">Click &quot;Edit Profile&quot; to modify your information</Text>
                      </Stack>
                    )}
                  </Stack>
                </Card>

                {/* Privacy Settings */}
                <Card variant="elevated" padding="lg">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">PRIVACY SETTINGS</Heading>
                    <Divider />

                    <Stack spacing="4">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Public Profile</Text>
                          <Text variant="caption" semantic="secondary">Allow others to find your profile</Text>
                        </Stack>
                        <Switch
                          checked={settings.privacy.profilePublic}
                          onChange={(e) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, profilePublic: e.target.checked }
                          })}
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Show Location</Text>
                          <Text variant="caption" semantic="secondary">Display your location on profile</Text>
                        </Stack>
                        <Switch
                          checked={settings.privacy.showLocation}
                          onChange={(e) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showLocation: e.target.checked }
                          })}
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Activity Visibility</Text>
                          <Text variant="caption" semantic="secondary">Show your festival activity to friends</Text>
                        </Stack>
                        <Switch
                          checked={settings.privacy.showActivity}
                          onChange={(e) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showActivity: e.target.checked }
                          })}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>

              <div className="desktop-sidebar">
                <Stack spacing="6">
                  {/* Notification Settings */}
                <Card variant="elevated" padding="lg">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">NOTIFICATIONS</Heading>
                    <Divider />

                    <Stack spacing="4">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Email Notifications</Text>
                          <Text variant="caption" semantic="secondary">Festival updates and friend activity</Text>
                        </Stack>
                        <Switch
                          checked={settings.notifications.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, email: e.target.checked }
                          })}
                          label="Email notifications"
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Push Notifications</Text>
                          <Text variant="caption" semantic="secondary">Real-time alerts on your device</Text>
                        </Stack>
                        <Switch
                          checked={settings.notifications.push}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: e.target.checked }
                          })}
                          label="Push notifications"
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">SMS Notifications</Text>
                          <Text variant="caption" semantic="secondary">Important updates via text message</Text>
                        </Stack>
                        <Switch
                          checked={settings.notifications.sms}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, sms: e.target.checked }
                          })}
                          label="SMS notifications"
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>

                {/* App Preferences */}
                <Card variant="elevated" padding="lg">
                  <Stack spacing="4">
                    <Heading size="2xl" weight="bold" semantic="primary">APP PREFERENCES</Heading>
                    <Divider />

                    <Stack spacing="4">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Auto-play Music</Text>
                          <Text variant="caption" semantic="secondary">Automatically play previews</Text>
                        </Stack>
                        <Switch
                          checked={settings.preferences.autoPlay}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, autoPlay: e.target.checked }
                          })}
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">High Quality Audio</Text>
                          <Text variant="caption" semantic="secondary">Better sound quality (uses more data)</Text>
                        </Stack>
                        <Switch
                          checked={settings.preferences.highQuality}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, highQuality: e.target.checked }
                          })}
                        />
                      </Stack>

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack spacing="1">
                          <Text variant="body-sm" weight="bold" semantic="primary">Dark Mode</Text>
                          <Text variant="caption" semantic="secondary">Use dark theme</Text>
                        </Stack>
                        <Switch
                          checked={settings.preferences.darkMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, darkMode: e.target.checked }
                          })}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>

                {/* Account Actions */}
                <Card variant="outlined" padding="lg">
                  <Stack spacing="4">
                    <Heading size="xl" weight="bold" semantic="primary">ACCOUNT ACTIONS</Heading>
                    <Divider />

                    <Stack spacing="2">
                      <Button variant="outline" size="sm">
                        EXPORT DATA
                      </Button>
                      <Button variant="outline" size="sm">
                        DEACTIVATE ACCOUNT
                      </Button>
                      <Button variant="outline" size="sm">
                        DELETE ACCOUNT
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
                </Stack>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Stack>
      </Box>
    </Box>
  );
}