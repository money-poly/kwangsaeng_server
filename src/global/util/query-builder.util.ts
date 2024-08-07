import { SelectQueryBuilder } from 'typeorm';

export class QueryBuilderUtil {
    private static isWhereConditionAdded<T>(qb: SelectQueryBuilder<T>): boolean {
        return qb.expressionMap.wheres.length > 0;
    }

    static addWhereCondition<T>(
        qb: SelectQueryBuilder<T>,
        condition: string,
        parameters?: Object,
    ): SelectQueryBuilder<T> {
        if (this.isWhereConditionAdded(qb)) {
            qb.andWhere(condition, parameters);
        } else {
            qb.where(condition, parameters);
        }
        return qb;
    }
}
