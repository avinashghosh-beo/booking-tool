import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { encryptData, decryptData } from "../utils/crypto";
import { useDispatch } from "react-redux";
import {
  setAllCompaniesList,
  setSelectedCompaniesList,
} from "../store/slices/companyDataSlice"; 

interface Privilege {
  _id: string;
  menu: number;
  userType: number;
  status: boolean;
  add: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  count: boolean;
}

interface Menu {
  _id: number;
  label: string;
  sequence: number;
  icon: string;
  path: string;
  element: string;
  status: boolean;
  hideMenu: boolean;
  hideHeader: boolean;
  showInMenu: boolean;
  privilege: Privilege;
  submenus: any[];
}

interface Company {
  id: string;
  value: string;
}

interface User {
  id: string;
  companies: Company[];
  firstName: string;
  lastName: string;
  email: string;
}
interface ApiResponse {
  menu: Menu[];
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface AuthContextType {
  loading: boolean;
  auth: ApiResponse | null;
  login: (data: ApiResponse) => Promise<void>;
  logout: () => void;
  updateSelectedCompanies: (companyIds: string[]) => void;
  patchCompanyLogo: (companyId: string, logo: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    // retrieve app_data
    const storedUser = localStorage.getItem("app_data");
    if (storedUser) {
      const decryptedUser = decryptData(storedUser);
      if (decryptedUser) {
        dispatch(setAllCompaniesList(decryptedUser?.user?.companies));
        setAuth(decryptedUser as ApiResponse);
      }
    }
    const selectedCompanyIds = localStorage.getItem("sc");
    if (selectedCompanyIds) {
      const decryptedIds = decryptData(selectedCompanyIds);
      if (decryptedIds) {
        dispatch(setSelectedCompaniesList(decryptedIds));
      }
    }

    setLoading(false);
  }, []);

  const patchCompanyLogo = async (companyId: string, logo: string) => {
    try {
      let appData = localStorage.getItem("app_data");
      appData = decryptData(appData);
      let tempCompanies = appData?.user?.companies;
      tempCompanies = tempCompanies.map((item: any) => {
        if (item.id === companyId) {
          item.logo = logo;
        }
        return item;
      });
      appData.user.companies = tempCompanies;
      const encryptedData = encryptData(appData);
      localStorage.setItem("app_data", encryptedData);
      dispatch(setAllCompaniesList(appData?.user?.companies));
      setAuth(appData);
    } catch (error) {
      console.log("ERR");
    }
  };

  const login = async (data: ApiResponse): Promise<void> => {
    try {
      //New Implementation of company selection 
      let allCompanyIds = data?.user?.companies?.map((item) => item?.id);
      dispatch(setAllCompaniesList(data?.user?.companies));
      dispatch(setSelectedCompaniesList(allCompanyIds));

      //save data to the context state
      setAuth(data);

      // encrypt data for persistance and retrieval
      const encryptedData = encryptData(data);
      localStorage.setItem("app_data", encryptedData);

      const selectedCompanyIds = encryptData(allCompanyIds);
      localStorage.setItem("sc", selectedCompanyIds);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = (): void => {
    // Clear user state and localStorage
    setAuth(null);
    localStorage.removeItem("app_data");
    localStorage.removeItem("sc");
  };

  const updateSelectedCompanies = (companyIds: string[]): void => {
    try {
      dispatch(setSelectedCompaniesList(companyIds));
      const selectedCompanyIds = encryptData(companyIds);
      localStorage.setItem("sc", selectedCompanyIds);
    } catch (error) {
      console.error("Failed to update selected companies:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        login,
        logout,
        updateSelectedCompanies,
        patchCompanyLogo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
