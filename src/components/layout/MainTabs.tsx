'use client';

import {
  Box,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface MainTabsProps {
  tabIndex: number;
  isMobile: boolean;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

/**
 * Main tabs component for the application
 */
export function MainTabs({ tabIndex, isMobile, onTabChange }: MainTabsProps) {
  const theme = useTheme();

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider', 
      mb: 4,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      bgcolor: theme.palette.background.paper,
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Tabs
        value={tabIndex}
        onChange={onTabChange}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons={isMobile ? 'auto' : undefined}
        sx={{ 
          '& .MuiTab-root': { 
            py: 2,
            fontWeight: 'medium'
          } 
        }}
      >
        <Tab label="Apply for Insurance" icon={<SecurityIcon />} iconPosition="start" />
        <Tab label="My Applications" icon={<CheckCircleIcon />} iconPosition="start" />
      </Tabs>
    </Box>
  );
} 