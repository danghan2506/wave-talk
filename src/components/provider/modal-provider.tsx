"use client"
import { useSyncExternalStore } from "react"
import CreateServerModal from "../modals/create-server-modal"
import InviteModal from "../modals/invite-modal"
export const ModalProvider = () => {
    const isMounted = useSyncExternalStore(
        () => () => {}, // subscribe (không cần subscribe gì)
        () => true,      // getSnapshot (client-side)
        () => false      // getServerSnapshot (server-side)
    )
    if(!isMounted) {return null}
    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
        </>
    )
}