import type { Point, RouteFormData } from "../types";
import type { CreateRoutePayload, UpdateRoutePayload } from "./api";

export function routeToCreatePayload(route: RouteFormData, path?: Point[]): CreateRoutePayload {
    const payload: CreateRoutePayload = {
        route_id: route.id.value,
        route_short_name: route.routeName.value,
        route_type: route.routeType
    };

    if (route.routeLongName?.value) payload.route_long_name = route.routeLongName.value;
    if (route.routeDesc?.value) payload.route_desc = route.routeDesc.value;
    if (route.routeUrl?.value) payload.route_url = route.routeUrl.value;
    if (route.routeColor?.value) payload.route_color = route.routeColor.value;
    if (route.routeTextColor?.value) payload.route_text_color = route.routeTextColor.value;
    if (route.routeSortOrder !== undefined) payload.route_sort_order = route.routeSortOrder;
    if (route.continuousPickup?.value) payload.continuous_pickup = route.continuousPickup.value;
    if (route.continuousDropOff?.value) payload.continuous_drop_off =  route.continuousDropOff.value;
    if (route.networkId?.value) payload.network_id = route.networkId.value;
    if (route.cemvSupport?.value) payload.cemv_support = route.cemvSupport.value;
    if (path && path.length > 0) payload.route_path = path;

    return payload;
}

export function routeToUpdatePayload(route: RouteFormData, path?: Point[]): UpdateRoutePayload {
    return routeToCreatePayload(route, path)
}
