import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../sanity/client";
import {
  fetchAffiliateLinks,
  recordAffiliateClick,
  fetchCommentsForPost,
  submitComment,
  addLike,
  fetchLikesCount
} from "../api";

import {
  Box,
  Typography,
  CircularProgress,
  Link,
  useTheme,
  useMediaQuery,
  Container,
  Button,
  TextField,
  Paper,
  Avatar,
  Divider,
  Stack,
  Collapse,
  IconButton
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlBuilder = imageUrlBuilder({ projectId, dataset });
const urlFor = (source) => urlBuilder.image(source);

/* ---------------- HIGH-CONVERSION AFFILIATE CARD ---------------- */
function AffiliateInlineCard({ item }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!item) return null;

  const handleClick = () => {
    recordAffiliateClick(item.id);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "affiliate_inline_click",
      affiliate_id: item.id,
      affiliate_url: item.url,
      affiliate_label: item.label,
    });
  };

  return (
    <Box
      component="a"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      sx={{
        my: 5,
        p: 2.2,
        borderRadius: 2,
        bgcolor: "#fff",
        border: "1px solid #e6e6e6",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        maxWidth: 350,
        mx: "auto",
        display: "block",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        transition: "all .15s ease",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transform: "translateY(-1px)",
          borderColor: "#dcdcdc",
        },
        "&:active": {
          transform: "translateY(0px)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1976d2", letterSpacing: 0.4, mb: 1.3, display: "block" }}>
        RECOMMENDED GEAR
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
        {item.thumbnail_url && (
          <Box component="img" src={item.thumbnail_url} alt={item.label} sx={{ width: isMobile ? 140 : 150, height: "auto", maxHeight: isMobile ? 140 : 130, objectFit: "contain", display: "block" }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "#222" }}>
            {item.label}
          </Typography>
          <Button variant="contained" sx={{ mt: 1, bgcolor: "#f7ca00", color: "#111", fontWeight: 700, textTransform: "none", borderRadius: 1.5, px: 2.8, py: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.15)", pointerEvents: "none", "&:hover": { bgcolor: "#f2c200" } }}>
            View on Amazon
          </Button>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1.3, display: "block", fontSize: "0.72rem" }}>
        As an Amazon Associate, we earn from qualifying purchases.
      </Typography>
    </Box>
  );
}

/* ---------------- PORTABLE TEXT ---------------- */
import MarkdownBlockRenderer from "../components/MarkdownBlockRenderer";

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <Box component="img" src={urlFor(value).width(800).fit("max").auto("format").url()} alt={value.alt || "Post image"} sx={{ width: "100%", height: "auto", borderRadius: 2, my: 4, display: "block", boxShadow: 2 }} />
      );
    },
    markdownBlock: MarkdownBlockRenderer,
  },
  block: {
    blockquote: ({ children }) => (
      <Box component="blockquote" sx={{ borderLeft: "5px solid #1976d2", pl: 3, py: 1, my: 4, bgcolor: "rgba(25,118,210,0.05)", borderRadius: "0 8px 8px 0", fontStyle: "italic", color: "#333" }}>
        {children}
      </Box>
    ),
  },
};

