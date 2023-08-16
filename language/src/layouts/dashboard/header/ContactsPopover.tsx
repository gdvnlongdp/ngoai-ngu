import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Avatar, ListItemText, ListItemAvatar, MenuItem, Tabs, Tab } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
// @types
import { Channel } from '../../../@types/channel';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<Channel[]>([]);
  const [currentTab, setCurrentTab] = useState(0);

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    const handleGetContacts = async () => {
      const response = await axios.get('/api/general/contacts');
      setContacts(response.data.contacts);
    };

    handleGetContacts();

    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSelectContact = (id: string) => {
    navigate(PATH_DASHBOARD.chat.view(contacts[currentTab].id, id));
    handleClose();
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Iconify icon={'eva:people-fill'} width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          pb: 0,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons={false}
          value={currentTab}
          sx={{ px: 1 }}
          onChange={(event: React.SyntheticEvent, newValue: number) => setCurrentTab(newValue)}
        >
          {contacts.map((item) => (
            <Tab
              disableRipple
              key={item.id}
              label={item.name}
              sx={{ textTransform: 'uppercase' }}
            />
          ))}
        </Tabs>

        <Scrollbar
          sx={{
            height: ITEM_HEIGHT * Math.min(6, contacts[currentTab]?.members.length - 1),
            my: 1,
          }}
        >
          {contacts.length > 0 &&
            contacts[currentTab].members.map(
              (member) =>
                member.profile.id !== user?.profile.id && (
                  <MenuItem key={member.profile.id} onClick={() => handleSelectContact(member.id)}>
                    <ListItemAvatar sx={{ position: 'relative' }}>
                      <Avatar src={member.profile.avatar} />
                    </ListItemAvatar>

                    <ListItemText
                      primaryTypographyProps={{ typography: 'subtitle2', mb: 0.25 }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={member.profile.name}
                      secondary={member.role.name}
                    />
                  </MenuItem>
                )
            )}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
