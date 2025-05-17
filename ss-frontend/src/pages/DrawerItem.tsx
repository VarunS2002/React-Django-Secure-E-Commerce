import React from 'react';
import type { JSX } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
} from '@mui/material';

type Props = {
  title: string,
  icon: JSX.Element,
  onClick?: () => void,
  shouldDisplayTooltip: boolean,
  disabled?: boolean,
};

function DrawerItem({
  shouldDisplayTooltip,
  title,
  icon,
  onClick,
  disabled,
}: Props): JSX.Element {
  return (
    <Tooltip
      title={shouldDisplayTooltip ? title : ''}
      aria-label={title.toLowerCase()}
      arrow
      enterTouchDelay={100}
      leaveTouchDelay={shouldDisplayTooltip ? 1500 : 0}
      slots={{
        transition: Zoom,
      }}
      placement="right"
    >
      <ListItemButton onClick={onClick} disabled={disabled}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </Tooltip>
  );
}

DrawerItem.defaultProps = {
  onClick: undefined,
  disabled: undefined,
};

export default DrawerItem;
