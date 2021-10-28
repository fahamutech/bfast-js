import {YMap} from "yjs/dist/src/types/YMap";
import {CacheAdapter} from "../adapters/cache.adapter";
import {ConstantUtil} from "./constant.util";
import {SyncsModel} from "../models/syncs.model";
import {sha1} from "crypto-hash";

export function set(
    value: { id: string, [key: string]: any }, yMap: YMap<any> | undefined
): { s: boolean, m: string, r: string } {
    if (!yMap || !value) {
        return {
            s: false,
            m: 'one of parameter is null',
            r: 'no',
        };
    }
    if (value._created_at && typeof value._created_at === "string") {
        value.createdAt = value._created_at;
        delete value._created_at;
    }
    if (value._updated_at && typeof value._updated_at === "string") {
        value.updatedAt = value._updated_at;
        delete value._updated_at;
    }
    if (typeof value?.createdAt === "object") {
        value.createdAt = '2020-09-01';
    }
    if (typeof value?.updatedAt === "object") {
        value.updatedAt = '2020-09-01';
    }
    if (!value.hasOwnProperty('createdAt')) {
        value.createdAt = new Date().toISOString();
    }
    if (!value.hasOwnProperty('updatedAt')) {
        value.updatedAt = new Date().toISOString();
    }
    if (value.hasOwnProperty('id')) {
        yMap.set(value.id, value);
        return {
            m: 'done',
            s: true,
            r: 'Ok'
        }
    } else {
        return {
            s: false,
            m: 'please doc must have id field',
            r: JSON.stringify(value, null, 4)
        };
        // throw {message: 'please doc must have id/_id field', data: JSON.stringify(value, null, 4)};
    }
}

export async function addSyncs(data: SyncsModel, database: string, cacheAdapter: CacheAdapter): Promise<any> {
    if (!data?.payload?.hasOwnProperty('id')) {
        console.log('can not add data for syncs it does not have id field');
        return null;
    }
    const _sha1 = await sha1(JSON.stringify(data));
    return cacheAdapter.set(
        _sha1,
        data,
        database,
        ConstantUtil.SYNCS_TABLE
    );
}

export async function getSyncsKeys(database: string, cacheAdapter: CacheAdapter): Promise<string[]> {
    return cacheAdapter.keys(database, ConstantUtil.SYNCS_TABLE);
}

export async function getAllSyncs(database: string, cacheAdapter: CacheAdapter): Promise<SyncsModel[]> {
    return cacheAdapter.getAll(database, ConstantUtil.SYNCS_TABLE);
}

export async function getOneSyncs(database: string, key: string, cacheAdapter: CacheAdapter): Promise<SyncsModel> {
    return await cacheAdapter.get(key, database, ConstantUtil.SYNCS_TABLE) as any;
}

export async function removeOneSyncs(key: string, database: string, cacheAdapter: CacheAdapter): Promise<any> {
    return cacheAdapter.remove(key, database, ConstantUtil.SYNCS_TABLE);
}

export async function removeAllSyncs(database: string, cacheAdapter: CacheAdapter): Promise<any> {
    return cacheAdapter.clearAll(database, ConstantUtil.SYNCS_TABLE);
}
