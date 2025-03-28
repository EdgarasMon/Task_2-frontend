import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyDczKTtRPzFSHas9Phcm1RAeUQC3kzewGA";
const BASE_YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/commentThreads";

const App = () => {
  const [videoIds, setVideoIds] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedFromDatabase, setFetchedFromDatabase] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setComments([]);
    setFetchedFromDatabase(false);

    const videoIdArray = videoIds.split(",").map((id) => id.trim());

    let allComments = [];
    for (let videoId of videoIdArray) {
      try {
        const response = await axios.get(BASE_YOUTUBE_URL, {
          params: {
            part: "snippet",
            videoId: videoId,
            maxResults: 20,
            key: YOUTUBE_API_KEY,
          },
        });

        const videoComments = response.data.items.map((item) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          text: item.snippet.topLevelComment.snippet.textDisplay,
          videoId,
        }));

        allComments = [...allComments, ...videoComments];
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    setLoading(false);
    setComments(allComments);
  };

  const cutVideoId = (input) => {
    const trimmedInput = input.trim();

    // If it's already an 11-character ID, return it
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedInput)) {
      return trimmedInput;
    }

    // Extract from full YouTube URL
    const match = trimmedInput.match(
      /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : ""; // Return the extracted ID or empty string
  };

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      {/* <Typography variant='h4' align='center' gutterBottom>
        YouTube Comments Fetcher
      </Typography> */}

      <TextField
        label='Enter YouTube Video ID'
        variant='outlined'
        fullWidth
        value={videoIds}
        onChange={(e) => setVideoIds(cutVideoId(e.target.value))}
        sx={{ mb: 2 }}
      />

      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={fetchComments}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Fetch Comments"}
      </Button>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {comments.map((comment) => {
          const { id, author, videoId, text } = comment;
          return (
            <Grid item xs={12} sm={6} key={id}>
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    {author}
                  </Typography>
                  <Typography variant='body2'>{text}</Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Video ID: {videoId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default App;
