import type { Content } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import appActions from "../../store/slices/appSlice";
import SidebarMenu from "../molecules/SidebarMenu";

export type SidebarProps = {
    disableSidebarSel?: boolean,
    onChange?: (to: Content) => boolean;
}

export default function Sidebar ({ disableSidebarSel = false, onChange }: SidebarProps) {
    const dispatch = useDispatch();
    const {content} = useSelector((state: RootState) => state.appState);
    
    const handleChange = (c: Content) => {
        if (onChange && !onChange?.(c)) return;
        dispatch(appActions.actions.setContent(c));
    }

    const menuItems: Content[] = [
        "project" as Content,
        "stops" as Content,
        "routes" as Content,
        "calendar" as Content,
        "trips" as Content,
    ]

    return (
        <SidebarMenu
            disableSidebarSel={disableSidebarSel}
            items={menuItems}
            value={content}
            onChange={handleChange}
        />
    )
}