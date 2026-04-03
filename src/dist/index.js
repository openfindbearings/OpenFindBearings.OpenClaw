import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";
const API_BASE = "https://api.515813.xyz/api/";
async function apiFetch(path, params) {
    const url = new URL(path, API_BASE);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== "")
                url.searchParams.set(k, v);
        }
    }
    const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`API ${res.status}: ${body}`);
    }
    return (await res.json());
}
function formatBearingTable(items, total, page) {
    if (items.length === 0) {
        return "未找到匹配的轴承，请尝试调整搜索条件。";
    }
    const header = "| 型号 | 品牌 | 内径(mm) | 外径(mm) | 宽度(mm) | 类型 |";
    const sep = "|------|------|----------|----------|----------|------|";
    const rows = items.map((b) => `| ${b.partNumber || "-"} | ${b.brandName || "-"} | ${b.innerDiameter ?? "-"} | ${b.outerDiameter ?? "-"} | ${b.width ?? "-"} | ${b.bearingTypeName || "-"} |`);
    return `找到 ${total} 条结果（第 ${page} 页）：\n\n${header}\n${sep}\n${rows.join("\n")}`;
}
const SearchParams = Type.Object({
    keyword: Type.Optional(Type.String({ description: "型号或品牌关键词" })),
    partNumber: Type.Optional(Type.String({ description: "精确型号" })),
    minInnerDiameter: Type.Optional(Type.Number({ description: "最小内径 mm" })),
    maxInnerDiameter: Type.Optional(Type.Number({ description: "最大内径 mm" })),
    minOuterDiameter: Type.Optional(Type.Number({ description: "最小外径 mm" })),
    maxOuterDiameter: Type.Optional(Type.Number({ description: "最大外径 mm" })),
    minWidth: Type.Optional(Type.Number({ description: "最小宽度 mm" })),
    maxWidth: Type.Optional(Type.Number({ description: "最大宽度 mm" })),
    brandId: Type.Optional(Type.String({ description: "品牌 ID" })),
    bearingTypeId: Type.Optional(Type.String({ description: "轴承类型 ID" })),
    page: Type.Optional(Type.Number({ description: "页码，默认 1" })),
    pageSize: Type.Optional(Type.Number({ description: "每页数量，默认 20" })),
});
const PartNumberParams = Type.Object({
    partNumber: Type.String({ description: "轴承型号，如 60025、6205" }),
});
const HotBearingsParams = Type.Object({
    count: Type.Optional(Type.Number({ description: "返回数量，默认 10" })),
});
export default definePluginEntry({
    id: "bearing-search",
    name: "Bearing Search",
    description: "搜索轴承产品数据库（型号、品牌、尺寸参数）",
    register(api) {
        api.registerTool({
            name: "bearing_search",
            description: "搜索轴承产品。支持按型号关键词、品牌、内径/外径/宽度尺寸范围等条件搜索。用户说「搜轴承」「查轴承」「找轴承」时使用此工具。",
            parameters: SearchParams,
            async execute(_id, params) {
                try {
                    const searchParams = {};
                    for (const [k, v] of Object.entries(params)) {
                        if (v !== undefined && v !== "")
                            searchParams[k] = String(v);
                    }
                    const res = await apiFetch("bearings/search", searchParams);
                    const items = res.data || [];
                    const text = formatBearingTable(items, res.totalCount, res.page);
                    return { content: [{ type: "text", text }] };
                }
                catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    return { content: [{ type: "text", text: `搜索失败：${msg}` }] };
                }
            },
        });
        api.registerTool({
            name: "bearing_get_by_part",
            description: "按精确型号查询轴承详情。用户给出明确型号（如 60025、6205-2RS）时使用此工具获取完整参数。",
            parameters: PartNumberParams,
            async execute(_id, rawParams) {
                const params = rawParams;
                try {
                    const res = await apiFetch(`bearings/by-part/${encodeURIComponent(params.partNumber)}`);
                    ;
                    if (!res.data) {
                        return { content: [{ type: "text", text: `未找到型号 ${params.partNumber}` }] };
                    }
                    const b = res.data;
                    const lines = [
                        `**${b.partNumber}**`,
                        `名称：${b.name || "-"}`,
                        `品牌：${b.brandName || "-"}`,
                        `内径：${b.innerDiameter} mm`,
                        `外径：${b.outerDiameter} mm`,
                        `宽度：${b.width} mm`,
                        `类型：${b.bearingTypeName || "-"}`,
                    ];
                    if (b.brandCountry)
                        lines.push(`品牌产地：${b.brandCountry}`);
                    if (b.originCountry)
                        lines.push(`产地：${b.originCountry}`);
                    if (b.weight !== undefined && b.weight !== null)
                        lines.push(`重量：${String(b.weight)} kg`);
                    return { content: [{ type: "text", text: lines.join("\n") }] };
                }
                catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    return { content: [{ type: "text", text: `查询失败：${msg}` }] };
                }
            },
        });
        api.registerTool({
            name: "bearing_hot",
            description: "获取热门轴承推荐列表。用户问「热门轴承」「推荐轴承」时使用。",
            parameters: HotBearingsParams,
            async execute(_id, params) {
                try {
                    const query = {};
                    if (params.count)
                        query.count = String(params.count);
                    const res = await apiFetch("bearings/hot", query);
                    const items = res.data || [];
                    const text = formatBearingTable(items, items.length, 1);
                    return { content: [{ type: "text", text: `热门轴承推荐：\n\n${text}` }] };
                }
                catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    return { content: [{ type: "text", text: `获取热门轴承失败：${msg}` }] };
                }
            },
        });
    },
});
//# sourceMappingURL=index.js.map