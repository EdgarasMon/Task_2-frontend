import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const CommentCard = (props) => {
  const { comments } = props;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
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
  );
};

export default CommentCard;
