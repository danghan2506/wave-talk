import React from 'react'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip'
type ActionTooltipProps = {
    label: string,
    children: React.ReactNode,
    side?: "top" | "right" | "bottom" | "left",
    align?: "start" | "end" | "center"
}
const ActionTooltip = ({label, children, side, align} : ActionTooltipProps) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className='font-semibold text-sm capitalize'>
                    {label.toLowerCase()}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip