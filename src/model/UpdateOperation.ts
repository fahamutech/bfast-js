export interface UpdateOperation<T> {

}

export interface UpdateModel {
    $set?: {},
    $inc?: {},
    $currentDate?: {},
    $min?: {},
    $max?: {},
    $mul?: {},
    $rename?: {},
    $unset?: {}
}
