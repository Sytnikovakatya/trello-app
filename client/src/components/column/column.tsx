import { colors } from '@atlaskit/theme';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';

import { CardEvent, ListEvent } from "../../common/enums";
import type { Card } from '../../common/types';
import { CardsList } from '../card-list/card-list';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Title } from '../primitives/title';
import { Footer } from './components/footer';
import { socket } from "../../context/socket";
import { Container } from './styled/container';
import { Header } from './styled/header';

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
  onRemoveList: (listId:string)=>void;
};

export const Column = ({ listId, listName, cards, index, onRemoveList }: Props) => {
  const handleRenameList = (newName: string): void =>{
    socket.emit(ListEvent.RENAME, listId, newName);
  }

  const handleCreateCard = (cardName: string): void => {
    if(cardName){
      socket.emit(CardEvent.CREATE, listId, cardName);
    }
  }

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          className="column-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header
            className="column-header"
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
          >
            <Title
              aria-label={listName}
              title={listName}
              onChange={handleRenameList}
              fontSize="large"
              width={200}
              isBold
            />
            <Splitter />
            <DeleteButton color="#FFF0" onClick={() => onRemoveList(listId)} />
          </Header>
          <CardsList
            listId={listId}
            listType="CARD"
            style={{
              backgroundColor: snapshot.isDragging ? colors.G50 : "",
            }}
            cards={cards}
          />
          <Footer onCreateCard={handleCreateCard} />
        </Container>
      )}
    </Draggable>
  );
};
