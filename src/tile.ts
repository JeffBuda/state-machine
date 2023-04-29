export enum TileKind {
    castle = "castle",
    field = "field",
    water = "water",
    forest = "forest",
    swamp = "swamp",
    wheat = "wheat",
    mine = "mine"
}

export interface ITile {
    readonly kind: TileKind;
    readonly crowns: number;
}

export function tileToString(tile: ITile): string {
    return `${tile.kind} (${tile.crowns} crowns)`;
}

export interface ITileLocation {
    readonly x: number;
    readonly y: number;
}

export interface IDominoLocation {
    readonly locA: ITileLocation;
    readonly locB: ITileLocation;
}

export function tileLocationToString(location: ITileLocation): string {
    return `${location.x}, ${location.y}`;
}
