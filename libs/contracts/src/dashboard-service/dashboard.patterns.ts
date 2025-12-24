export const DASHBOARD_PATTERNS = {
  // Widget patterns
  WIDGET_CREATE: 'dashboard.widget.create',
  WIDGET_FIND_ALL: 'dashboard.widget.findAll',
  WIDGET_FIND_ONE: 'dashboard.widget.findOne',
  WIDGET_UPDATE: 'dashboard.widget.update',
  WIDGET_DELETE: 'dashboard.widget.delete',
  WIDGET_FIND_BY_USER: 'dashboard.widget.findByUser',

  // Statistics patterns
  STATS_GET: 'dashboard.stats.get',
  STATS_OCCUPANCY: 'dashboard.stats.occupancy',
  STATS_REVENUE: 'dashboard.stats.revenue',
  STATS_TOP_ROOMS: 'dashboard.stats.topRooms',
  STATS_RECENT_ACTIVITIES: 'dashboard.stats.recentActivities',
} as const;
