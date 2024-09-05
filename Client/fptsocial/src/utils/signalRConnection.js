
import * as signalR from '@microsoft/signalr'
import { API_ROOT, JWT_TOKEN } from './constants'
const jwtToken = JWT_TOKEN

const connectionSignalR = new signalR.HubConnectionBuilder()
  .withUrl(`${API_ROOT}/notificationsHub`, {
    accessTokenFactory: () => jwtToken,
    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
  })
  .withAutomaticReconnect()
  .build()

export default connectionSignalR