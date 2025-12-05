export interface Comparator<T> {
    compare(a: T, b: T): number;
}


//
//  Сравнивает два объекта.
//  < 0  — a < b
//  = 0  — a == b
//  > 0  — a > b
//