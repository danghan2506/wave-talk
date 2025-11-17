import React from 'react'
import { UserAvatarProps } from '@/types/user-type'
import { Avatar, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'
const UserAvatar = ({src, className} : UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10")}>
        <AvatarImage src={src}></AvatarImage>
    </Avatar>
  )
}

export default UserAvatar