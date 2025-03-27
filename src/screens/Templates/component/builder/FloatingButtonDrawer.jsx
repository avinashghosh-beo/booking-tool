import React, { useState } from "react";
import styled from "styled-components";
import { Menu, X } from "lucide-react";

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(9, 75, 150);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 50;

  &:hover {
    background-color: rgb(9, 75, 150);
    transform: scale(1.05);
  }
`;

const Drawer = styled.aside`
  /* position: fixed; */
  top: 0;
  right: 0;
  width: 320px;
  max-height: calc(-65px + 100vh);
  background-color: white;
  /* box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1); */
  transition: transform 0.3s ease-in-out;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  z-index: 50;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-weight: 500;
`;

const DrawerContent = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`;

function FloatingButtonDrawer({ onOpen, onClose, title, drawerContent }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    onOpen?.();
  };

  return (
    <React.Fragment>
      <Drawer isOpen={isOpen}>
        <DrawerHeader>
          <Title>{title}</Title>
        </DrawerHeader>
        <DrawerContent>{drawerContent}</DrawerContent>
      </Drawer>
      <FloatingButton onClick={handleOpen}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </FloatingButton>
    </React.Fragment>
  );
}

export default FloatingButtonDrawer;
