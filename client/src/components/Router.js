import React from 'react';

import Empty from "../screens/Empty";
import Create from "../screens/Create";
import Check from "../screens/Check";
import Archive from "../screens/Archive";
import Guests from "../screens/Guests";
import Reservation from "../screens/Reservation";
import TodayTomorrow from "../screens/TodayTomorrow";

function Router({window}) {
    if (window === 'empty') return <Empty />
    if (window === 'create') return <Create />
    if (window === 'check') return <Check />
    if (window === 'archive') return <Archive />
    if (window === 'guests') return <Guests />
    if (window === 'reservation') return <Reservation />
    if (window === 'today-tomorrow') return <TodayTomorrow />
}

export default Router;