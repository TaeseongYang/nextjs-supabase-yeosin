import {
  Sparkles,
  Eye,
  Triangle,
  ScanFace,
  Heart,
  Dumbbell,
  Syringe,
  TrendingUp,
  Wind,
  Scissors,
  Smile,
  Leaf,
  type LucideIcon,
} from "lucide-react";

/**
 * Category.iconKey(kebab-case 문자열)를 lucide-react 아이콘 컴포넌트로 매핑한다.
 * 매핑에 없는 iconKey는 DEFAULT_CATEGORY_ICON으로 폴백한다.
 */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  eye: Eye,
  triangle: Triangle,
  "scan-face": ScanFace,
  heart: Heart,
  dumbbell: Dumbbell,
  syringe: Syringe,
  "trending-up": TrendingUp,
  wind: Wind,
  scissors: Scissors,
  smile: Smile,
  leaf: Leaf,
};

export const DEFAULT_CATEGORY_ICON: LucideIcon = Sparkles;
