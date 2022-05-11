import { routes } from "./routes";
export const loopMenuRoute = (route = routes) => {
  let tempRoute: any = [];
  const findRoute = (rt: any) => {
    rt.forEach((r: any) => {
      if (r?.routes) {
        findRoute(r?.routes);
      } else {
        tempRoute.push({ component: r.component, path: r.path });
      }
    });
  };
  findRoute(route);
  return tempRoute;
};
