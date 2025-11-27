import React from "react";

export type SidebarProps<T extends string> = {
    items: T[],
    value: T,
    onChange?: (value: T) => void,
    disableSidebarSel?: boolean
}

export default function SidebarMenu<T extends string>({
    items, 
    value, 
    onChange, 
    disableSidebarSel = false
}: SidebarProps<T>) {
    const sidebarSelRef = React.useRef<HTMLSpanElement>(null)
    const uniqueId = React.useId()

    React.useEffect(() => {
        const sidebarSel = sidebarSelRef.current
        if (!sidebarSel) return
        // Add your logic here for what should happen when value changes

    }, [value, items, disableSidebarSel])

    const handleItemClick = (item: T) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        onChange?.(item)
    }

    return (
        <>
            <aside 
                id="default-sidebar" 
                className="relative flex h-screen w-full max-w-[4rem] flex-col rounded-xl bg-white bg-clip-border p-1 text-gray-700 shadow-xl shadow-blue-gray-900/5 overflow-auto" 
                aria-label="Sidebar"
            >
                <div className="">
                    <ul className="space-y-2 font-medium">
                        {items.map((item) => (
                            <li key={`${uniqueId}-${item}`}>
                                <a 
                                    href="#" 
                                    onClick={handleItemClick(item)}
                                    className={`flex flex-col items-center px-2 py-2 rounded-base group ${
                                        value === item 
                                            ? 'bg-[#B6EBFF] text-[#00A8E8] rounded-sm' 
                                            : 'text-body hover:bg-neutral-tertiary hover:text-fg-brand'
                                    }`}
                                >   
                                    {renderIcon(item)}
                                    <span className="text-xs font-semibold">{item}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            {disableSidebarSel && (
                <span ref={sidebarSelRef} className="hidden">
                    Sidebar is disabled
                </span>
            )}
        </>
    )
}

function renderIcon(item: string) {
    const iconClass = "shrink-0 w-6 h-6 transition duration-75 group-hover:text-fg-brand"
    
    switch(item.toLowerCase()) {
        case 'project':
            return (
                <svg className={iconClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/>
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/>
                </svg>
            )
        case 'stops':
            return (
                <svg className={iconClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M200,224H150.54A266.56,266.56,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25a88,88,0,0,0-176,0c0,31.4,14.51,64.68,42,96.25A266.56,266.56,0,0,0,105.46,224H56a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16ZM56,104a72,72,0,0,1,144,0c0,57.23-55.47,105-72,118C111.47,209,56,161.23,56,104Zm112,0a40,40,0,1,0-40,40A40,40,0,0,0,168,104Zm-64,0a24,24,0,1,1,24,24A24,24,0,0,1,104,104Z"></path>
                </svg>
            )
        case 'routes':
            return (
                <svg className={iconClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M200,168a32.06,32.06,0,0,0-31,24H72a32,32,0,0,1,0-64h96a40,40,0,0,0,0-80H72a8,8,0,0,0,0,16h96a24,24,0,0,1,0,48H72a48,48,0,0,0,0,96h97a32,32,0,1,0,31-40Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,200,216Z"></path>
                </svg>
            )
        case 'calendar':
            return (
                <svg className={iconClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
                </svg>
            )
        case 'trips':
            return (
                <svg className={iconClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"></path>
                </svg>
            )
        default:
            return null
    }
}