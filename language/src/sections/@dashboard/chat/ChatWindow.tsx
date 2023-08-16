import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Box, Divider, Stack } from '@mui/material';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import {
  getConversation,
  markConversationAsRead,
  resetActiveConversation,
  sendMessage,
} from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Conversation, SendMessage } from '../../../@types/chat';
// hooks
import useAuth from '../../../hooks/useAuth';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

const conversationSelector = (state: RootState): Conversation => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId ? conversations.byId[activeConversationId] : null;
  if (conversation) {
    return conversation;
  }
  const initState: Conversation = {
    id: '',
    messages: [],
    participants: [],
    unread: [],
    type: '',
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { channelKey = '', conversationKey = '' } = useParams();
  const { activeConversationId } = useSelector((state) => state.chat);

  const conversation = useSelector((state) => conversationSelector(state));

  const displayParticipants = conversation.participants.filter((item) => item.id !== user?.id);

  useEffect(() => {
    const getDetails = async () => {
      try {
        await dispatch(getConversation(channelKey, conversationKey));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  useEffect(() => {
    if (conversationKey && activeConversationId) {
      dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, conversationKey, activeConversationId]);

  const handleSendMessage = async (value: SendMessage) => {
    try {
      if (activeConversationId) {
        dispatch(sendMessage(activeConversationId, value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      <ChatHeaderDetail participants={displayParticipants} />

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={!activeConversationId}
          />
        </Stack>

        <ChatRoom conversation={conversation} participants={displayParticipants} />
      </Box>
    </Stack>
  );
}
