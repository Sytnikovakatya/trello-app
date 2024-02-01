import type { DraggableLocation } from '@hello-pangea/dnd';
import { findIndex,  move,  insert, remove } from 'ramda';

import { Card, List } from '../common/types';

export const reorderService = {
  reorderLists<T>(items: T[], startIndex: number, endIndex: number): T[] {
   return move(startIndex, endIndex, items);
  },

  reorderCards(
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation
  ): List[] {
    const getSourceIndex = findIndex((list: List) => list.id === source.droppableId);
    const getDestinationIndex = findIndex((list: List) => list.id === destination.droppableId);

    const current: Card[] = lists[getSourceIndex(lists)]?.cards || [];
    const next: Card[] = lists[getDestinationIndex(lists)]?.cards || [];
    const target: Card = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const reordered: Card[] = this.reorderLists(current, source.index, destination.index);

      return lists.map(list =>
        list.id === source.droppableId ? { ...list, cards: reordered } : list
      );
    }

    const newLists = lists.map(list => {
      if (list.id === source.droppableId) {
        return {
          ...list,
          cards: this.removeCardFromList(current, source.index)
        };
      }

      if (list.id === destination.droppableId) {
        return {
          ...list,
          cards: this.addCardToList(next, destination.index, target)
        };
      }
      return list;
    });
    return newLists;
  },

  removeCardFromList(cards: Card[], index: number): Card[] {
    return remove(index, 1, cards)
  },

  addCardToList(cards: Card[], index: number, card: Card): Card[] {
    return insert(index, card, cards)
  }
};