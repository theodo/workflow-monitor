import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  card: {
    width: 275,
    margin: 8,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
});

function SimpleCard(props) {
  const { classes } = props;
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          #{props.card.idShort}
        </Typography>
        <Typography component="p">
          {bull} {props.card.name}
        </Typography>
      </CardContent>
      <CardActions>
        {props.isCurrentTicket ? (
          <Button onClick={() => props.handleCardContinueClick(props.card)}>Continue</Button>
        ) : (
          <Button onClick={() => props.handleCardStartClick(props.card)}>Start</Button>
        )}
      </CardActions>
    </Card>
  );
}

Card.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SimpleCard);
