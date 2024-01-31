import type { DraggableProvided } from '@hello-pangea/dnd';

import type { Card } from '../../common/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { socket } from "../../context/socket";
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import { CardEvent } from '../../common/enums';

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  onRemoveCard: () => void;
};

export const CardItem = ({ card, isDragging, provided, onRemoveCard }: Props) => {
  const handleRenameTitle = (newName: string) => {
    socket.emit(CardEvent.RENAME, card.id, newName);
  };

  const handleChangeText = (text: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, card.id, text);
  };
  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={handleRenameTitle}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={handleChangeText} />
        <Footer>
          <DeleteButton onClick={onRemoveCard} />
          <Splitter />
          <CopyButton onClick={() => {}} />
        </Footer>
      </Content>
    </Container>
  );
};
