import { PackInfo } from '@/types';

export const PACKS: PackInfo[] = [
  {
    id: 'couple',
    name: 'Người Yêu',
    subtitle: 'Chuyện đôi lứa & Kết nối sâu sắc',
    description: 'Dành cho các cặp đôi muốn hiểu nhau hơn qua những thói quen, kỷ niệm và dự định tương lai.',
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
    id: 'friends',
    name: 'Bạn Bè',
    subtitle: 'Hội bạn thân & Những câu chuyện khó đỡ',
    description: 'Khơi gợi những kỷ niệm cười ra nước mắt, góc nhìn chân thật và những bí mật vui vẻ giữa bạn bè.',
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
    id: 'family',
    name: 'Gia Đình',
    subtitle: 'Ký ức yêu thương & Thấu hiểu thế hệ',
    description: 'Những câu hỏi ấm áp giúp gắn kết bố mẹ, con cái, anh chị em và chia sẻ những điều chưa từng nói.',
    iconName: 'Home',
    color: {
      primary: 'emerald-500',
      bg: 'bg-emerald-500/10',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900/60 dark:hover:border-emerald-700',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    },
  },
  {
    id: 'work',
    name: 'Đồng Nghiệp',
    subtitle: 'Phá băng công sở & Góc nhìn chân thật',
    description: 'Phá bỏ khoảng cách bàn làm việc, tìm hiểu đồng nghiệp dưới góc nhìn con người thú vị ngoài công việc.',
    iconName: 'Briefcase',
    color: {
      primary: 'indigo-500',
      bg: 'bg-indigo-500/10',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      border: 'border-indigo-200 hover:border-indigo-400 dark:border-indigo-900/60 dark:hover:border-indigo-700',
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
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
