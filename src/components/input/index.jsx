import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyDczKTtRPzFSHas9Phcm1RAeUQC3kzewGA";
const BASE_YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/commentThreads";
const PORT = 3001;
const SERVER_URL = `http://localhost:${PORT}`;

const Input = (props) => {
  const { setCommentsCB, setFetchedFromDatabaseCB } = props;
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);

  const checkYoutubeID = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/comments/checkCommentsQuery`,
        {
          params: { videoId },
        }
      );

      const gotRecentData = response.data.recent;

      if (gotRecentData) {
        setCommentsCB(response.data.data.comments);
        setFetchedFromDatabaseCB(true);
      } else {
        fetchCommentsFromYoutube();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("Video not found, fetching from YouTube...");
        fetchCommentsFromYoutube();
      } else {
        console.error("Error finding video data:", error);
        alert("Error finding video data!");
      }
    }
  };

  const fetchCommentsFromYoutube = async () => {
    if (!videoId.trim()) {
      alert("Please enter a valid YouTube video ID.");
      return;
    }

    setLoading(true);
    setCommentsCB([]);
    setFetchedFromDatabaseCB(false);

    try {
      const response = await axios.get(BASE_YOUTUBE_URL, {
        params: {
          part: "snippet",
          videoId: videoId.trim(),
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

      setLoading(false);
      setCommentsCB(videoComments);

      postCommentsToDB(videoId, videoComments);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching comments:", error);
      alert("Error fetching comments!");
    }
  };

  const postCommentsToDB = async (videoId, newComments) => {
    if (!newComments.length) {
      console.warn("No comments to post.");
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/comments/postComments`, {
        videoId,
        comments: newComments,
      });

      alert("Comments posted to database!");
    } catch (error) {
      console.error("Error posting video data:", error);
      alert("Error posting video data!");
    }
  };

  const cutVideoIdFromURL = (input) => {
    const trimmedInput = input.trim();

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedInput)) {
      return trimmedInput;
    }

    const match = trimmedInput.match(
      /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : "";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        label='Paste YouTube Video ID or URL'
        variant='outlined'
        fullWidth
        value={videoId}
        onChange={(e) => setVideoId(cutVideoIdFromURL(e.target.value))}
        sx={{ m: 1 }}
      />

      <Button
        variant='contained'
        color='primary'
        onClick={checkYoutubeID}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Fetch Comments"}
      </Button>
    </Box>
  );
};

export default Input;
