import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';
import React from 'react';

import { Card } from '../../../common/types';
import { CardItem } from '../../card-item/card-item';
import { socket } from '../../../context/socket';
import { CardEvent } from '../../../common/enums';

type Props = {
  cards: Card[];
  listId: string;
};

const Cards = ({ cards, listId }: Props) => (
  <React.Fragment>
    {cards.map((card: Card, index: number) =>  {
      const handleRemoveCard = () => {
        socket.emit(CardEvent.DELETE, listId, card.id)
      }
      return (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(
            dragProvided: DraggableProvided,
            dragSnapshot: DraggableStateSnapshot
          ) => (
            <CardItem
              key={card.id}
              card={card}
              isDragging={dragSnapshot.isDragging}
              provided={dragProvided}
              onRemoveCard={handleRemoveCard}
            />
          )}
        </Draggable>
      );
    })}
  </React.Fragment>
);

export { Cards };
