import type { Server, Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { Logger, FileLogger, ErrorConsoleLogger } from '../loggers/loggers';
import { proxy as reorderServiceProxi } from '../loggers/reorder-service-proxy';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';

export class CardHandler extends SocketHandler {
  private logger: Logger;

  constructor(io: Server, db: Database, reorderService: ReorderService) {
    super(io, db, reorderService);
    this.logger = new Logger();
    this.logger.addSubscriber(new FileLogger('src/file/console/logging.txt'));
    this.logger.addSubscriber(new ErrorConsoleLogger());
  }

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
    try {
      const updatedLists = reorderServiceProxi.createCard(
        lists,
        listId,
        newCard
      );
      this.updateListsAndData(updatedLists);
      this.logger.log(`Card created: ${cardName}`);
    } catch (error) {
      this.logger.log(`Error creating card: ${error}`, true);
    }
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
    try {
      const lists = this.db.getData();
      const reordered = reorderServiceProxi.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId
      });
      this.updateListsAndData(reordered);
      this.logger.log('Reordering cards');
    } catch (error) {
      this.logger.log(`Error reordering card: ${error}`, true);
    }
  }

  private renameCard(cardId: string, newName: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = reorderServiceProxi.renameCard(
        lists,
        cardId,
        newName
      );
      this.updateListsAndData(updatedLists);
      this.logger.log(`Renaming card with ID: ${cardId}`);
    } catch (error) {
      this.logger.log(`Error renaming card: ${error}`, true);
    }
  }

  private changeDescription(cardId: string, text: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = reorderServiceProxi.changeDescription(
        lists,
        cardId,
        text
      );
      this.updateListsAndData(updatedLists);
      this.logger.log(`Changing description of card with ID: ${cardId}`);
    } catch (error) {
      this.logger.log(`Error changing description: ${error}`, true);
    }
  }

  private removeCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = reorderServiceProxi.removeCard(
        lists,
        listId,
        cardId
      );
      this.updateListsAndData(updatedLists);
      this.logger.log(`Removing card with ID: ${cardId}`);
    } catch (error) {
      this.logger.log(`Error removing card: ${error}`, true);
    }
  }

  private duplicateCard(cardId: string): void {
    try {
      const lists = this.db.getData();
      const duplicatedCard = reorderServiceProxi.duplicateCard(lists, cardId);
      this.updateListsAndData(duplicatedCard);
      this.logger.log(`Duplicating card with ID: ${cardId}`);
    } catch (error) {
      this.logger.log(`Error duplicating card: ${error}`, true);
    }
  }

  private updateListsAndData(updatedLists: List[]): void {
    this.db.setData(updatedLists);
    this.updateLists();
  }
}
