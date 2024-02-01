import { randomUUID } from 'crypto';

// PATTERN:Prototype
interface Cloneable {
  clone(): Cloneable;
}

class Card implements Cloneable {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public clone(): Card {
    return new Card(this.name, this.description);
  }
}

export { Card };
