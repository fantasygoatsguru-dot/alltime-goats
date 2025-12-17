import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton, Chip } from '@mui/material';
import { ExpandMore, ExpandLess, Search } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { getSEOContent } from '../config/seo-content';

const SEOContent = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const seoData = getSEOContent(location.pathname);

  if (!seoData) return null;

  return (
    <Box
      component="section"
      sx={{
        mt: 4,
        mb: 2,
        mx: 'auto',
        maxWidth: '1200px',
        bgcolor: '#fff',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          bgcolor: '#f8f9fa',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: '#f0f2f5',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Search sx={{ color: '#666', fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem' },
              fontWeight: 600,
              color: '#333',
            }}
          >
            {seoData.title}
          </Typography>
          <Chip 
            label="Guide" 
            size="small" 
            sx={{ 
              bgcolor: '#e3f2fd', 
              color: '#1976d2',
              fontSize: '0.7rem',
              height: 20,
              display: { xs: 'none', sm: 'inline-flex' }
            }} 
          />
        </Box>
        <IconButton size="small" sx={{ color: '#666' }}>
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
            '& p': {
              mb: 2,
              lineHeight: 1.7,
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              color: '#444',
              textAlign: 'justify',
            },
            '& p:last-child': {
              mb: 0,
            },
          }}
        >
          <Box dangerouslySetInnerHTML={{ __html: seoData.content }} />
          
          {seoData.keywords && seoData.keywords.length > 0 && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 1.5,
                  color: '#666',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Related Topics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {seoData.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    sx={{
                      bgcolor: '#f5f5f5',
                      color: '#555',
                      fontSize: '0.75rem',
                      '&:hover': {
                        bgcolor: '#e0e0e0',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default SEOContent;

