import React, { useState } from 'react';
import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Feedback,
  Info,
  Shop,
  Store,
} from '@mui/icons-material';
import { UserTypes } from 'utilities/abstractions';
import DrawerItem from 'pages/DrawerItem';
import About from 'pages/About';
import FeedbackForm from 'pages/FeedbackForm';

type Props = {
  section: number,
  userType: UserTypes | null,
  navigationBarIsOpen: boolean | null,
  setNavigationBarIsOpen: Dispatch<SetStateAction<boolean>>,
};

function DrawerItems({
  section,
  userType,
  navigationBarIsOpen,
  setNavigationBarIsOpen,
}: Props): JSX.Element {
  const shouldDisplayTooltip = navigationBarIsOpen === false;
  const navigate = useNavigate();
  const location = useLocation();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const closeAndRedirect = (route: string): void => {
    setNavigationBarIsOpen(false);
    if (location.pathname !== route) {
      if (shouldDisplayTooltip) {
        navigate(route);
      } else {
        setTimeout(() => {
          navigate(route);
        }, 300);
      }
    }
  };

  const openAboutDialog = (): void => {
    setNavigationBarIsOpen(false);
    if (shouldDisplayTooltip) {
      setAboutDialogOpen(true);
    } else {
      setTimeout(() => {
        setAboutDialogOpen(true);
      }, 300);
    }
  };

  const openFeedbackForm = (): void => {
    setNavigationBarIsOpen(false);
    if (shouldDisplayTooltip) {
      setFeedbackOpen(true);
    } else {
      setTimeout(() => {
        setFeedbackOpen(true);
      }, 300);
    }
  };

  const customer = (): JSX.Element => (
    <DrawerItem
      title="Store"
      icon={<Shop />}
      onClick={() => closeAndRedirect('/store')}
      shouldDisplayTooltip={shouldDisplayTooltip}
    />
  );

  const seller = (): JSX.Element => (
    <DrawerItem
      title="Listings"
      icon={<Store />}
      onClick={() => closeAndRedirect('/listings')}
      shouldDisplayTooltip={shouldDisplayTooltip}
    />
  );

  const feedback = (): JSX.Element => (
    <>
      <DrawerItem
        title="Feedback"
        icon={<Feedback />}
        onClick={openFeedbackForm}
        shouldDisplayTooltip={shouldDisplayTooltip}
      />
      <FeedbackForm open={feedbackOpen} setOpen={setFeedbackOpen} />
    </>
  );

  if (section === 1 && userType !== null) {
    return (
      <div>
        {(() => {
          switch (userType) {
            case UserTypes.Customer:
              return (
                <>
                  {customer()}
                  {feedback()}
                </>
              );
            case UserTypes.Seller:
              return (
                <>
                  {seller()}
                  {feedback()}
                </>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  }
  return (
    <>
      <div>
        <DrawerItem
          title="About"
          icon={<Info />}
          onClick={openAboutDialog}
          shouldDisplayTooltip={shouldDisplayTooltip}
        />
      </div>
      <About
        open={aboutDialogOpen}
        setOpen={setAboutDialogOpen}
      />
    </>
  );
}

export default DrawerItems;
