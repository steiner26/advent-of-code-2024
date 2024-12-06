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

  toString() {
    return `[${this.constructor.name}(${this.x},${this.y})]`;
  }
}

export enum Angle {
  'DEGREES_0' = 0,
  'DEGREES_45' = 1,
  'DEGREES_90' = 2,
  'DEGREES_135' = 3,
  'DEGREES_180' = 4,
  'DEGREES_225' = 5,
  'DEGREES_270' = 6,
  'DEGREES_315' = 7,
}

export class Direction extends Coordinate {
  static RIGHT = new Direction(1, 0);
  static UP_RIGHT = new Direction(1, -1);
  static UP = new Direction(0, -1);
  static UP_LEFT = new Direction(-1, -1);
  static LEFT = new Direction(-1, 0);
  static DOWN_LEFT = new Direction(-1, 1);
  static DOWN = new Direction(0, 1);
  static DOWN_RIGHT = new Direction(1, 1);

  static ORDER = [
    Direction.RIGHT,
    Direction.UP_RIGHT,
    Direction.UP,
    Direction.UP_LEFT,
    Direction.LEFT,
    Direction.DOWN_LEFT,
    Direction.DOWN,
    Direction.DOWN_RIGHT,
  ];

  private constructor(x: number, y: number) {
    super(x, y);
  }

  angleTo(other: Direction): Angle {
    const indexThis = Direction.ORDER.indexOf(this);
    const indexOther = Direction.ORDER.indexOf(other);
    return Object.values(Angle)[(indexOther - indexThis + 8) % 8] as Angle;
  }

  rotate(angle: Angle) {
    const angleOffset = angle.valueOf()
    const newIndex = (Direction.ORDER.indexOf(this) + angleOffset) % 8;
    return Direction.ORDER[newIndex];
  }
}
