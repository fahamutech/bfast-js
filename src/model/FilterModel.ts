type BasicFilterModel<T> = {
    $and?: Array<FilterModel<T>>;
    $nor?: Array<FilterModel<T>>;
    $or?: Array<FilterModel<T>>;
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacraticSensitive?: boolean;
    };
    [key: string]: any
    // $where?: string | Function;
    // $comment?: string;
}

type FilterSelector<T> = {
    // Comparison
    $eq?: T;
    $gt?: T;
    $gte?: T;
    $in?: T[];
    $lt?: T;
    $lte?: T;
    $ne?: T;
    $nin?: T[];
    // Logical
    $not?: T extends string ? (FilterSelector<T> | RegExp) : FilterSelector<T>;
    // Element
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean;
    // Evaluation;
    // $expr?: any;
    // $jsonSchema?: any;
    // $mod?: T extends number ? [number, number] : never;
    $regex?: T extends string ? (RegExp | string) : never;
    // $options?: T extends string ? string : never;
    // Geospatial
    // TODO: define better types for geo queries
    $geoIntersects?: { $geometry: object };
    $geoWithin?: object;
    $near?: object;
    $nearSphere?: object;
    $maxDistance?: number;
    $maxDistanceInMiles: number;
    $maxDistanceInKilometers: number;
    $maxDistanceInRadians: number;
    // Array
    // TODO: define better types for $all and $elemMatch
    $all?: T extends Array<infer U> ? any[] : never;
    // $elemMatch?: T extends Array<infer U> ? object : never;
    // $size?: T extends Array<infer U> ? number : never;
    // // Bitwise
    // $bitsAllClear?: BitwiseQuery;
    // $bitsAllSet?: BitwiseQuery;
    // $bitsAnyClear?: BitwiseQuery;
    // $bitsAnySet?: BitwiseQuery;
}

type FilterCondition<T> = FilterAltQuery<T> | FilterSelector<FilterAltQuery<T>>;

type FilterAltQuery<T> =
    T extends Array<infer U> ? (T | FilterRegExpForString<U>) :
        FilterRegExpForString<T>;
type FilterRegExpForString<T> = T extends string ? (RegExp | T) : T;

export type FilterModel<T> = {
    [P in keyof T]?: FilterCondition<T[P]>;
} &
    BasicFilterModel<T>;
