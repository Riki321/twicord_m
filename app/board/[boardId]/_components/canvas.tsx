"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import React, { use, useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/types/canvas";
import { useHistory, useCanRedo, useCanUndo, useMutation, useStorage } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { root } from "postcss";
import {nanoid} from "nanoid";
import { LiveObject } from "@liveblocks/client";
const MAX_LAYERS = 100;


interface CanvasProps {
    boardId: string;
};
export const Canvas = ({
    boardId,
}: CanvasProps) => {

    const LayerIds=useStorage((root) => root.layerIds);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const [camera, setCameraState] = useState<Camera>({ x: 0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({ r: 0, g: 0, b: 0});
    
    
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer=useMutation((
        {storage, setMyPresence},
        layerType:LayerType.Ellipse|LayerType.Rectangle|LayerType.Text|LayerType.Note,
        position:Point,
    )=>{
        const liveLayers=storage.get("layers");
        if(liveLayers.size>=MAX_LAYERS){
            return;
        }

        const liveLayerIds=storage.get("layerIds");
        const layerId=nanoid();
        const layer=new LiveObject({
            type:layerType,
            x:position.x,
            y:position.y,
            width:100,
            height:100,
            fill:lastUsedColor,
        })

        liveLayerIds.push(layerId);
        liveLayers.set(layerId,layer);

        setMyPresence({selection:[layerId]},{addToHistory:true});
        setCanvasState({mode:CanvasMode.None});
    },[lastUsedColor]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCameraState((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY
        }))
    }, []);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.
        PointerEvent) => {
        e.preventDefault();
        const current = pointerEventToCanvasPoint(e, camera);
        // console.log(current);

        setMyPresence({ cursor: current });
    }, []);

    const onPointerLeave = useMutation((
        { setMyPresence }
    ) => {
        setMyPresence({ cursor: null });
    }, []);

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                undo={history.undo}
                redo={history.redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <svg className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    );
};
