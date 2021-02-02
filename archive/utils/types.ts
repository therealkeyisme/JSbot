interface EventType {
  guildid: string;
  title: string;
  date: any;
  description: string;
  messageid: string;
  accepted: [
    {
      userid?: string;
      nickname?: string;
      notified?: boolean;
    },
  ];
  declined: [
    {
      userid?: string;
      nickname?: string;
    },
  ];
  tentative: [
    {
      userid?: string;
      nickname?: string;
    },
  ];
}

interface ReminderType {
  guildid: string;
  channelid: string;
  title: string;
  date: any;
  user: string;
  notified: boolean;
}

export { EventType, ReminderType };
