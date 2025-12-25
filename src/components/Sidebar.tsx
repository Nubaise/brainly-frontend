
import { SidebarItem } from "./SidebarItem"

import { Logo } from "../icons/Logo"

import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"


export function Sidebar() {
    return <div className="fixed border-2 h-screen w-72 bg-white
    left-0 top-0 pl-6">
        <div className="flex text-2xl pt-4 items-center">
            <div className="pr-2 text-purple-600" > 
                <Logo /> 
            </div>
            Brainly
        </div>
        <div className="pt-6 pl-4">
            <SidebarItem text="Twitter" icon={<TwitterIcon />} />
            <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
        </div>
    </div>
}