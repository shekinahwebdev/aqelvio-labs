/*
 * The header row (brand + Menu button), shared by the page header and the
 * open menu's top row so they line up exactly. Under 360px the two need
 * ~358px at full size, so the narrowest phones get slightly tighter
 * padding, gaps and logo, and a less padded (still 56px-tall) Menu button.
 */
export const headerRow = {
  row: "grid grid-cols-[1fr_auto_1fr] items-center gap-3 max-[359px]:gap-2 max-[359px]:px-4",
  logo: "max-[359px]:gap-2.5 max-[359px]:[&>span]:text-[1.125rem] max-[359px]:[&>svg]:size-9",
  trigger: "max-[359px]:min-w-0 max-[359px]:gap-2.5 max-[359px]:px-4",
} as const;
