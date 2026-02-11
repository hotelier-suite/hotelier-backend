import { DashboardWidget } from './';

describe('DashboardWidget Entity', () => {
  it('should create an instance', () => {
    const widget = new DashboardWidget();
    expect(widget).toBeDefined();
    expect(widget).toBeInstanceOf(DashboardWidget);
  });

  it('should accept all property assignments', () => {
    const widget = new DashboardWidget();
    widget.id = 1;
    widget.title = 'Revenue Chart';
    widget.type = 'chart';
    widget.configuration = { chartType: 'line', dataSource: 'revenue' };
    widget.position = 0;
    widget.visible = true;
    widget.userId = 1;
    widget.createdAt = new Date();
    widget.updatedAt = new Date();

    expect(widget.id).toBe(1);
    expect(widget.title).toBe('Revenue Chart');
    expect(widget.type).toBe('chart');
    expect(widget.configuration).toEqual({
      chartType: 'line',
      dataSource: 'revenue',
    });
    expect(widget.position).toBe(0);
    expect(widget.visible).toBe(true);
    expect(widget.userId).toBe(1);
  });
});
