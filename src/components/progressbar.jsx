'use client';
import { Progress } from "@nextui-org/react";

export default function ProgressBar({ value = 0, color = "primary" }) {
    return (
        <div className="w-full flex flex-col items-center gap-2">
            <Progress
                value={value}
                color={color}
                className="max-w-md"
                aria-label="Loading progress"
                size="md"
                radius="sm"
            />
            <div className="flex justify-between w-full max-w-md text-sm text-default-400">
                <span>Houses</span>
                <span>Students</span>
                <span>Sort</span>
            </div>
        </div>
    );
}
