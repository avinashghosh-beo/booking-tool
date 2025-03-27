import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { ButtonComponent } from "../../../../components/common/Button";
import { GripVertical, Save, XCircle } from "lucide-react";

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.2s;
  ${(props) =>
    props.$isDraggingOver &&
    `
    background-color: rgba(243, 244, 246, 0.5);
  `}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const DraggableItem = styled.div`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) => (props.$isDragging ? "rgba(99, 102, 241, 0.1)" : "#f9fafb")};
  transition: all 0.2s;
  cursor: move;
  align-items: center;
  display: flex;
  gap: 10px;
  &:hover {
    background-color: #f3f4f6;
  }

  ${(props) =>
    props.$isDragging &&
    `
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  `}
`;

const DraggableList = ({ data = [], onChange, showField = "title", orderField = "defaultOrder" }) => {
  const [changed, setChanged] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setChanged(false);
    setItems(data);
  }, [data]);
  // Early return if items is still undefined or null
  if (!items) return null;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
    // Call onChange with the new order
    if (onChange) {
      const orderedItems = newItems.map((item, index) => ({
        ...item,
        defaultOrder: index,
      }));
      setChanged(true);
      setItems(orderedItems);
      //   onChange();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided, snapshot) => (
          <StyledList {...provided.droppableProps} ref={provided.innerRef} $isDraggingOver={snapshot.isDraggingOver}>
            {items.map((item, index) => (
              <Draggable key={item._id} draggableId={String(item._id)} index={index}>
                {(provided, snapshot) => (
                  <DraggableItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} $isDragging={snapshot.isDragging}>
                    <GripVertical size={18} /> {item[showField] ?? "No Title"}
                  </DraggableItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </StyledList>
        )}
      </Droppable>
      <ButtonContainer>
        <ButtonComponent
          type={"secondary"}
          title={"Discard"}
          icon={<XCircle size={18} />}
          onClick={async () => {
            setItems(data);
            setChanged(false);
          }}
          isDisabled={!changed}
        />
        <ButtonComponent
          title={"Update"}
          icon={<Save size={18} />}
          onClick={async () => {
            onChange(items);
          }}
          isDisabled={!changed}
        />
      </ButtonContainer>
    </DragDropContext>
  );
};

export default DraggableList;
