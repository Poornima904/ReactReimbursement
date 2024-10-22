import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  titleContainer: {
    width: "100%", // Make sure it spans the entire width of the screen
    overflow: "hidden",
  },
  title: {
    whiteSpace: "nowrap",
    position: "relative",
    animation: `$moveText 10s linear infinite`, // Infinite left-to-right animation
  },
  "@keyframes moveText": {
    "0%": {
      transform: "translateX(-100%)", // Start fully outside from the left
    },
    "100%": {
      transform: "translateX(100%)", // Move fully outside to the right
    },
  },
}));

export default function AppMainBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.titleContainer}>
          <Typography variant="h4" className={classes.title}>
            {"Ready to Reimburse?"}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}
