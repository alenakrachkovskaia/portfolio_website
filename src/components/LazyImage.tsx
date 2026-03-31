import { useState } from 'react'

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export default function LazyImage({ style, onLoad, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      loading="lazy"
      {...props}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
      onLoad={e => {
        setLoaded(true)
        onLoad?.(e)
      }}
    />
  )
}
