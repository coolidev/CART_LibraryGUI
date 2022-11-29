import { createSlice } from '@reduxjs/toolkit';
import { SERVER_STATUS_URL } from 'src/utils/constants/paths';

interface WebSocketState {
    socket: WebSocket;
};

const initialState: WebSocketState = {
    socket: new WebSocket(SERVER_STATUS_URL)
};

const slice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {}
});

export const reducer = slice.reducer;

export default slice;