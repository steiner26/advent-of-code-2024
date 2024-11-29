export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Coordinate) {
    return new Coordinate(this.x + other.x, this.y + other.y);
  }

  equals(other: Coordinate) {
    return this.x === other.x && this.y === other.y;
  }
}

export enum Angle {
  'DEGREES_0' = 0,
  'DEGREES_90' = 1,
  'DEGREES_180' = 2,
  'DEGREES_270' = 3,
}

export class Direction extends Coordinate {
  static RIGHT = new Direction(1, 0);
  static UP = new Direction(0, -1);
  static LEFT = new Direction(-1, 0);
  static DOWN = new Direction(0, 1);
  private static ORDER = [this.RIGHT, this.UP, this.LEFT, this.DOWN];

  private constructor(x: number, y: number) {
    super(x, y);
  }

  angleTo(other: Direction): Angle {
    const indexThis = Direction.ORDER.indexOf(this);
    const indexOther = Direction.ORDER.indexOf(other);
    return Object.values(Angle)[(indexOther - indexThis + 4) % 4] as Angle;
  }

  rotate(angle: Angle) {
    const angleOffset: number = Angle[angle] as unknown as number;
    const newIndex = (Direction.ORDER.indexOf(this) + angleOffset) % 4;
    return Direction.ORDER[newIndex];
  }
}
