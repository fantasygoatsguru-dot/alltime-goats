import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { client } from "../sanity/client";
import {
  Box,
  Typography,
  CircularProgress,
  Link,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardMedia,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  Chip
} from "@mui/material";

// GROQ Query - Fixed to match your specific schema field 'image'
const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, 
  title, 
  slug, 
  publishedAt, 
  "imageUrl": image.asset->url,
  "category": coalesce(category, "analytics")
}`;

// Mapping the 'value' from Sanity to the 'Display Name' for your UI
const categoryMap = {
  analytics: 'Stat Scouting 📊',
  storytelling: 'League Drama 📘',
  folklore: 'Fantasy Folklore 📜',
  audience: 'Our Audience Shares 🔮'
};

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(POSTS_QUERY);
        setPosts(data || []);
      } catch (err) {
        setError("Failed to fetch posts. Please check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Centered Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          sx={{ fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: -1 }}
        >
          Fantasy Goats Blog
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
          Deep dives, folklore, and real stories from the fantasy world.
        </Typography>
      </Box>

      {/* Category Filter Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          sx={{ 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
              border: '1px solid #ddd !important',
              borderRadius: '30px !important',
              mx: 0.5,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': { bgcolor: '#1565c0' }
              }
            }
          }}
        >
          <ToggleButton value="All">All</ToggleButton>
          {Object.entries(categoryMap).map(([value, label]) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Typography color="error" textAlign="center" sx={{ mb: 4 }}>{error}</Typography>
      )}

      {/* Grid of Posts */}
      <Grid container spacing={4}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card 
              component={RouterLink}
              to={`/post/${post.slug.current}`}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid #eee',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  '& .MuiTypography-h6': { color: '#1976d2' }
                }
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image={post.imageUrl || 'https://via.placeholder.com/600x400?text=Fantasy+Goats+Guru'}
                alt={post.title}
                sx={{ bgcolor: '#f0f0f0' }}
              />
              <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Chip 
                  label={categoryMap[post.category] || 'General'} 
                  size="small"
                  sx={{ 
                    mb: 2, 
                    fontWeight: 700, 
                    bgcolor: 'rgba(25, 118, 210, 0.08)', 
                    color: '#1976d2',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem'
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800, 
                    lineHeight: 1.3, 
                    color: '#222',
                    transition: 'color 0.2s'
                  }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}