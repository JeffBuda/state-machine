export enum TileKind {
    castle = "castle",
    field = "field",
    water = "water",
    forest = "forest",
    swamp = "swamp",
    wheat = "wheat",
    mine = "mine"
}

export class Tile {
    constructor(public readonly kind: TileKind, public readonly crowns: number) {
        this.kind = kind;
        this.crowns = crowns;
    }
    public toString(): string {
        return `${this.kind} (${this.crowns} crowns)`;
    }
}

export class TileLocation {
    constructor(public readonly x: number, public readonly y: number) {
    }
    public toString(): string {
        return `${this.x}, ${this.y}`;
    }
}
