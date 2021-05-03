import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import SellBooksList from 'components/SellBooksList';
import {
  EDIT_SELL_ROUTE,
  NEW_SELL_ROUTE,
  renderRoute,
  toRoute,
} from 'routing/helpers';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import useAxios from 'hooks/axios';
import { getSellingBooks, getSoldBooks } from 'api/books';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function Sell({ routes }) {
  const [bookToEdit, setBookToEdit] = useState(undefined);

  const [
    fetchSellingBooks,
    cancelSelling,
    sellingBooks = [],
    errorSelling,
    isLoadingSelling,
  ] = useAxios(getSellingBooks, 'fetching selling books');

  const [
    fetchSoldBooks,
    cancelSold,
    soldBooks = [],
    errorSold,
    isLoadingSold,
  ] = useAxios(getSoldBooks, 'fetching sold books');

  const history = useHistory();

  const classes = useStyles();

  const newSellRoute = routes[0];
  const editSellRoute = routes[1];

  // We pass an empty dependency array so that we perform the fetch only once,
  // otherwise we will have infinite re-renders.
  useEffect(() => {
    fetchSellingBooks();
    return () => {
      console.log('cleaning up selling');
      cancelSelling();
    };
  }, []);
  useEffect(() => {
    fetchSoldBooks();
    return () => {
      console.log('cleaning up sold');
      cancelSold();
    };
  }, []);

  return (
    <>
      {newSellRoute && renderRoute(newSellRoute)}
      {editSellRoute &&
        bookToEdit &&
        renderRoute(editSellRoute, null, { book: bookToEdit })}
      <Grid container>
        <Grid item xs={12}>
          <SellBooksList
            loadingSelling={isLoadingSelling}
            loadingSold={isLoadingSold}
            sellingBooks={sellingBooks}
            soldBooks={soldBooks}
            onEdit={(book) => {
              setBookToEdit(book);
              history.push(toRoute(EDIT_SELL_ROUTE));
            }}
          />
        </Grid>
      </Grid>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="sell-book"
        onClick={() => history.push(toRoute(NEW_SELL_ROUTE))}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
