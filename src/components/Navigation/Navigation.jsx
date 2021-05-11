import React, { useMemo } from 'react';
import DrawerLeft from 'components/DrawerLeft';
import ExploreIcon from '@material-ui/icons/Explore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { EXPLORE_ROUTE, PROFILE_ROUTE, SELL_ROUTE } from 'routing/helpers';
import { useMediaQuery } from '@material-ui/core';
import SimpleBottomNavigation from 'components/SimpleBottomNavigation';
import routeIsAncestor from 'utils/routing';

const sections = [
  {
    route: EXPLORE_ROUTE,
    label: 'Explore',
    icon: <ExploreIcon />,
  },
  {
    route: SELL_ROUTE,
    label: 'Sell',
    icon: <ImportContactsIcon />,
  },
  {
    route: PROFILE_ROUTE,
    label: 'Profile',
    icon: <AccountCircleIcon />,
  },
];

export default function Navigation({ children, selectedRoute, changeSection }) {
  const [selectedSection, selectedIndex] = useMemo(() => {
    const index = sections.findIndex((section) =>
      routeIsAncestor(section.route, selectedRoute)
    );
    return [sections[index], index];
  }, [selectedRoute]);
  const downXSmall = useMediaQuery((theme) =>
    theme.breakpoints.down(theme.breakpoints.values.smmd)
  );

  return (
    <div style={{ width: '100%' }}>
      {downXSmall ? (
        <SimpleBottomNavigation
          title="Books"
          content={children}
          selectedSection={selectedSection}
          selectedIndex={selectedIndex}
          sections={sections}
          changeSection={changeSection}
        />
      ) : (
        <DrawerLeft
          title="Books"
          content={children}
          selectedSection={selectedSection}
          selectedIndex={selectedIndex}
          sections={sections}
          changeSection={changeSection}
        />
      )}
    </div>
  );
}
