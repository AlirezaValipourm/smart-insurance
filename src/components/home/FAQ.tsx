'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// FAQ data
const faqItems = [
  {
    question: 'How do I get a quote for insurance?',
    answer: 'You can get a quote by selecting the type of insurance you need from our homepage and filling out the application form. The system will generate a quote based on the information you provide.'
  },
  {
    question: 'How long does it take to process a claim?',
    answer: 'Most claims are processed within 3-5 business days. Complex claims may take longer. You can check the status of your claim at any time through your account dashboard.'
  },
  {
    question: 'Can I modify my coverage after purchasing a policy?',
    answer: 'Yes, you can modify your coverage at any time. Simply log in to your account, navigate to your policy details, and select the "Modify Coverage" option. Changes to your coverage may affect your premium.'
  },
  {
    question: 'Are there discounts for bundling multiple insurance policies?',
    answer: 'Yes, we offer discounts when you bundle multiple insurance policies with us. For example, you can save up to 15% when you combine home and auto insurance.'
  },
  {
    question: 'How do I file a claim?',
    answer: 'You can file a claim online through your account dashboard, by calling our claims hotline at 1-800-555-CLAIM, or by using our mobile app. We recommend having your policy number and details of the incident ready when filing a claim.'
  }
];

/**
 * FAQ component with expandable accordion items
 */
export function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Find answers to common questions about our insurance services
        </Typography>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                '&:before': {
                  display: 'none',
                },
                borderRadius: '8px !important',
                overflow: 'hidden',
                '&.Mui-expanded': {
                  boxShadow: theme.shadows[2],
                  borderColor: 'transparent'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '16px 0',
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 