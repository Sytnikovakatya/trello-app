import { randomUUID } from 'crypto';

import { Card } from './card';

class List {
  public id: string;

  public name: string;

  public cards: Card[] = [];

  public constructor(name: string) {
    this.name = name;
    this.id = randomUUID();
  }

  public setName(name: string): void {
    this.name = name;
  }

  setCards(cards: Card[]) {
    this.cards = cards;

    return this;
  }
}

export { List };
