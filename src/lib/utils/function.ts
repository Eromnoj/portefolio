import { ImageLoaderProps } from "next/image"


export const myLoader = ({ src, width, quality }:ImageLoaderProps) => {
  return `/uploads/${src}?w=${width}&q=${quality || 75}`
}

export const myAssets = ({ src, width, quality }:ImageLoaderProps) => {
  return `/assets/${src}?w=${width}&q=${quality || 75}`
}
