"use client"
import { useCallback, useEffect, useRef, useState } from "react";

export type RowSpecs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
export type ColSpecs = {
    numberOfRows: number,
    amountOfValues: Array<number>,
}
export function useForcePanelUpdate () {
    const [, setState] = useState(true);
    const panelUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return panelUpdate;
}
export function useSettingsUpdate () {
    const [, setState] = useState(true);
    const settingsUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return settingsUpdate;
}
export function useCallbackAction <T, Args extends any[]>(callback: (...args: Args) => Promise<T>, initialState: T): {
    state: T;
    isPending: boolean;
    error: Error | null;
    run: (...args: Args) => void,
    reset: () => void;
    cancel: () => void;
} {
    const [ isPending, setIsPending ] = useState<boolean>(false);
    const [ state, setState ] = useState<T>(initialState);
    const [ error, setError ] = useState<Error | null>(null);

    const isMountedRef = useRef<boolean>(false);
    const currentCall = useRef<AbortController | null>(null);

    const run = useCallback((...args: Args) => {
        setIsPending(true);
        setError(null);

        const controller = new AbortController();
        currentCall.current?.abort();
        currentCall.current = controller;

        callback(...args)
        .then(result => {
            if (!controller.signal.aborted && isMountedRef.current) {
                setState(result);
            }
        })
        .catch(reason => {
            if (!controller.signal.aborted && isMountedRef.current) {
                setError(reason);
            }
        })
        .finally(() => {
            if (isMountedRef.current) {
                setIsPending(false);
            }
        });
    }, [callback]);

    const reset = useCallback(() => {
        setState(initialState);
        setError(null);
    }, [initialState]);

    const cancel = useCallback(() => {
        currentCall.current?.abort();
        setIsPending(false);
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            currentCall.current?.abort();
        };
    }, []);

    return {
    state,
    isPending,
    error,
    run,
    reset,
    cancel,
  };
}