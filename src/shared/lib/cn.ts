import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// clsx joins conditional classes, twMerge resolves conflicts so the last class wins (`px-6` + `px-4` → `px-4`)
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
