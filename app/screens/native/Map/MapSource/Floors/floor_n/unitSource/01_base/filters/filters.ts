import filterMaker from "@/functions/MapView/filter"

const BASE_CATEGORIES = {
    atrium: "opentobelow",
    wall: "concrete",
}

export const BASE_FILTERS = filterMaker(BASE_CATEGORIES);