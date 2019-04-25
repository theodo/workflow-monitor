import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto'
};

const marginStyle = {
  margin: 10,
};

const ProjectHistoryPage = ({ tickets: { rows, count }, loadMore, goToTicket }) => (
  <Grid container spacing={0} style={fullPageHeightStyle}>
    <Grid item xs={1} >
    </Grid>
    <Grid item xs={10}>
      <h3>Ticket history</h3>
      { rows.map(ticket => (

        <Card key={ticket.id} style={marginStyle}>
          <CardActionArea onClick={() => goToTicket(ticket.id)}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                #{ticket.thirdPartyId}
              </Typography>
              <Typography component="p">
                {ticket.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      { count > rows.length && <button onClick={loadMore}>Load more</button> }
      { count === 0 && 'No ticket done on this project yet' }
    </Grid>
    <Grid item xs={1} >
    </Grid>
  </Grid>
);

export default ProjectHistoryPage;
