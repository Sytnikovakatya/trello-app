import type { Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';

export class ListHandler extends SocketHandler {
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
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.updateListsAndData(reorderedLists);
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    const updatedLists = lists.concat(newList);
    this.updateListsAndData(updatedLists);
  }

  private removeList(listId: string): void {
    const lists = this.db.getData();
    const updatedLists = this.reorderService.removeList(lists, listId);
    this.updateListsAndData(updatedLists);
  }

  private renameList(listId: string, newName: string): void {
    const lists = this.db.getData();
    const updatedLists = this.reorderService.renameList(lists, listId, newName);
    this.updateListsAndData(updatedLists);
  }

  private updateListsAndData(updatedLists: List[]): void {
    this.db.setData(updatedLists);
    this.updateLists();
  }
}
