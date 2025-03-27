import styled from "styled-components";

export const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1001;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: white;
  overflow: auto;
`;

export const Header = styled.div`
  height: 70px;
  padding: 15px 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d1d5db;
  border-color: rgb(229 231 235);
  div {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;
export const Floating = styled.div`
  position: fixed;
  top: 0;
  z-index: 1001;
  right: 20px;
  top: 20px;
  display: flex;
  gap: 10px;
`;
export const MainContent = styled.div`
  display: flex;
  flex: 1;
  background-color: rgb(243 244 246);
`;
export const ElementTemplateHeading = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(243 244 246);
  border-bottom: 1px solid #e3e3e3;
  padding-top: 10px;
  font-size: 18px;
`;
export const ElementTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(243 244 246);
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 20px;
`;
export const MainCntrols = styled.div`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  margin: 10px auto;
  gap: 20px;
  max-width: 600px;
  width: 100%;
  justify-content: space-between;
  .memory {
    display: flex;
    gap: 10px;
  }
  &.justify {
    justify-content: space-between;
  }
  .head {
    display: flex;
    align-items: center;
    font-weight: 500;
  }
`;
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export const Field = styled.div`
  display: flex;
  border-top: 1px solid rgb(227, 227, 227);
  align-items: center;
  padding: 5px 0;
  gap: 5px;
  &.box,
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;
    font-family: Arial, sans-serif;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
    /* table-layout: fixed; */
  }
  th {
    padding: 12px 15px;
    text-align: left;
    background-color: #f8f8f8;
  }
  tr {
    background-color: #ffffff;
    transition: all 0.3s ease;
  }

  tr:nth-child(even) {
  }

  tr:hover {
    /* background-color: #f1f1f1; */
  }
  .HEADING {
    background-color: #f8f8f8;
  }
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
    font-weight: normal;
    > span {
      display: flex;
      gap: 10px;
    }
    > img,
    > span img {
      max-height: 50px;
    }
  }

  /* td:first-child {
    font-weight: bold;
  } */

  @media screen and (max-width: 600px) {
    table {
      font-size: 0.8rem;
    }

    td {
      padding: 8px 10px;
    }
  }
`;
export const AddField = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgb(227, 227, 227);
  align-items: center;
  padding: 5px 0;
  &.bottom {
    border-bottom: 1px solid rgb(227, 227, 227);
    margin-bottom: 20px;
  }
`;
export const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
  width: 100%;
`;
export const SideHead = styled.div`
  display: grid;
  padding: 15px 1rem;
  grid-template-columns: repeat(2, auto);
  grid-gap: 10px;
  &.text {
    display: block;
  }
  span {
  }
  div {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
  }
`;
export const SectionContaier = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
`;
export const SectionContaieritem = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
export const Sections = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: 10px;
  padding: 15px 1rem;
  &.full {
    grid-template-columns: repeat(1, auto);
  }
`;
export const FormSections = styled.div`
  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-gap: 10px;
  padding: 15px 1rem;
`;
export const Section = styled.div`
  border: 1px solid gray;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  flex-direction: column;
  gap: 10px;
  background-image: url(${(props) => props.image});
  opacity: ${(props) => (props.isDisabled ? 0.2 : 1)};
  height: 100px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  span {
    font-size: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(233, 233, 233, 0.53);
    padding: 4px;
  }
  svg {
    width: 20px;
    height: 20px;
  }
  &.true {
    background-color: #e9e9e9;
  }
  &.active {
    .status {
      padding: 7px;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 50%;
      opacity: 0.9;
    }
  }
`;
export const Sidebar = styled.div`
  width: 300px;
  background-color: #f9fafb;
  border-right: 1px solid #d1d5db;
  padding: 0;
  overflow-y: auto;
  max-height: calc(100vh - 65px);
`;

export const RightContent = styled.div`
  flex: 1;
  padding: 0rem;
  max-height: calc(100vh - 65px);
  overflow-y: auto;
`;
export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 0.25rem;
  &:hover {
    background-color: #2563eb;
  }
`;
export const IconButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border: none;
  cursor: pointer;
  width: auto;
  border-radius: 0.25rem;
  &:hover {
    background-color: #2563eb;
  }
`;
export const ContainerBox = styled.div`
  border: 1px solid #d1d5db;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #ffffff;
`;
export const TemplateAction = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: fit-content;
  align-self: center;
`;
export const Controls = styled.div`
  display: flex;
  justify-content: center;
  /* margin-bottom: 0.5rem; */
  align-items: center;
  left: auto;
  right: 0;
  position: absolute;
  top: 20px;
  z-index: 1000;
  &.side {
    top: auto;
    position: initial;
  }
  & > button {
    margin-left: 0.5rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: absolute;
  inset: auto 0px 10px;
  margin: auto auto 0px;
  padding: 10px 10px;
  border-radius: 12px;
  z-index: 1000;
  inset-area: center;
  position-area: center;
  /* display: none; */
  backdrop-filter: blur(4px);
  background: rgb(255 255 255 / 83%);
  /* border: 1px solid lightgray; */
  box-shadow: rgba(0, 0, 0, 0) -1px 0px, rgba(0, 0, 0, 0) -1px 0px, rgb(0 0 0 / 8%) -1px -2px 18px 0px;
`;

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

export const GridColumn = styled.div`
  grid-column: span ${(props) => props.width * 12};
  /* padding: 0.5rem; */
  border: 1px dashed transparent;
  position: relative;
  &:hover {
    border: 1px dashed #d1d5db;
  }
`;

export const AddElementButton = styled.button`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  &:hover {
    background-color: #059669;
  }
`;

export const ElementBox = styled.div`
  /* padding: 0.5rem;
  margin-bottom: 0.5rem; */
  position: relative;
  /* background-color: #f3f4f6; */
  border: 1px dashed lightgray;
  min-height: 80px;
  grid-column: span ${(props) => props.gridSpan};
  &.scroll {
    overflow: auto;
  }
  ${(props) =>
    props.isDragging &&
    `  
    opacity: 0.8;  
    background: ${props.theme.colors.background};  
    box-shadow: 0 5px 10px rgba(0,0,0,0.15);  
  `}
  *[contenteditable="true"]:hover,
    *[contenteditable="true"]:hover {
    border: 2px solid #007bff; /* Blue border with 2px width */
    outline: none; /* Remove default outline */
  }

  &.add {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &:hover {
    border: 1px solid #d1d5db;
    .controlls {
      display: flex;
    }
  }
  &.fullScreen {
    border: 0px !important;
  }
`;

export const ElementControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  align-items: center;
  position: absolute;
  top: -15px;
  left: -15px;
  z-index: 1;
  & > span {
    cursor: grab;
    margin-right: auto;
  }

  & > button {
    margin-left: 0.5rem;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  height: ${(props) => (props.small ? "50px" : "100px")};
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
`;

export const ToggleContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  white-space: nowrap;
  & > button {
    flex: 1;
    margin-right: 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const PreviewArea = styled.div`
  border: 1px solid #d1d5db;
  margin: 1rem auto;
  padding: 1rem;
  max-width: 90%;
  width: 100%;
  container: card / inline-size;
  background-color: #ffffff;
  &.respo {
    background-color: var(--background-color);
  }
  display: flex;
  gap: 10px;
  flex-direction: column;
  border: 0px solid rgb(233, 233, 233);
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  ${(props) =>
    props.fullScreen
      ? `position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 0;
    max-width:100%;
    z-index: 1001;
    margin: 0;
    overflow: auto;
    padding-bottom:10px;`
      : ""}
  ${(props) =>
    props.view === "Mobile"
      ? `  
      width: 375px;  
      margin: 0 auto;  
      border: 1px solid #d1d5db;  
    `
      : props.view === "Tablet"
      ? `  
      width: 720px;  
      margin: 0 auto;  
      border: 1px solid #d1d5db;  
    `
      : ""}
`;

export const PlaceholderText = styled.p`
  text-align: center;
  color: #9ca3af;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  /* background-color: #e5e7eb; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
`;
export const Accordian = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const AccordianTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e5e5e5;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:first-child {
    border-top: none;
  }
  span {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &:hover {
    background-color: #e5e5e5;
  }
`;

export const AccordianContent = styled.div`
  padding: 10px;
  border-top: 1px solid #e5e5e5;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a4a4a;
  .form {
    padding: 0px 10px 10px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

export const FragDiv = styled.div`
  .add-new {
    background-color: #ffffff;
    padding: 5px 18px;
    border-radius: 4px;
    border: 1px solid grey;
    cursor: pointer;
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;
export const GridWrapper = styled.div`
  display: flex;
  gap: 4px;
  .box img {
    max-height: 100px;
  }
`;

export const GridButton = styled.button`
  min-width: 40px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: ${(props) => (props.active ? "#4785ff" : "#f1f5f9")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 10px;
  &:hover {
    transform: translateY(-1px);
    background: ${(props) => (props.active ? "#4785ff" : "#e2e8f0")};
  }
`;
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: 0.4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #3b82f6;
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

export const NumberInput = styled.input`
  width: 90px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid #3b82f6;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
  ${(props) =>
    props.type === "number"
      ? `  
   width: 90px;
  `
      : `  
   width: 290px;
   max-width: 100%;
  `}
`;
export const DroppableArea = styled.div`
  min-height: 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
`;

export const DraggableWrapper = styled.div`
  background-color: ${(props) => (props.isDragging ? "#f3f4f6" : "transparent")};
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  > * {
    height: 100%;
    width: 100%;
  }
`;

export const DroppableContainer = styled.div`
  min-height: 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
`;
export const Container = styled.div`
  padding: 10px 2em;
  display: flex;
  height: 100px;
  &.sub {
    padding: 10px 15px;
    height: auto;
  }
  @media (max-width: 768px) {
    padding: 0px 1em;
  }
`;
export const Heading = styled.div`
  margin-right: auto;
  font-weight: bold;
  align-items: center;
  display: flex;
  gap: 10px;
  @media screen and (max-width: 768px) {
    img {
      height: 45px;
    }
  }
`;
export const Left = styled.div`
  flex: 1 1 calc(100% - 15em);
  display: flex;
  justify-content: left;
  align-items: center;
  padding-right: 0px;
  gap: 10px;
`;
export const Right = styled.div`
  flex: 1 1 calc(100% - 15em);
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 0px;
  gap: 10px;
`;
export const Title = styled.div`
  margin-right: auto;
  font-weight: bold;
  align-items: center;
  display: flex;
  justify-content: space-between;
  &.sub {
    padding-bottom: 10px;
  }

  svg {
    margin-right: 10px;
  }
  @media screen and (max-width: 768px) {
    img {
      height: 45px;
    }
  }
`;
