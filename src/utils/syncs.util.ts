import {YMap} from "yjs/dist/src/types/YMap";
import {CacheAdapter} from "../adapters/cache.adapter";
import {ConstantUtil} from "./constant.util";
import {YMapEvent} from "yjs";
import {sha1} from "crypto-hash";
import {SyncsModel} from "../models/syncs.model";

export function set(
    value: { id: string, [key: string]: any },
    yMap: YMap<any> | undefined
): { s: boolean, m: string, r: string } {
    if (!yMap || !value) {
        return {
            s: false,
            m: 'one of parameter is null',
            r: 'no',
        };
    }
    if (value._created_at && typeof value._created_at === "string" ) {
        value.createdAt = value._created_at;
        delete value._created_at;
    }
    if (value._updated_at && typeof value._updated_at === "string" ) {
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

export function sanitiseDocIdForUser(doc: any) {
    if (!doc) {
        return null;
    }
    if (doc._id) {
        doc.id = doc._id;
        delete doc._id;
    }
    return doc;
}

export async function addSyncs(
    projectId: string,
    data: SyncsModel,
    cacheAdapter: CacheAdapter
): Promise<any> {
    const _sha1 = await sha1(JSON.stringify(data));
    return cacheAdapter.set(
        _sha1,
        data,
        projectId,
        ConstantUtil.SYNCS_TABLE
    );
}

export async function getSyncsKeys(
    projectId: string,
    cacheAdapter: CacheAdapter
): Promise<string[]> {
    return cacheAdapter.keys(projectId, ConstantUtil.SYNCS_TABLE);
}

export async function getAllSyncs(
    projectId: string,
    cacheAdapter: CacheAdapter
): Promise<SyncsModel[]> {
    return cacheAdapter.getAll(projectId, ConstantUtil.SYNCS_TABLE);
}

export async function getOneSyncs(
    projectId: string,
    key: string,
    cacheAdapter: CacheAdapter
): Promise<SyncsModel> {
    return await cacheAdapter.get(key, projectId, ConstantUtil.SYNCS_TABLE) as any;
}

export async function removeOneSyncs(
    key: string,
    projectId: string,
    cacheAdapter: CacheAdapter
): Promise<any> {
    return cacheAdapter.remove(key, projectId, ConstantUtil.SYNCS_TABLE);
}

export async function removeAllSyncs(
    projectId: string,
    cacheAdapter: CacheAdapter
): Promise<any> {
    return cacheAdapter.clearAll(projectId, ConstantUtil.SYNCS_TABLE);
}

export async function observe(
    tEvent: YMapEvent<any>,
    projectId: string,
    tree: string,
    yMap: YMap<any> | undefined,
    cacheAdapter: CacheAdapter
) {
    if (!yMap) {
        return;
    }
    for (const key of Array.from(tEvent.keys.keys())) {
        switch (tEvent?.keys?.get(key)?.action) {
            case "add":
                addSyncs(
                    projectId,
                    {
                        action: "create",
                        tree,
                        payload: sanitiseDocIdForUser(yMap.get(key))
                    },
                    cacheAdapter
                ).catch(console.log);
                break;
            case "delete":
                addSyncs(
                    projectId,
                    {
                        action: "delete",
                        tree,
                        payload: {id: key}
                    },
                    cacheAdapter
                ).catch(console.log);
                break;
            case "update":
                const d = sanitiseDocIdForUser(yMap?.get(key));
                const od = sanitiseDocIdForUser(tEvent?.keys?.get(key)?.oldValue);
                const shaOfOld = await sha1(JSON.stringify(od));
                const shaOfNew = await sha1(JSON.stringify(d));
                if (!Array.isArray(d) && (shaOfNew !== shaOfOld)) {
                    addSyncs(
                        projectId,
                        {
                            action: "update",
                            tree,
                            payload: sanitiseDocIdForUser(yMap?.get(key))
                        },
                        cacheAdapter
                    ).catch(console.log);
                }
                break;
        }
    }
}
