import { HeaderMegaMenu } from "@/components/HeaderMegaMenu/HeaderMegaMenu"
import { SideNavbar } from "@/components/SideNavbar/SideNavbar"

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div>
        <HeaderMegaMenu />
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "row", flex: "1" }}>
                <SideNavbar />
                {children}
            </div>
        </div>
        </div>
    )
}