/* ---------------- MAIN ---------------- */
export default function Post() {
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [post, setPost] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: "", body: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postData, affiliateData] = await Promise.all([
          client.fetch(POST_QUERY, { slug }),
          fetchAffiliateLinks(),
        ]);

        if (!postData) setError("Post not found.");
        else setPost(postData);

        if (affiliateData?.length) {
          const random = affiliateData[Math.floor(Math.random() * affiliateData.length)];
          setAffiliate(random);
        }
      } catch (err) {
        setError("Failed to fetch post. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!post?._id) return;
    const fetchInteractions = async () => {
      try {
        const [cmts, likes] = await Promise.all([
          fetchCommentsForPost(post._id),
          fetchLikesCount(post._id),
        ]);
        setComments(cmts);
        setLikesCount(likes);
      } catch (err) {
        console.error("Error fetching interactions", err);
      }
    };
    fetchInteractions();
  }, [post]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikesCount((prev) => prev + 1);
    try {
      await addLike({ sanityPostId: post._id });
    } catch (err) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
      console.error(err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentForm.name || !commentForm.body) return;
    setIsSubmitting(true);
    try {
      await submitComment({
        sanityPostId: post._id,
        authorName: commentForm.name,
        body: commentForm.body,
      });
      const newComment = {
        id: Date.now(),
        author_name: commentForm.name,
        body: commentForm.body,
        created_at: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setCommentForm({ name: "", body: "" });
    } catch (err) {
      console.error("Comment failed", err);
      alert("Failed to submit comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Typography sx={{ mb: 3, p: 2, bgcolor: "#ffebee", borderRadius: 1, color: "#b71c1c" }}>
          {error || "Post not found."}
        </Typography>
        <Link component={RouterLink} to="/posts" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
          <ArrowBackIcon /> Back to Posts
        </Link>
      </Container>
    );
  }

  const postImageUrl = post.image ? urlFor(post.image).width(1200).height(600).url() : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link component={RouterLink} to="/posts" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "#1976d2", textDecoration: "none", mb: 4, fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
        <ArrowBackIcon sx={{ fontSize: "1.1rem" }} /> Back to Posts
      </Link>

      {postImageUrl && (
        <Box component="img" src={postImageUrl} alt={post.title} sx={{ width: "100%", height: "auto", borderRadius: 3, mb: 4, maxHeight: "500px", objectFit: "cover", display: "block", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
      )}

      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant={isMobile ? "h4" : "h3"} component="h1" sx={{ mb: 1, fontWeight: 800, color: "#222" }}>
          {post.title}
        </Typography>

        {/* METADATA & DISCLAIMER SECTION */}
        <Stack spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ color: "#666" }}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Typography>

          {/* FTC Disclosure: Styled subtly but clearly visible before the content */}
          <Typography
            variant="caption"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
              maxWidth: '600px',
              lineHeight: 1.4,
              px: 2
            }}
          >
            Disclaimer: This article contains affiliate links where I may receive a small commission at no cost to you.
          </Typography>
        </Stack>

        <Button
          variant={hasLiked ? "contained" : "outlined"}
          onClick={handleLike}
          disabled={hasLiked}
          sx={{
            borderRadius: 8,
            px: 3,
            textTransform: 'none',
            fontSize: '1rem',
            borderColor: hasLiked ? 'transparent' : '#ddd',
            color: hasLiked ? '#fff' : '#555',
            "&.Mui-disabled": {
              bgcolor: "#1976d2",
              color: "#fff",
              opacity: 0.8
            }
          }}
        >
          {hasLiked ? "Liked" : "👍 Like"} • {likesCount}
        </Button>
      </Box>

      <Box sx={{ mx: "auto", "& p, & p strong, & li, & li strong": { lineHeight: 1.8, fontSize: "1.15rem", color: "#333", mb: 3 }, "& h2, & h3": { mt: 5, mb: 2.5, fontWeight: 700, color: "#111" }, "& img": { mx: "auto" } }}>
        {Array.isArray(post.body) && post.body.map((block, i) => (
          <React.Fragment key={block._key || i}>
            <PortableText value={[block]} components={ptComponents} />
            {/* Affiliate Card injected after the second block of content */}
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ my: 8, borderColor: '#eee' }} />

      {/* --- COMMENTS SECTION --- */}
      <Box component="section" sx={{ pb: 8 }}>
        <Box
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            borderBottom: '2px solid #f0f0f0',
            pb: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#222', mr: 1 }}>
              Discussion
            </Typography>
            <Box sx={{ bgcolor: '#eee', color: '#555', px: 1.5, py: 0.5, borderRadius: 4, fontSize: '0.85rem', fontWeight: 700 }}>
              {comments.length}
            </Box>
          </Box>

          <IconButton size="small">
            {isCommentsExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        <Collapse in={isCommentsExpanded} timeout="auto" unmountOnExit>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              mb: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#444' }}>
              Leave a comment
            </Typography>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              sx={{ mb: 2, bgcolor: 'white' }}
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What are your thoughts?"
              variant="outlined"
              sx={{ mb: 2, bgcolor: 'white' }}
              value={commentForm.body}
              onChange={(e) => setCommentForm({ ...commentForm, body: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !commentForm.name || !commentForm.body}
                endIcon={<SendIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 2
                }}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </Box>
          </Paper>

          <Stack spacing={3}>
            {comments.map((comment, index) => (
              <Paper
                key={comment.id || index}
                elevation={0}
                sx={{
                  display: 'flex',
                  gap: 2.5,
                  p: 3,
                  bgcolor: '#f8f9fa',
                  borderRadius: 3,
                  border: '1px solid #f0f0f0'
                }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    color: '#fff',
                    width: 48,
                    height: 48,
                    fontWeight: 'bold'
                  }}
                >
                  {comment.author_name ? comment.author_name[0].toUpperCase() : "?"}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111' }}>
                      {comment.author_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>
                      • {comment.created_at ? new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
                    {comment.body}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          {comments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6, opacity: 0.6 }}>
              <Typography variant="h6" sx={{ color: '#ccc', fontWeight: 600 }}>
                No comments yet
              </Typography>
            </Box>
          )}
        </Collapse>
      </Box>
    </Container>
  );
}