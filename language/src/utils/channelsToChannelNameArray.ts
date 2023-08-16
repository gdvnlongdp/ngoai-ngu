import { Channel } from '../@types/channel';

export default function channelsToChannelNameArray(channels: Channel[]) {
  return [
    'all',
    ...channels.map(channel => channel.name)]
    ;
}