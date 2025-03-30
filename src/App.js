import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InfoBanner from "./components/InfoBanner";
import CommentCard from "./components/CommentCard";
import Input from "./components/Input";

const App = () => {
  const [comments, setComments] = useState([]);
  const [fetchedFromDatabase, setFetchedFromDatabase] = useState(false);

  const setCommentsCB = (comments) => {
    setComments(comments);
  };

  const setFetchedFromDatabaseCB = (fetchedFromDatabase) => {
    setFetchedFromDatabase(fetchedFromDatabase);
  };

  return (
    <Container maxWidth='md' sx={{ mt: 4, alignItems: "center" }}>
      <Typography variant='h4' align='center' gutterBottom>
        YouTube Comments Fetcher
      </Typography>
      {fetchedFromDatabase && <InfoBanner />}
      <Input
        setCommentsCB={setCommentsCB}
        setFetchedFromDatabaseCB={setFetchedFromDatabaseCB}
      />

      <CommentCard comments={comments} />
    </Container>
  );
};

export default App;
