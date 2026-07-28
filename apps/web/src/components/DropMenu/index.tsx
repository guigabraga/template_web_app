import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useId, useState, type MouseEvent, type ReactNode } from "react";

export type TDropMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export type TDropMenuProps = {
  items: readonly TDropMenuItem[];
  triggerIcon?: ReactNode;
};

export default function DropMenu({ items, triggerIcon = <MoreVertRoundedIcon /> }: TDropMenuProps) {
  const menuId = useId();
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleItemClick = (item: TDropMenuItem) => {
    handleClose();
    item.onClick?.();
  };

  return (
    <>
      <IconButton
        aria-label="Abrir menu de opções"
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen ? "true" : undefined}
        aria-haspopup="menu"
        disabled={items.length === 0}
        onClick={handleOpen}
        sx={(theme) => ({
          color: theme.palette.mode === "light" ? theme.palette.common.black : theme.palette.text.primary,
        })}
      >
        {triggerIcon}
      </IconButton>

      <Menu
        id={menuId}
        anchorEl={anchorElement}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          list: {
            sx: {
              px: 1,
            },
          },
          paper: {
            sx: {
              borderRadius: 2,
            },
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.id}
            disabled={item.disabled}
            selected={item.selected}
            onClick={() => handleItemClick(item)}
            sx={{
              mt: index === 0 ? 0 : 0.5,
              borderRadius: 1,
              color: (theme) =>
                theme.palette.mode === "light" ? theme.palette.common.black : theme.palette.text.primary,
              "& .MuiListItemIcon-root": {
                color: "inherit",
              },
            }}
          >
            {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
