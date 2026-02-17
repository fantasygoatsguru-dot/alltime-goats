import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@mui/material";

export default function MarkdownBlockRenderer({ value }) {
  if (!value?.content) return null;
  return (
    <Box
      sx={{
        my: 4,
        overflowX: "auto",
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          my: 2,
          backgroundColor: '#f9fafb',
        },
        '& th, & td': {
          border: '1.5px solid #bdbdbd',
          px: 2,
          py: 1,
          textAlign: 'left',
          color: '#222',
          backgroundColor: '#fff',
        },
        '& th': {
          backgroundColor: '#f1f3f6',
          fontWeight: 700,
          color: '#111',
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{value.content}</ReactMarkdown>
    </Box>
  );
}
