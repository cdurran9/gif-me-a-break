import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: 'LOGIN',
  gamePhase: '',
  timer: 0,
  timerDone: true,
  playerId: '',
  isConnected: false,
  isObserver: false,
  isVip: false,
  lobbyPlayers: [],
  tags: [],
  texts: [],
  showcaseData: []
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTimer: (state, { payload }) => {
      state.timer = payload;
      state.timerDone = false;
    },
    decrementTimer: (state, { payload }) => {
      let newTimerValue = state.timer - payload;
      if (newTimerValue <= 0) {
        state.timerDone = true;
        newTimerValue = 0;
      }
      state.timer = newTimerValue;
    },
    setPlayerId: (state, { payload }) => {
      state.playerId = payload;
    },
    setGameState: (state, { payload }) => {
      state.state = payload;
    },
    setGamePhase: (state, { payload }) => {
      state.gamePhase = payload;
    },
    setIsConnected: (state, { payload }) => {
      state.isConnected = payload;
    },
    setIsObserver: (state, { payload }) => {
      state.isObserver = payload;
    },
    setIsVip: (state, { payload }) => {
      state.isVip = payload;
    },
    setLobbyPlayers: (state, { payload }) => {
      state.lobbyPlayers = payload;
    },
    setTags: (state, { payload }) => {
      state.tags = payload;
    },
    setTexts: (state, { payload }) => {
      state.texts = payload;
    },
    setShowcaseData: (state, { payload }) => {
      state.showcaseData = payload;
    }
  }
});

export const actions = gameSlice.actions;
export default gameSlice.reducer;