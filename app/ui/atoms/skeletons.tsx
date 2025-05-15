"use client"
import { Skeleton } from "@heroui/react";

export function UserSkeleton () {
    return (
        <div className="w-[169px] h-[40px] flex flex-row gap-1">
            <Skeleton className="rounded-full">
                <div className="w-[40px] h-[40px]"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
                <div className="w-[120px] h-[36px]"></div>
            </Skeleton>
        </div>
    )
}

export function DashboardSkeleton () {
    return (
        <Skeleton className="rounded-lg">
            <div className="w-full h-[150px]"></div>
        </Skeleton>
    )
}

export function TableSkeleton () {
    return (
        <div className="flex flex-col justify-center items-center rounded-lg border-small border-default p-5">
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[200px] h-[40px]"></div>
                </Skeleton>
            </div>
        </div>
    )
}

export function ValuesSkeleton () {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[213px] h-[40px]"></div>
                </Skeleton>
                <Skeleton className="rounded-xl">
                    <div className="rounded-xl w-[40px] h-[40px]"></div>
                </Skeleton>
            </div>
        </div>
    )
}

export function SettingsSkeleton () {
    return (
        <div className="flex flex-col justify-center items-center w-[512px] h-[600px] gap-2 p-5">
            <Skeleton className="rounded-lg">
                <div className="w-[470px] h-[40px]"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
                <div className="w-full h-full"></div>
            </Skeleton>
        </div>
    )
}