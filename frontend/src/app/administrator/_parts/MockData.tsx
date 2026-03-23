import { Company, RecentUser, ActivityItem } from "../Types";

export const companies: Company[] = [
  {
    id: 1,
    name: "Acme Corp",
    owner: "John Doe",
    status: "Идэвхтэй",
    users: 0,
  },
  {
    id: 2,
    name: "Global Tech",
    owner: "Sarah Smith",
    status: "Хүлээгдэж буй",
    users: 0,
  },
  {
    id: 3,
    name: "Innovate Ltd",
    owner: "Mike Ross",
    status: "Идэвхтэй",
    users: 0,
  },
  {
    id: 4,
    name: "Delta Solutions",
    owner: "Jane Foster",
    status: "Идэвхгүй",
    users: 0,
  },
];

export const recentUsers: RecentUser[] = [
  {
    id: 1,
    name: "Felix Graham",
    role: "Компани хоорондын хэрэглэчийн лавлах",
    time: "2м өмнө",
    avatar: "FG",
  },
  {
    id: 2,
    name: "Anita Bell",
    role: "Компани хоорондын хэрэглэчийн лавлах",
    time: "14м өмнө",
    avatar: "AB",
  },
  {
    id: 3,
    name: "Marcus Wright",
    role: "Компани хоорондын хэрэглэчийн лавлах",
    time: "1ц өмнө",
    avatar: "MW",
  },
];

export const activities: ActivityItem[] = [
  {
    id: 1,
    color: "blue",
    title: "Шинэ компани бүртгэлдээ",
    description: "Zenith Solutions платформд Enterprise зэрэглэлээр нэгдлээ.",
    time: "12:45 PM",
  },
  {
    id: 2,
    color: "yellow",
    title: "Төлбөрийн мэдэгдэл",
    description:
      "Delta Solutions руу төлбөр амжилтгүй болсон тухай мэдэгдэл илгээв.",
    time: "10:20 AM",
  },
  {
    id: 3,
    color: "green",
    title: "Хэрэглэчийн багц экспорт",
    description:
      "Acme Corp 150 хэрэглэчийн мэдэээллийг CSV файл руу экспортлов.",
    time: "өчигдөр",
  },
];
