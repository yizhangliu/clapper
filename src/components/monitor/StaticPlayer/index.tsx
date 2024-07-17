"use client"

import React, { ReactNode, useEffect, useRef } from "react"

import { useTimeline } from "@aitube/timeline"
import { useRequestAnimationFrame } from "@/lib/hooks/useRequestAnimationFrame"
import { useMonitor } from "@/services/monitor/useMonitor"

export function StaticPlayer({
  video = "",
  isBusy = false,
  progress = 0,
  status = "",
  error = "",
  children = undefined,
}: {
  video: string
  isBusy: boolean
  progress: number
  status: string
  error: ReactNode
  children?: ReactNode
} = {
  video: "",
  isBusy: false,
  progress: 0,
  status: "",
  error: "",
  children: undefined,
}) {

  const setStaticVideoRef = useMonitor(s => s.setStaticVideoRef)

  const setCursorTimestampAtInMs = useTimeline(s => s.setCursorTimestampAtInMs)

  const ref = useRef<HTMLVideoElement>(null)
  
  useRequestAnimationFrame(() => {
    if (!ref.current || ref.current.paused) { return }
    // important: we only update this if we have an actual PLAYING video
    setCursorTimestampAtInMs(ref.current.currentTime * 1000)
  })

  useEffect(() => {
    if (!ref.current) { return }
    setStaticVideoRef(ref.current)
  }, [setStaticVideoRef])

  const placeholder = <div
    className="
      text-base
      text-center
      text-stone-50/90 dark:text-stone-50/90
      "
    >{
      error ? <span>{error}</span> : 
      <span>No video yet</span>
    }</div>

  const hasVideoContent = Boolean(video && video?.length > 128)

  return (
    <>{
      children ? children : isBusy ? <div className="
    flex flex-col flex-grow
    items-center justify-center
    w-full h-full
    text-center space-y-1.5">
      <p className="text-2xl font-bold">{progress}%</p> 
      <p className="text-base text-white/70">{
      status
        ? status
        : error
        ? <span>{error}</span>
        : placeholder // to prevent layout changes
      }</p>
      </div>
    : hasVideoContent ? <video
      ref={ref}
      src={video}
      // controls
      playsInline
      // I think we can't autoplay with sound,
      // so let's disable auto-play
      // autoPlay
      // muted
      loop
      className="h-full object-cover rounded-lg border border-stone-950"
      style={{
      }}
    /> : placeholder
  }</>
  )
}