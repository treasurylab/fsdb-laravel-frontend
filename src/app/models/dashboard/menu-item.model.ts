export class MenuItem {
  code: string;
  name: string;
  menu_icon: string | null;
  route: string | null;
  children: MenuItem[] | undefined;

  constructor(
    code: string,
    name: string,
    menu_icon: string | null,
    route: string | null,
    children?: MenuItem[]
  ) {
    this.code = code;
    this.name = name;
    this.menu_icon = menu_icon;
    this.route = route;
    this.children = children;
  }
}

export function convertDataToModel(data: any[]): MenuItem[] {
  return data.map((item) => {
    const children = item.children
      ? convertDataToModel(item.children)
      : undefined;
    return new MenuItem(
      item.code,
      item.name,
      item.menu_icon,
      item.route,
      children
    );
  });
}
