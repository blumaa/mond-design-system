import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Box } from '@mond-design-system/theme';
import { fluxTheme } from '@mond-design-system/theme';
import { Navigation } from './components/Navigation';
import { PulseAnimation } from './components/PulseAnimation';

// Import page components
import Home from './pages/Home';
import Artists from './pages/Artists';
import Feed from './pages/Feed';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider brandTheme={fluxTheme} colorScheme="dark">
      <Router>
        <Box minHeight="100vh" bg="surface.background">
          <PulseAnimation />
          <Navigation />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;