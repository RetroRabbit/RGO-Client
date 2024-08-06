import { ClientState } from "./reducers/client.reducer";
import { TokenState } from "./reducers/sign-in.reducer";

export interface AppState {
  token: TokenState
  clients: ClientState
}
