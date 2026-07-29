import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DropMenu, type TDropMenuItem } from "../../../../../../../../components";
import { useAuthStore, type TAuthUser } from "../../../../../../../../stores";

const getUserInitials = (user: TAuthUser | null) => {
  const userName =
    user?.displayName?.trim() || user?.username?.trim() || user?.email?.split("@")[0]?.trim() || "Usuário";
  const nameParts = userName.split(/\s+/).filter(Boolean);

  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toLocaleUpperCase("pt-BR");
  }

  return nameParts[0].slice(0, 2).toLocaleUpperCase("pt-BR");
};

export default function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    navigate("/login", { replace: true });
    clearSession();
  };

  const items: TDropMenuItem[] = [
    {
      id: "logout",
      label: "Sair",
      icon: <LogoutRoundedIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ];

  return (
    <DropMenu
      items={items}
      triggerIcon={
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "text.primary",
            color: "background.default",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {getUserInitials(user)}
        </Avatar>
      }
    />
  );
}
