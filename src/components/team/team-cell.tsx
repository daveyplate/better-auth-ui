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

/**
 * Render a single-row team cell with a color-coded circular avatar, the team name, and a localized "Team" label.
 *
 * @param classNames - Optional class name overrides for component parts
 * @param team - Team data object containing at least `id` and `name`
 * @param localization - Localization strings providing `TEAM` label
 * @returns The rendered team cell element
 */
export function TeamCell({ classNames, team, localization }: TeamCellProps) {
    const { teams } = useContext(AuthUIContext)

    const colorCount = Math.max(1, teams?.colors.count || 5)

    const getTeamColor = (index: number) => {
        const colorIndex = (index % colorCount) + 1
        return `hsl(var(--team-${colorIndex}))`
    }

    // Stable color hash based on team ID (sum of char codes)
    const teamIndex =
        team.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        colorCount

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
