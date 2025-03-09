'use client';

import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ShieldOutlined } from '@mui/icons-material';
import {
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  HealthAndSafety as HealthIcon,
  Pets as PetsIcon,
  Business as BusinessIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

interface FormHeaderProps {
  title: string;
  onBack: () => void;
}

/**
 * Form header component for the form page
 */
export function FormHeader({ title, onBack }: FormHeaderProps) {
  const theme = useTheme();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <ShieldOutlined fontSize='large'/>
          </Avatar>
          <Typography variant="h5">
            {title}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Options
        </Button>
      </Box>
    </Paper>
  );
} 