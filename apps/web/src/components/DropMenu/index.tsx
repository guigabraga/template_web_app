import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useId, useState, type MouseEvent, type ReactNode } from "react";

export type DropMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export type DropMenuProps = {
  items: readonly DropMenuItem[];
  triggerIcon?: ReactNode;
};

export default function DropMenu({ items, triggerIcon = <MoreVertRoundedIcon /> }: DropMenuProps) {
  const menuId = useId();
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleItemClick = (item: DropMenuItem) => {
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
