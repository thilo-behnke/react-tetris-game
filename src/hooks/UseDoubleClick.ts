import {useCallback, useEffect, useRef, useState} from "react";

export const useDoubleClick = (elementRef: any, keyCode: number) => {
    const [lastKeyDown, setLastKeyDown] = useState<number | null>(null);
    const [doubleClickRegistered, setDoubleClickRegistered] = useState<boolean>(false);

    const timer = useRef<number | null>();

    const onKeyDown = useCallback((e: any) => {
        if(e.keyCode !== keyCode) {
            return;
        }
        if(timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => setLastKeyDown(null), 200);

        const timestamp = Date.now();
        if (lastKeyDown && lastKeyDown - timestamp < 200) {
            setDoubleClickRegistered(true);
            setLastKeyDown(null);
            return;
        }
        setDoubleClickRegistered(false);
        setLastKeyDown(timestamp);
    }, [keyCode, lastKeyDown]);

    useEffect(() => {
        const currentElementRef = elementRef.current;
        currentElementRef.addEventListener('keydown', onKeyDown);
        return () => currentElementRef.removeEventListener('keydown', onKeyDown);
    }, [elementRef, onKeyDown]);

    return doubleClickRegistered;
}
