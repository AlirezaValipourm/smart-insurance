'use client';

import {
  ShieldOutlined
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import { FormStructure } from '../../store/slices/formSlice';

interface InsuranceOptionsProps {
  forms: FormStructure[] | undefined;
  onSelectForm: (formId: string) => void;
}

export function InsuranceOptions({ forms, onSelectForm }: InsuranceOptionsProps) {
  const theme = useTheme();

  return (
    <Box id="insurance-options">
      <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
        Select Insurance Type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose from our range of insurance products designed to meet your needs
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 3
        }}
      >
        {forms?.map((form) => (
          <Card 
            key={form.formId} 
            elevation={3}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8
              }
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: theme.palette.primary.main,
                  mb: 2
                }}
              >
                <ShieldOutlined fontSize='large'/>
              </Avatar>
              <Typography variant="h5" gutterBottom align="center">
                {form.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Complete protection for your {form.title.toLowerCase().replace(' insurance', '')}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 'auto' }}
                fullWidth
                onClick={() => onSelectForm(form.formId)}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
} 