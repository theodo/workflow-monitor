import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import ProjectSpeed from './ProjectSpeed';
import { Query, Mutation } from 'react-apollo';

import { GET_CURRENT_PROJECT } from 'Apollo/Queries/Projects';
import { SET_CURRENT_PROJECT } from 'Apollo/Queries/Projects';

const styles = () => ({
  mt10: {
    marginTop: '10px',
  },
  mb10: {
    marginBottom: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr40: {
    marginRight: 40,
  },
  w40: {
    width: '40px',
  },
});

const Projects = props => {
  const [boards, setBoards] = useState(null);

  const fetchBoards = async () => {
    const trelloBoards = await window.Trello.get('/member/me/boards', { filter: 'open' });
    return setBoards(
      trelloBoards.reduce((acc, board) => {
        acc[board.id] = board;
        return acc;
      }, {}),
    );
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="Project">
      <h2>Select your project :</h2>
      <Query query={GET_CURRENT_PROJECT} fetchPolicy="cache-and-network">
        {({ data, loading }) => {
          const currentProject = {
            label: data.currentProject ? data.currentProject.name : null,
            value: data.currentProject ? data.currentProject.thirdPartyId : null,
          };

          if (loading || !boards) return 'loading';
          return (
            <div>
              <Mutation
                mutation={SET_CURRENT_PROJECT}
                onCompleted={({ selectProject }) => {
                  props.selectProject();
                  props.enqueueSnackbar('Project changed to ' + selectProject.name, {
                    variant: 'success',
                  });
                }}
                refetchQueries={[{ query: GET_CURRENT_PROJECT }]}
              >
                {setCurrentProject => {
                  return (
                    <Select
                      className={props.classes.mb10}
                      value={currentProject}
                      onChange={selectedProject =>
                        setCurrentProject({
                          variables: {
                            project: {
                              name: selectedProject.label,
                              thirdPartyId: selectedProject.value,
                            },
                          },
                        })
                      }
                      options={Object.keys(boards)
                        .map(boardId => boards[boardId])
                        .map(board => ({ value: board.id, label: board.name }))}
                      placeholder="Select project"
                    />
                  );
                }}
              </Mutation>
              {data.currentProject && (
                <ProjectSpeed
                  celerity={data.currentProject.celerity}
                  dailyDevelopmentTime={data.currentProject.dailyDevelopmentTime}
                />
              )}
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default withStyles(styles)(withSnackbar(Projects));
