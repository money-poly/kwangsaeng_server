import { SelectQueryBuilder } from 'typeorm';

function isWhereConditionAdded<T>(qb: SelectQueryBuilder<T>): boolean {
    return qb.expressionMap.wheres.length > 0;
}

export function addWhereCondition<T>(
    qb: SelectQueryBuilder<T>,
    condition: string,
    parameters?: Object,
): SelectQueryBuilder<T> {
    if (isWhereConditionAdded(qb)) {
        qb.andWhere(condition, parameters);
    } else {
        qb.where(condition, parameters);
    }
    return qb;
}
