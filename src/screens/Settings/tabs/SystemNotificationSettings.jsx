import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ButtonComponent } from "../../../components/common/Button";
import { AddOutlineIcon, TrashIcon } from "../../../components/icons";
import AccordionList from "../../../components/common/Accordion";
import ConfirmationModal from "../../../components/modals/Confirmation";
import CompaniesSelector from "../../../components/modals/CompaniesSelector";
import {
  addCompaniesToGroup,
  addRecipientsToGroup,
  createNotificationGroup,
  deleteCompaniesFromGroup,
  deleteNotificationGroup,
  deleteRecipientsFromGroup,
  fetchNotificationSettings,
} from "../api";
import InviteRecipient from "../../../components/modals/InviteRecipient";
import CreateNotificationGroup from "../../../components/modals/CreateNotificationGroup";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "../../../contexts/AuthContext";

const SystemNotificationSettings = () => {
  const { auth } = useAuth();
  const [showDeleteGroupPrompt, setShowDeleteGroupPrompt] = useState(null);
  const queryClient = useQueryClient();
  const { selectedCompanies, companies } = useSelector(
    (state) => state.companies
  );
  const [showCompaniesModal, setShowCompaniesModal] = useState(false);
  const [companiesModalData, setCompaniesModalData] = useState(null);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [recipientModalData, setRecipientModalData] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [createGroupModalData, setCreateGroupModalData] = useState(null);
  const allowModification = auth?.user?.rights?.ModifyNotificationSettings;

  const {
    data: notificationSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notificationSettings", selectedCompanies],
    queryFn: () => fetchNotificationSettings({ company: selectedCompanies }),
    enabled: selectedCompanies?.length > 0,
  });

  // Mutations
  const deleteGroupMutation = useMutation({
    mutationFn: deleteNotificationGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
      setShowDeleteGroupPrompt(null);
    },
  });

  const addCompaniesMutation = useMutation({
    mutationFn: ({ groupId, companies }) =>
      addCompaniesToGroup(groupId, companies),
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
    },
    onSettled: () => {
      setShowCompaniesModal(false);
      setCompaniesModalData(null);
    },
  });

  const removeCompanyMutation = useMutation({
    mutationFn: ({ groupId, companyId }) =>
      deleteCompaniesFromGroup(groupId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
    },
  });

  const addRecipientMutation = useMutation({
    mutationFn: ({ groupId, recipients }) =>
      addRecipientsToGroup(groupId, recipients),
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
    },
    onSettled: () => {
      setShowRecipientsModal(false);
      setRecipientModalData(null);
    },
  });

  const removeRecipientMutation = useMutation({
    mutationFn: ({ groupId, recipient }) =>
      deleteRecipientsFromGroup(groupId, recipient),
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createNotificationGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationSettings"]);
    },
    onSettled: () => {
      setShowCreateGroupModal(false);
      setCreateGroupModalData(null);
    },
  });

  const handleCloseCreateGroupModal = (newGroup) => {
    if (newGroup) {
      createGroupMutation.mutate({
        ...createGroupModalData,
        ...newGroup,
      });
    } else {
      setShowCreateGroupModal(false);
      setCreateGroupModalData(null);
    }
  };

  const handleCloseCompaniesModal = (newCompany) => {
    if (newCompany) {
      addCompaniesMutation.mutate({
        ...companiesModalData,
        companies: newCompany.value,
      });
    } else {
      setShowCompaniesModal(false);
      setCompaniesModalData(null);
    }
  };

  const handleCloseRecipientsModal = (newRecipient, inviteType) => {
    if (newRecipient) {
      let payload = {
        isOrderer: false,
      };
      if (inviteType === "email") {
        payload.type = "EMAIL";
        payload.email = newRecipient;
      } else {
        payload.type = "USER";
        payload.userId = newRecipient;
      }
      addRecipientMutation.mutate({
        ...recipientModalData,
        recipients: payload,
      });
    } else {
      setShowRecipientsModal(false);
      setRecipientModalData(null);
    }
  };

  if (!selectedCompanies?.length) {
    return (
      <div className="text-center text-gray-600">
        Please select at least one company to view notification settings.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-pulse h-12 w-full md:w-96 bg-gray-200 rounded-md"></div>
        <div className="animate-pulse h-24 w-full bg-gray-200 mt-4 rounded-md" />
        <div className="animate-pulse h-24 w-full bg-gray-200 mt-4 rounded-md" />
        <div className="animate-pulse h-24 w-full bg-gray-200 mt-4 rounded-md" />
        <div className="animate-pulse h-24 w-full bg-gray-200 mt-4 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger-600">
        Error loading notification settings. Please try again.
      </div>
    );
  }

  const accordionItems = notificationSettings?.data?.records.map(
    (notification) => ({
      title: (
        <div>
          <h2 className="font-medium text-gray-800">{notification.name}</h2>
          <p className="text-gray-600 mt-1">{notification.description}</p>
        </div>
      ),
      content: (
        <div className="mt-4 h-fit">
          {notification.groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg mt-4 border border-gray-200 "
            >
              <div className="p-3 border-b flex justify-between items-center bg-primary-50">
                <h3 className="font-medium text-gray-700">{group.name}</h3>
                <div className="flex items-center gap-2">
                  <ButtonComponent
                    disabled={!allowModification}
                    size="sm"
                    onClick={() => setShowDeleteGroupPrompt(group.id)}
                    colorScheme="transparent"
                    icon={<TrashIcon className="w-4 h-4 text-danger-600" />}
                  />
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-md font-medium">Companies</span>

                      <ButtonComponent
                        disabled={!allowModification}
                        size="sm"
                        onClick={() => {
                          setCompaniesModalData({
                            notificationId: notification.id,
                            groupId: group.id,
                            companyIDs: group.companies.map((c) => c.id),
                          });
                          setShowCompaniesModal(true);
                        }}
                        colorScheme="transparent"
                        icon={
                          <AddOutlineIcon className="w-4 h-4 text-primary-600" />
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      {group.companies.map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center justify-between bg-white hover:bg-gray-50 p-2 pr-0 rounded"
                        >
                          <span className="text-gray-700 text-sm">
                            {company.name}
                          </span>

                          <ButtonComponent
                            disabled={!allowModification}
                            size="sm"
                            onClick={() =>
                              removeCompanyMutation.mutate({
                                groupId: group.id,
                                companyId: company.id,
                              })
                            }
                            colorScheme="transparent"
                            icon={
                              <TrashIcon className="w-4 h-4 text-danger-600" />
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-md font-medium">Recipients</span>
                      <ButtonComponent
                        disabled={!allowModification}
                        size="sm"
                        onClick={() => {
                          setRecipientModalData({
                            notificationId: notification.id,
                            groupId: group.id,
                          });
                          setShowRecipientsModal(true);
                        }}
                        colorScheme="transparent"
                        icon={
                          <AddOutlineIcon className="w-4 h-4 text-primary-600" />
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      {group.recipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center justify-between bg-white hover:bg-gray-50 p-2 pr-0 rounded"
                        >
                          <span className="text-gray-700 text-sm">
                            {recipient.type === "USER"
                              ? `${recipient.firstName} ${recipient.lastName}`
                              : recipient.id}
                          </span>
                          <ButtonComponent
                            disabled={!allowModification}
                            size="sm"
                            onClick={() =>
                              removeRecipientMutation.mutate({
                                groupId: group.id,
                                recipient: recipient.id,
                              })
                            }
                            colorScheme="transparent"
                            icon={
                              <TrashIcon className="w-4 h-4 text-danger-600" />
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <ButtonComponent
              disabled={!allowModification}
              buttonStyle="px-4 mt-2"
              size="sm"
              onClick={() => {
                setShowCreateGroupModal(true);
                setCreateGroupModalData({
                  notificationTypeId: notification.id,
                });
              }}
              colorScheme="primary"
              className="w-full"
              title={"Add New Company Group"}
              icon={<AddOutlineIcon />}
            />
          </div>
        </div>
      ),
    })
  );

  return (
    <>
      <div>
        <h1 className="text-[#0066ff] text-2xl font-medium mb-6">
          Who should get the Notification?
        </h1>

        <AccordionList items={accordionItems} allowFullHeight={true} />
      </div>
      <ConfirmationModal
        isLoading={deleteGroupMutation.isLoading}
        type="confirm"
        visible={showDeleteGroupPrompt !== null}
        title={"Delete Group"}
        text={"Are you sure you want to delete this group?"}
        onClose={() => setShowDeleteGroupPrompt(null)}
        onConfirm={() => deleteGroupMutation.mutate(showDeleteGroupPrompt)}
      />

      <CreateNotificationGroup
        isVisible={showCreateGroupModal}
        onClose={handleCloseCreateGroupModal}
        loading={createGroupMutation.isLoading}
      />

      <InviteRecipient
        isVisible={showRecipientsModal}
        onClose={handleCloseRecipientsModal}
        loading={addRecipientMutation.isLoading}
      />

      <CompaniesSelector
        selectedCompanyIds={companiesModalData?.companyIDs}
        isVisible={showCompaniesModal}
        onClose={handleCloseCompaniesModal}
        loading={addCompaniesMutation.isLoading}
      />
    </>
  );
};

export default SystemNotificationSettings;
