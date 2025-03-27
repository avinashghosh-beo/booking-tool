import React, { useState } from "react";
import { ButtonComponent } from "../../components/common/Button";
import ConfirmationModal from "../../components/modals/Confirmation";
import ChatWindow from "../../components/chatWindow";
import ChoiceSelectorModal from "../../components/modals/ChoiceSelector";
import TemplateCard from "../../components/cards/TemplateCard";
import MediaPicker from "../../components/MediaPicker";
const initialMessages = [
  {
    id: 1,
    createdTime: new Date("2023-12-15T10:30:00"),
    updateTime: new Date("2023-12-15T10:30:00"),
    text: "I need a job ad for a Marketing Manager",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 2,
    createdTime: new Date("2023-12-15T10:31:00"),
    updateTime: new Date("2023-12-15T10:31:00"),
    text: "Sure! Could you provide more details about the role?",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 3,
    createdTime: new Date("2023-12-15T10:32:30"),
    updateTime: new Date("2023-12-15T10:32:30"),
    text: "The candidate should have 5+ years of experience in digital marketing.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 4,
    createdTime: new Date("2023-12-15T10:33:15"),
    updateTime: new Date("2023-12-15T10:33:15"),
    text: "Got it. Should I highlight any specific tools or platforms?",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 5,
    createdTime: new Date("2023-12-15T10:34:00"),
    updateTime: new Date("2023-12-15T10:34:00"),
    text: "Yes, proficiency in Google Ads and SEO tools like SEMrush is a must.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 6,
    createdTime: new Date("2023-12-15T10:35:20"),
    updateTime: new Date("2023-12-15T10:35:20"),
    text: "Understood. Let me draft something for you.",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 7,
    createdTime: new Date("2023-12-15T10:32:30"),
    updateTime: new Date("2023-12-15T10:32:30"),
    text: "The candidate should have 5+ years of experience in digital marketing.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 8,
    createdTime: new Date("2023-12-15T10:33:15"),
    updateTime: new Date("2023-12-15T10:33:15"),
    text: "Got it. Should I highlight any specific tools or platforms?",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 9,
    createdTime: new Date("2023-12-15T10:34:00"),
    updateTime: new Date("2023-12-15T10:34:00"),
    text: "Yes, proficiency in Google Ads and SEO tools like SEMrush is a must.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 10,
    createdTime: new Date("2023-12-15T10:35:20"),
    updateTime: new Date("2023-12-15T10:35:20"),
    text: "Understood. Let me draft something for you.",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 11,
    createdTime: new Date("2023-12-15T10:32:30"),
    updateTime: new Date("2023-12-15T10:32:30"),
    text: "The candidate should have 5+ years of experience in digital marketing.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 12,
    createdTime: new Date("2023-12-15T10:33:15"),
    updateTime: new Date("2023-12-15T10:33:15"),
    text: "Got it. Should I highlight any specific tools or platforms?",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
  {
    id: 13,
    createdTime: new Date("2023-12-15T10:34:00"),
    updateTime: new Date("2023-12-15T10:34:00"),
    text: "Yes, proficiency in Google Ads and SEO tools like SEMrush is a must.",
    authorID: 1,
    authorAvatar: "https://picsum.photos/id/237/200/300",
    messageType: "outgoing", // Outgoing message
  },
  {
    id: 14,
    createdTime: new Date("2023-12-15T10:35:20"),
    updateTime: new Date("2023-12-15T10:35:20"),
    text: "Understood. Let me draft something for you.",
    authorID: 2,
    authorAvatar: "https://picsum.photos/seed/author2/200/300",
    messageType: "incoming", // Incoming message
  },
];

const choices = [
  {
    id: 1,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 2,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 3,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 4,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 5,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 6,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 7,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
  {
    id: 8,
    thumbnail: "https://picsum.photos/id/237/200/300",
    image: "https://picsum.photos/id/237/200/300",
    title: "Template 1",
    description: "",
  },
];

const DevelopmentScreen = () => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [messageStream, setMessageStream] = useState(initialMessages);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const addNewMessage = (newEntry) => {
    setMessageStream((prev) => [...prev, newEntry]);
  };

  const loadOlderMessages = (oldEntries) => {
    setMessageStream((prev) => [...oldEntries, prev]);
  };

  function updateSelectedIds(id: number) {
    let updatedArray = [...selectedIds]; // Start with the existing array
    if (selectedIds.includes(id)) {
      // If the id is already selected, remove it
      updatedArray = updatedArray.filter((item) => item !== id);
    } else {
      // Otherwise, add the id to the array
      updatedArray = [...updatedArray, id];
    }
    setSelectedIds(updatedArray); // Update the state
  }

  return (
    <>
      <MediaPicker
        companyId={"07380A22-AE08-FA44-975D-4233BFDB12A0"}
        aspectWidth={1920}
        aspectHeight={1080}
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={() => {}}
      />
      <div className="flex h-full">
        <div className="w-1/2">
          <div className="">
            <ButtonComponent
              colorScheme="primary"
              title="Media Picker"
              size="sm"
              onClick={() => setShowMediaPicker(true)}
            />
            <ButtonComponent
              colorScheme="warning"
              title="Template Picker"
              size="sm"
              onClick={() => setTemplateModalVisible(true)}
            />
          </div>
        </div>

        {/* ChatScreen Snippet */}
        <div className="w-1/2 h-full">
          <ChatWindow
            data={messageStream}
            loadOlderMessages={loadOlderMessages}
            addNewMessage={addNewMessage}
          />
        </div>
      </div>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Sachbearbeiter Innendienst (m/w/d)"
        text="Are you sure to take offline?"
        type="delete"
        onConfirm={() => setShowDeleteModal((prev) => !prev)}
        onClose={() => setShowDeleteModal((prev) => !prev)}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        title="Sachbearbeiter Innendienst (m/w/d)"
        text="Are you sure to take offline?"
        type="confirm"
        onConfirm={() => setShowConfirmModal((prev) => !prev)}
        onClose={() => setShowConfirmModal((prev) => !prev)}
      />

      <ChoiceSelectorModal
        gridStyle="grid-cols-1 md:grid-cols-2"
        visible={templateModalVisible}
        renderChoices={() =>
          choices.map((item, index) => (
            <TemplateCard
              active={selectedIds.includes(item?.id)}
              onClick={() => updateSelectedIds(item?.id)}
              key={index}
              {...item}
            />
          ))
        }
        title="Templates"
        text="Start by Choosing a Template"
        onConfirm={() => {
          console.log(selectedIds);
          setTemplateModalVisible((prev) => !prev);
        }}
        onClose={() => setTemplateModalVisible((prev) => !prev)}
      />
    </>
  );
};

export default DevelopmentScreen;
