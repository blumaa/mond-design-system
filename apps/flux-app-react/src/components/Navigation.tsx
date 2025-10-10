import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Text, Badge, Box } from '@mond-design-system/theme';
import { ModernIcon } from './ModernIcon';

const navigationItems = [
  { href: '/', label: 'DISCOVER', icon: 'music' as const },
  { href: '/artists', label: 'ARTISTS', icon: 'crown' as const },
  { href: '/feed', label: 'FEED', icon: 'star' as const },
  { href: '/tickets', label: 'TICKETS', icon: 'diamond' as const },
  { href: '/profile', label: 'PROFILE', icon: 'rocket' as const },
];

export function Navigation() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: 'UTC'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="nav-container">
      <div className="nav-content">
        {/* Brand section */}
        <div className="nav-brand">
          <Text
            variant="body-md"
            weight="bold"
            semantic="primary"
          >
            FLUX.FEST
          </Text>
          <Text
            variant="caption"
            semantic="primary"
          >
            v2.0.0
          </Text>
          <Badge variant="success" size="sm">
            LIVE
          </Badge>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="sm"
                  p="md"
                >
                  <ModernIcon type={item.icon} size="sm" />
                  <Text variant="body" weight={isActive ? "bold" : "normal"} semantic="primary">
                    {item.label}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </div>

        {/* Desktop Status section */}
        <div className="nav-status">
          <Text
            variant="caption"
            semantic="primary"
          >
            UTC: {currentTime}
          </Text>
          <Badge variant="primary" size="sm">
            FESTIVAL MODE
          </Badge>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu open">
          <div className="mobile-menu-links">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="md"
                    p="md"
                  >
                    <ModernIcon type={item.icon} size="sm" />
                    <Text variant="body" weight={isActive ? "bold" : "normal"} semantic="primary">
                      {item.label}
                    </Text>
                  </Box>
                </Link>
              );
            })}
          </div>

          <div className="mobile-menu-status">
            <Text
              variant="caption"
              semantic="primary"
            >
              UTC: {currentTime}
            </Text>
            <Badge variant="primary" size="sm">
              FESTIVAL MODE
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}