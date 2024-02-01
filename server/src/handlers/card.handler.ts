import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DELETE, this.removeCard.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, '');
    const lists = this.db.getData();

    const updatedLists = this.reorderService.createCard(lists, listId, newCard);
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    });
    this.db.setData(reordered);
    this.updateLists();
  }

  private renameCard(cardId: string, newName: string): void {
    const lists = this.db.getData();
    const updatedLists = this.reorderService.renameCard(lists, cardId, newName);
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private changeDescription(cardId: string, text: string): void {
    const lists = this.db.getData();
    const updatedLists = this.reorderService.changeDescription(
      lists,
      cardId,
      text
    );
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private removeCard(listId: string, cardId: string): void {
    const lists = this.db.getData();
    const updatedLists = this.reorderService.removeCard(lists, listId, cardId);
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private duplicateCard(cardId: string): void {
    const lists = this.db.getData();
    const duplicatedCard = this.reorderService.duplicateCard(lists, cardId);
    this.db.setData(duplicatedCard);
    this.updateLists();
  }
}
