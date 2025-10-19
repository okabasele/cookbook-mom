import { CONVERSIONS } from "@/utils";

export interface ConvertedItem {
  converted: string;
  original?: string;
}

export type ConversionCategory = keyof typeof CONVERSIONS;
export type ConversionData = typeof CONVERSIONS[ConversionCategory];