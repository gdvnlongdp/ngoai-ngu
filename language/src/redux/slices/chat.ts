import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import { HOST_API } from '../../config';
// utils
import axios from '../../utils/axios';
// @types
import { Conversation, SendMessage } from '../../@types/chat';
import { Channel } from '../../@types/channel';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array: any[], key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

export const socket = io(HOST_API, { reconnectionDelayMax: 10000 });

type ChatState = {
  isLoading: boolean;
  error: Error | string | null;
  channels: Channel[];
  conversations: {
    byId: Record<string, Conversation>;
    allIds: string[];
  };
  activeConversationId: null | string;
};

const initialState: ChatState = {
  isLoading: false,
  error: null,
  channels: [],
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CHANNELS SUCCESS
    getChannelsSuccess(state, action) {
      state.channels = action.payload;
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = objFromArray(conversations);
      state.conversations.allIds = Object.keys(state.conversations.byId);

      // HANDLE JOIN ROOsM
      state.conversations.allIds.map((conversationKey) =>
        socket.emit('register_room', { conversationKey })
      );
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const { conversationKey, newMessage } = action.payload;

      // SEND MESSAGE
      socket.emit('send_message', {
        conversationKey,
        message: newMessage,
      });
    },

    onGetMessage(state, action) {
      const { conversationKey, newMessage } = action.payload;

      state.conversations.byId[conversationKey].messages.push(newMessage);

      const index = state.conversations.allIds.indexOf(conversationKey);
      if (index > -1) {
        state.conversations.allIds.splice(index, 1);
        state.conversations.allIds.unshift(conversationKey);
      }
    },

    onGetModifyMessage(state, action) {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.byId[conversationId];

      const indexMessage = conversation.messages.findIndex((item) => item.id === message.id);
      if (indexMessage > -1) {
        state.conversations.byId[conversationId].messages[indexMessage] = message;
      }
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationKey } = action.payload;
      const conversation = state.conversations.byId[conversationKey];
      if (conversation) {
        conversation.unread = [];
      }
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { onSendMessage, resetActiveConversation } = slice.actions;

// ----------------------------------------------------------------------

export function getChannels() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/general/chat/channels');
      dispatch(slice.actions.getChannelsSuccess(response.data.channels));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations(channelKey: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/general/chat/conversations`, {
        params: { channelKey },
      });

      dispatch(slice.actions.getConversationsSuccess(response.data.conversations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(channelKey: string, conversationKey: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/general/chat/conversations/${conversationKey}`, {
        params: { channelKey },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createConversations(channelKey: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/general/chat/conversations', null, {
        params: { channelKey },
      });
      dispatch(getConversations(channelKey));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationKey: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/general/chat/conversation/mark-as-seen', {
        params: { conversationKey },
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationKey }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function sendMessage(conversationKey: string, message: SendMessage) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        '/api/general/chat/conversation/send-message',
        { message },
        { params: { conversationKey } }
      );
      dispatch(
        slice.actions.onSendMessage({
          conversationKey,
          newMessage: response.data.newMessage,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function unSend(conversationId: string, messageId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/general/chat/messages/unsend/${messageId}`);
      socket.emit('modify_message', { conversationId, message: response.data.message });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function removeForYou(conversationId: string, messageId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/general/chat/messages/remove-for-you/${messageId}`);
      socket.emit('modify_message', { conversationId, message: response.data.message });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function removeForEveryone(conversationId: string, messageId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(
        `/api/general/chat/messages/remove-for-everyone/${messageId}`
      );
      socket.emit('modify_message', { conversationId, message: response.data.message });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

socket.on('get_message', ({ conversationKey, message }) => {
  dispatch(
    slice.actions.onGetMessage({
      conversationKey,
      newMessage: message,
    })
  );
});

socket.on('listen_modify_message', ({ conversationId, message }) => {
  dispatch(
    slice.actions.onGetModifyMessage({
      conversationId,
      message,
    })
  );
});
