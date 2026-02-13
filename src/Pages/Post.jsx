import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../sanity/client";
import {
  Box,
  Typography,
  CircularProgress,
  Link,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlBuilder = imageUrlBuilder({ projectId, dataset });

const urlFor = (source) => {
  return urlBuilder.image(source);
};

// Custom components for images inside the PortableText body
const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <Box
          component="img"
          src={urlFor(value).width(800).fit("max").auto("format").url()}
          alt={value.alt || "Post image"}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            my: 4,
            display: "block",
            boxShadow: 2,
          }}
        />
      );
    },
  },
  // ADDED: Explicitly handle blockquotes within PortableText
  block: {
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: '5px solid #1976d2', // Your signature Blue
          pl: 3,
          py: 1,
          my: 4,
          bgcolor: 'rgba(25, 118, 210, 0.05)', // Very faint blue background
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: '#333333', // Force dark gray for visibility
        }}
      >
        {children}
      </Box>
    ),
  },
};

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(POST_QUERY, { slug });
        if (!data) {
          setError("Post not found.");
        } else {
          setPost(data);
        }
      } catch (err) {
        setError("Failed to fetch post. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography sx={{ mb: 3, p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#b71c1c' }}>
          {error || "Post not found."}
        </Typography>
        <Link component={RouterLink} to="/posts" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <ArrowBackIcon /> Back to Posts
        </Link>
      </Container>
    );
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(1200).height(600).url()
    : null;

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: 'transparent' }}>
      {/* Navigation */}
      <Link
        component={RouterLink}
        to="/posts"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          color: '#1976d2',
          textDecoration: 'none',
          mb: 4,
          fontWeight: 600,
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
        Back to Posts
      </Link>

      {/* Main Cover Image */}
      {postImageUrl && (
        <Box
          component="img"
          src={postImageUrl}
          alt={post.title}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 3,
            mb: 4,
            maxHeight: "500px",
            objectFit: "cover",
            display: 'block',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />
      )}

      {/* Title & Metadata - Explicit Colors */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          sx={{ mb: 2, fontWeight: 800, color: '#222222' }} // FORCED DARK
        >
          {post.title}
        </Typography>

        <Typography variant="subtitle1" sx={{ color: '#666666' }}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>

      {/* Main Content Body */}
      <Box
        sx={{
          mx: 'auto',
          "& p": {
            lineHeight: 1.8,
            fontSize: "1.15rem",
            color: '#333333', // FORCED DARK
            mb: 3,
          },
          "& h2, & h3": {
            mt: 5,
            mb: 2.5,
            fontWeight: 700,
            color: '#111111', // FORCED DARK
          },
          "& img": {
            mx: 'auto',
          }
        }}
      >
        {Array.isArray(post.body) && (
          <PortableText value={post.body} components={ptComponents} />
        )}
      </Box>
    </Container>
  );
}