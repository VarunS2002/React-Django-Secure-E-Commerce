import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
} from '@material-ui/core';

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
      TransitionComponent={Zoom}
      placement="right"
    >
      <ListItem button onClick={onClick} disabled={disabled}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </Tooltip>
  );
}

DrawerItem.defaultProps = {
  onClick: undefined,
  disabled: undefined,
};

export default DrawerItem;
