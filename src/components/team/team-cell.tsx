"use client"

import { UsersIcon } from "lucide-react"
import { useContext } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { Team } from "../../types/auth-hooks"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"

export interface TeamCellProps {
    classNames?: SettingsCardClassNames
    team: Team
    localization: AuthLocalization
}

export function TeamCell({ classNames, team, localization }: TeamCellProps) {
    const { teams } = useContext(AuthUIContext)

    const getTeamColor = (index: number) => {
        const colorIndex = (index % (teams?.colors.count || 5)) + 1
        return `hsl(var(--team-${colorIndex}))`
    }

    // Simple color hash based on team ID
    const teamIndex = parseInt(team.id.slice(0, 8), 16) % 5

    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 rounded-lg border p-4",
                classNames?.cell
            )}
        >
            <div className="flex items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-full"
                    style={{
                        backgroundColor: getTeamColor(teamIndex),
                        opacity: 0.2
                    }}
                >
                    <UsersIcon
                        className="size-5"
                        style={{ color: getTeamColor(teamIndex) }}
                    />
                </div>

                <div className="flex flex-col">
                    <span className="font-medium">{team.name}</span>
                    <span className="text-muted-foreground text-sm">
                        {localization.TEAM}
                    </span>
                </div>
            </div>
        </div>
    )
}
