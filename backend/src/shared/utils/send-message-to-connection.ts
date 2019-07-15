import { ApiGatewayManagementApi, config } from 'aws-sdk';

if (process.env.IS_OFFLINE) {
  config.update({
    region: 'eu-west-3',
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
  });
}

export const sendToConnection = async (
  ConnectionId: string,
  endpoint: string,
  payload: string,
): Promise<void> => {
  const managementApi = new ApiGatewayManagementApi({
    endpoint,
    apiVersion: '2018-11-29',
  });
  try {
    await managementApi.postToConnection({ ConnectionId, Data: payload }).promise();
  } catch (e) {
    if (e.statusCode !== 410) {
      // tslint:disable-next-line:no-console
      console.log('error', e);
      throw e;
    }
  }
  return;
};
