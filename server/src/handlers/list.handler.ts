import type { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { Logger, FileLogger, ErrorConsoleLogger } from '../loggers/loggers';
import { proxy as reorderServiceProxi } from '../loggers/reorder-service-proxy';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';

export class ListHandler extends SocketHandler {
  private logger: Logger;

  constructor(io: Server, db: Database, reorderService: ReorderService) {
    super(io, db, reorderService);
    this.logger = new Logger();
    this.logger.addSubscriber(new FileLogger('src/file/console/logging.txt'));
    this.logger.addSubscriber(new ErrorConsoleLogger());
  }

  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.removeList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = reorderServiceProxi.reorder(
        lists,
        sourceIndex,
        destinationIndex
      );
      this.updateListsAndData(reorderedLists);
      this.logger.log('Lists reordered');
    } catch (error) {
      this.logger.log(`Error reordering list: ${error}`, true);
    }
  }

  private createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      const updatedLists = lists.concat(newList);
      this.updateListsAndData(updatedLists);
      this.logger.log(`List created: ${name}`);
    } catch (error) {
      this.logger.log(`Error creating list: ${error}`, true);
    }
  }

  private removeList(listId: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = reorderServiceProxi.removeList(lists, listId);
      this.updateListsAndData(updatedLists);
      this.logger.log(`Removing list with ID: ${listId}`);
    } catch (error) {
      this.logger.log(`Error removing list: ${error}`, true);
    }
  }

  private renameList(listId: string, newName: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = reorderServiceProxi.renameList(
        lists,
        listId,
        newName
      );
      this.updateListsAndData(updatedLists);
      this.logger.log(`Renaming list with ID: ${listId}`);
    } catch (error) {
      this.logger.log(`Error renaming list: ${error}`, true);
    }
  }

  private updateListsAndData(updatedLists: List[]): void {
    this.db.setData(updatedLists);
    this.updateLists();
  }
}
