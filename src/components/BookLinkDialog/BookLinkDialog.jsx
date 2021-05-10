import React, { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import useAxios from 'hooks/axios';
import { getSellLink } from 'api/books';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  linkField: {
    width: `100%`,
  },
}));

export default function BookLinkDialog({ backToParent, bookToLink }) {
  const [link, setLink] = useState('');
  const classes = useStyles();
  const linkFieldRef = useRef(null);
  const [generateLink, cancelGeneration, , , isGenerating] = useAxios(
    getSellLink,
    'generating the sell link',
    (linkData) => {
      setLink(linkData?.link || '');
      linkFieldRef.current.focus();
    }
  );
  const handleClose = () => backToParent(false)();
  useEffect(() => {
    generateLink(bookToLink.bookId);
    return () => cancelGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={true}>
      <DialogTitle align="center">
        <Typography variant="h5">
          {isGenerating
            ? `Generating your sell link for '${bookToLink.title}'...`
            : 'Sell link copied to the clipboard!'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12}>
            {isGenerating ? (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                color="secondary"
                size={30}
                thickness={4}
              />
            ) : (
              <CheckCircleIcon style={{ color: green[500], fontSize: 40 }} />
            )}
          </Grid>
          {!isGenerating && (
            <Grid item xs={12}>
              <Box m="auto">
                <TextField
                  className={classes.linkField}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  inputProps={{
                    style: { textAlign: 'center' },
                    ref: linkFieldRef,
                  }}
                  onFocus={(e) => {
                    // Select the whole text
                    e.target.select();
                    // Copy to clipboard
                    document.execCommand('copy');
                  }}
                  value={link}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid
          container
          direction="row-reverse"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Button onClick={handleClose} disabled={isGenerating}>
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
