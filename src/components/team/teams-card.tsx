"use client"
import { useContext, useMemo, useState } from "react"
import { useCurrentOrganization } from "../../hooks/use-current-organization"
import { useIsHydrated } from "../../hooks/use-hydrated"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { SettingsCardProps } from "../settings/shared/settings-card"
import { SettingsCard } from "../settings/shared/settings-card"
import { SettingsCellSkeleton } from "../settings/skeletons/settings-cell-skeleton"
import { CardContent } from "../ui/card"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamCell } from "./team-cell"

export function TeamsCard({
    className,
    classNames,
    localization,
    ...props
}: SettingsCardProps) {
    const {
        hooks: { useListTeams },
        localization: contextLocalization
    } = useContext(AuthUIContext)

    localization = useMemo(
        () => ({ ...contextLocalization, ...localization }),
        [contextLocalization, localization]
    )

    const isHydrated = useIsHydrated()
    const { data: organization } = useCurrentOrganization()
    const { data: teams, isPending: teamsPending } = useListTeams({
        organizationId: organization?.id
    })

    const isPending = !isHydrated || teamsPending

    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization.TEAMS}
                description={localization.TEAMS_DESCRIPTION}
                actionLabel={localization.CREATE_TEAM}
                action={() => setCreateDialogOpen(true)}
                isPending={isPending}
                {...props}
            >
                <CardContent className={cn("grid gap-4", classNames?.content)}>
                    {isPending && <SettingsCellSkeleton />}
                    {!isPending && teams?.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            {localization.NO_TEAMS_FOUND}
                        </p>
                    )}
                    {teams?.map((team) => (
                        <TeamCell
                            key={team.id}
                            classNames={classNames}
                            team={team}
                            localization={localization}
                        />
                    ))}
                </CardContent>
            </SettingsCard>

            <CreateTeamDialog
                classNames={classNames}
                localization={localization}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                organizationId={organization?.id}
            />
        </>
    )
}
