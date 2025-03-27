import React from "react";
import { ButtonComponent } from "../../../components/common/Button";
import { SidebarOpenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TempalteActions = ({ id }) => {
  const navigate = useNavigate();
  return <ButtonComponent title="Open Builder" onClick={() => navigate(`/templates/builder/${id}`)} colorScheme="primary" size="sm" icon={<SidebarOpenIcon />} />;
};

export default TempalteActions;
