import { PackInfo } from '@/types';

export const PACKS: PackInfo[] = [
  {
    id: 'couple',
    name: 'Người Yêu',
    subtitle: 'Chuyện đôi lứa & Thấu hiểu sâu sắc',
    description: 'Dành cho các cặp đôi muốn gắn kết qua những thói quen, kỷ niệm, tam quan và dự định tương lai.',
    iconName: 'HeartHandshake',
    color: {
      primary: 'rose-500',
      bg: 'bg-rose-500/10',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      border: 'border-rose-200 hover:border-rose-400 dark:border-rose-900/60 dark:hover:border-rose-700',
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    },
  },
  {
    id: 'couple_spicy',
    name: 'Người Yêu 18+',
    subtitle: 'Đỏ mặt, quyến rũ & Táo bạo',
    description: 'Chuyện phòng the, ham muốn thầm kín, điểm nhạy cảm và những khao khát thân mật nói ra là ngại.',
    iconName: 'Flame',
    color: {
      primary: 'red-500',
      bg: 'bg-red-500/10',
      badge: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
      border: 'border-red-200 hover:border-red-400 dark:border-red-900/60 dark:hover:border-red-700',
      gradient: 'from-red-600/20 via-orange-500/10 to-transparent',
    },
  },
  {
    id: 'friends',
    name: 'Bạn Bè',
    subtitle: 'Hội bạn thân & Kỷ niệm bất ổn',
    description: 'Khơi gợi những trận cười nghiêng ngả, bóc phốt hài hước và thử thách độ ăn ý giữa bạn bè.',
    iconName: 'Users',
    color: {
      primary: 'amber-500',
      bg: 'bg-amber-500/10',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      border: 'border-amber-200 hover:border-amber-400 dark:border-amber-900/60 dark:hover:border-amber-700',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    },
  },
  {
    id: 'friends_spicy',
    name: 'Bạn Bè 18+',
    subtitle: 'Bóc phốt tình trường & Góc khuất',
    description: 'Dành riêng cho hội bạn nhậu, drinking game. Những bí mật tế nhị, tình một đêm, red flags và confessions bốc lửa.',
    iconName: 'Wine',
    color: {
      primary: 'purple-500',
      bg: 'bg-purple-500/10',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      border: 'border-purple-200 hover:border-purple-400 dark:border-purple-900/60 dark:hover:border-purple-700',
      gradient: 'from-purple-600/20 via-fuchsia-500/10 to-transparent',
    },
  },
];

export const LEVEL_INFO = {
  1: {
    name: 'Khởi Động',
    shortDesc: 'Nhẹ nhàng & Vui vẻ',
    color: 'text-emerald-500 dark:text-emerald-400',
    bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  2: {
    name: 'Gắn Kết',
    shortDesc: 'Chia sẻ & Thấu hiểu',
    color: 'text-amber-500 dark:text-amber-400',
    bgBadge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  3: {
    name: 'Thâm Sâu',
    shortDesc: 'Cảm xúc & Chiêm nghiệm',
    color: 'text-rose-500 dark:text-rose-400',
    bgBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
};
