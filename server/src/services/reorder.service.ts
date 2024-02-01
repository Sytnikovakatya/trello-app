import { Card } from '../data/models/card';
import { List } from '../data/models/list';

export class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    const result = this.insert(listWithRemoved, endIndex, card);

    return result;
  }

  public insertCardToList(cards: Card[], index: number, card: Card): Card[] {
    return [...cards.slice(0, index), card, ...cards.slice(index)];
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    const target: Card = lists.find(list => list.id === sourceListId)?.cards?.[
      sourceIndex
    ];

    if (!target) {
      return lists;
    }

    const newLists = lists.map(list => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });

    return newLists;
  }

  public removeList(lists: List[], listId: string): List[] {
    return lists.filter(list => list.id !== listId);
  }

  public renameList(lists: List[], listId: string, newName: string): List[] {
    return lists.map(list => {
      if (list.id === listId) {
        list.setName(newName);
      }
      return list;
    });
  }

  public createCard(lists: List[], listId: string, newCard: Card): List[] {
    return lists.map(list =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );
  }

  public updateCardProperty(
    lists: List[],
    cardId: string,
    updater: (card: Card) => void
  ): List[] {
    return lists.map(list => {
      list.cards.forEach(card => {
        if (card.id === cardId) {
          updater(card);
        }
      });
      return list;
    });
  }

  public renameCard(lists: List[], cardId: string, newName: string): List[] {
    return this.updateCardProperty(lists, cardId, card =>
      card.setName(newName)
    );
  }

  public changeDescription(
    lists: List[],
    cardId: string,
    text: string
  ): List[] {
    return this.updateCardProperty(lists, cardId, card =>
      card.setDescription(text)
    );
  }

  public removeCard(lists: List[], listId: string, cardId: string): List[] {
    return lists.map(list => {
      const updateCards = list.cards.filter(card => card.id !== cardId);
      return list.id === listId ? list.setCards(updateCards) : list;
    });
  }

  public duplicateCard(lists: List[], cardId: string): List[] {
    return lists.map(list => {
      list.cards.map(card => {
        if (card.id === cardId) {
          const clonedCard = card.clone();
          list.setCards([...list.cards, clonedCard]);
        }
      });
      return list;
    });
  }

  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}
