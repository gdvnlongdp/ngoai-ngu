import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { List, SxProps } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Conversation } from '../../../@types/chat';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
//
import ChatConversationItem from './ChatConversationItem';

// ----------------------------------------------------------------------

type Props = {
  conversations: {
    byId: Record<string, Conversation>;
    allIds: string[];
  };
  isOpenSidebar: boolean;
  activeConversationId: string | null;
  sx?: SxProps;
};

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  sx,
  ...other
}: Props) {
  const navigate = useNavigate();

  const { channelKey = '' } = useParams();

  const handleSelectConversation = (conversationId: string) => {
    navigate(PATH_DASHBOARD.chat.view(channelKey, conversationId));
  };

  const loading = !conversations.allIds.length;

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : conversations.allIds).map((conversationId, index) =>
        conversationId ? (
          <ChatConversationItem
            key={conversationId}
            isOpenSidebar={isOpenSidebar}
            conversation={conversations.byId[conversationId]}
            isSelected={activeConversationId === conversationId}
            onSelectConversation={() => handleSelectConversation(conversationId)}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
