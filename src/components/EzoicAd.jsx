import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const EzoicAd = ({ placeholderId, style = {} }) => {
  useEffect(() => {
    // Ezoic ad loading script
    if (window.ezstandalone) {
      window.ezstandalone.cmd.push(function() {
        window.ezstandalone.define(placeholderId);
      });
    }
  }, [placeholderId]);

  return (
    <Box
      id={placeholderId}
      sx={{
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        border: '1px solid #333333',
        borderRadius: '4px',
        margin: '16px 0',
        ...style
      }}
    >
      {/* Ad will be injected here by Ezoic */}
    </Box>
  );
};

export default EzoicAd;
